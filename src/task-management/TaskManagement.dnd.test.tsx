import {
  act,
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createEmptyAppState,
  type AppState,
  type StoredTask,
  type TaskColumns,
} from '../domain/model';
import { useAppDispatch, useAppState } from '../state/AppStateContext';
import { AppStateProvider } from '../state/AppStateProvider';
import {
  STORAGE_KEY,
  appStateSchema,
  type AppStateStorage,
} from '../storage/appStateStorage';

interface CapturedHandlers {
  onDragStart?: (event: unknown) => void;
  onDragOver?: (event: unknown) => void;
  onDragEnd?: (event: unknown) => void;
}

const dndHarness: {
  handlers: CapturedHandlers;
  move: ReturnType<typeof vi.fn>;
} = vi.hoisted(() => ({
  handlers: {},
  move: vi.fn(),
}));

vi.mock('@dnd-kit/helpers', () => ({
  move: dndHarness.move,
}));

vi.mock('@dnd-kit/react', () => ({
  DragDropProvider: ({
    children,
    ...handlers
  }: CapturedHandlers & { children: ReactNode }) => {
    dndHarness.handlers = handlers;
    return children;
  },
  useDroppable: () => ({
    isDropTarget: false,
    ref: vi.fn(),
  }),
}));

vi.mock('@dnd-kit/react/sortable', () => ({
  useSortable: () => ({
    handleRef: vi.fn(),
    isDragging: false,
    isDropping: false,
    isDropTarget: false,
    ref: vi.fn(),
  }),
}));

import { TaskManagement } from './TaskManagement';

const TIMESTAMP = '2026-09-24T08:00:00.000Z';

function createTask(id: string, title: string): StoredTask {
  return {
    id,
    title,
    priority: 'medium',
    durationMinutes: 30,
    status: 'active',
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  };
}

function createState(): AppState {
  const state = createEmptyAppState();
  const task = createTask('presentation', 'Przygotować prezentację');

  state.tasks[task.id] = task;
  state.columns.backlog = [task.id];

  return state;
}

function createFakeStorage(state: AppState) {
  const values = new Map([[STORAGE_KEY, JSON.stringify(state)]]);

  return {
    values,
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
  } satisfies AppStateStorage & { values: Map<string, string> };
}

function ConnectedTaskManagement() {
  return <TaskManagement state={useAppState()} dispatch={useAppDispatch()} />;
}

function renderTaskManagement() {
  const storage = createFakeStorage(createState());

  render(
    <AppStateProvider storage={storage}>
      <ConnectedTaskManagement />
    </AppStateProvider>,
  );

  return storage;
}

function dragEvent(targetId: string | null, canceled = false) {
  return {
    canceled,
    operation: {
      source: { id: 'presentation' },
      target: targetId ? { id: targetId } : null,
    },
  };
}

function moveToMonday(): TaskColumns {
  const columns = createEmptyAppState().columns;

  columns.monday = ['presentation'];

  return columns;
}

function runDragStart() {
  act(() => {
    dndHarness.handlers.onDragStart?.(dragEvent('presentation'));
  });
}

function runDragOver(columns: TaskColumns) {
  dndHarness.move.mockReturnValueOnce(columns);

  act(() => {
    dndHarness.handlers.onDragOver?.(dragEvent('monday'));
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  dndHarness.handlers = {};
  dndHarness.move.mockReset();
});

describe('TaskManagement drag lifecycle', () => {
  it('updates only the draft on drag over, then commits and saves exactly once', async () => {
    const storage = renderTaskManagement();
    const movedColumns = moveToMonday();

    runDragStart();
    runDragOver(movedColumns);

    expect(
      within(screen.getByRole('region', { name: 'Poniedziałek' })).getByText(
        'Przygotować prezentację',
      ),
    ).toBeInTheDocument();
    expect(storage.setItem).not.toHaveBeenCalled();

    act(() => {
      dndHarness.handlers.onDragEnd?.(dragEvent('monday'));
    });

    await waitFor(() => {
      expect(storage.setItem).toHaveBeenCalledTimes(1);
    });

    const savedState = appStateSchema.parse(
      JSON.parse(storage.values.get(STORAGE_KEY) ?? 'null'),
    );

    expect(savedState.columns.backlog).toEqual([]);
    expect(savedState.columns.monday).toEqual(['presentation']);
    expect(savedState.tasks.presentation?.createdAt).toBe(TIMESTAMP);
    expect(savedState.tasks.presentation?.updatedAt).not.toBe(TIMESTAMP);
    expect(dndHarness.move).toHaveBeenCalledTimes(1);
  });

  it('restores the snapshot without saving after cancellation', async () => {
    const storage = renderTaskManagement();

    runDragStart();
    runDragOver(moveToMonday());

    act(() => {
      dndHarness.handlers.onDragEnd?.(dragEvent('monday', true));
    });

    expect(
      within(screen.getByRole('region', { name: 'Do zaplanowania' })).getByText(
        'Przygotować prezentację',
      ),
    ).toBeInTheDocument();
    expect(storage.setItem).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: 'Przenieś: Przygotować prezentację',
        }),
      ).toHaveFocus();
    });
  });

  it('does not commit or save after dropping outside a valid target', () => {
    const storage = renderTaskManagement();

    runDragStart();
    runDragOver(moveToMonday());

    act(() => {
      dndHarness.handlers.onDragEnd?.(dragEvent(null));
    });

    expect(
      within(screen.getByRole('region', { name: 'Do zaplanowania' })).getByText(
        'Przygotować prezentację',
      ),
    ).toBeInTheDocument();
    expect(storage.setItem).not.toHaveBeenCalled();
  });
});
