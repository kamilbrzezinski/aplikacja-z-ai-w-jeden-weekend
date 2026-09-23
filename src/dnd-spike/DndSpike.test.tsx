import { act, cleanup, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { SpikeColumns } from './model';

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

import { DndSpike } from './DndSpike';

function dragEvent(
  targetId: string | null,
  canceled = false,
  sourceId = 'task-presentation',
) {
  return {
    canceled,
    operation: {
      source: { id: sourceId },
      target: targetId ? { id: targetId } : null,
    },
  };
}

function movePresentationToMonday(): SpikeColumns {
  return {
    backlog: ['task-email', 'task-shopping'],
    monday: ['task-presentation'],
  };
}

function runDragStart() {
  act(() => {
    dndHarness.handlers.onDragStart?.(dragEvent('task-presentation'));
  });
}

function runDragOver(columns: SpikeColumns) {
  dndHarness.move.mockReturnValueOnce(columns);

  act(() => {
    dndHarness.handlers.onDragOver?.(dragEvent('monday'));
  });
}

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  dndHarness.handlers = {};
  dndHarness.move.mockReset();
});

describe('DndSpike drag lifecycle', () => {
  it('commits one semantic action after a valid drop', () => {
    const onCommit = vi.fn();
    const movedColumns = movePresentationToMonday();

    render(<DndSpike onCommit={onCommit} />);
    runDragStart();
    runDragOver(movedColumns);
    dndHarness.move.mockReturnValueOnce(movedColumns);

    act(() => {
      dndHarness.handlers.onDragEnd?.(dragEvent('monday'));
    });

    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith({
      type: 'item/moved',
      itemId: 'task-presentation',
      destination: { columnId: 'monday', index: 0 },
    });
    expect(
      within(screen.getByTestId('column-monday')).getByText(
        'Przygotować prezentację',
      ),
    ).toBeInTheDocument();
  });

  it('restores the snapshot and does not commit after cancellation', () => {
    const onCommit = vi.fn();

    render(<DndSpike onCommit={onCommit} />);
    runDragStart();
    runDragOver(movePresentationToMonday());

    expect(
      within(screen.getByTestId('column-monday')).getByText(
        'Przygotować prezentację',
      ),
    ).toBeInTheDocument();

    act(() => {
      dndHarness.handlers.onDragEnd?.(dragEvent('monday', true));
    });

    expect(onCommit).not.toHaveBeenCalled();
    expect(
      within(screen.getByTestId('column-backlog')).getByText(
        'Przygotować prezentację',
      ),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('column-monday')).getByText(
        'Upuść zadanie tutaj',
      ),
    ).toBeInTheDocument();
  });

  it('restores the snapshot and does not commit after dropping outside', () => {
    const onCommit = vi.fn();

    render(<DndSpike onCommit={onCommit} />);
    runDragStart();
    runDragOver(movePresentationToMonday());

    act(() => {
      dndHarness.handlers.onDragEnd?.(dragEvent(null));
    });

    expect(onCommit).not.toHaveBeenCalled();
    expect(
      within(screen.getByTestId('column-backlog')).getByText(
        'Przygotować prezentację',
      ),
    ).toBeInTheDocument();
  });

  it('does not commit a drop that leaves the item unchanged', () => {
    const onCommit = vi.fn();
    const initialColumns: SpikeColumns = {
      backlog: ['task-presentation', 'task-email', 'task-shopping'],
      monday: [],
    };

    render(<DndSpike onCommit={onCommit} />);
    runDragStart();
    dndHarness.move.mockReturnValueOnce(initialColumns);

    act(() => {
      dndHarness.handlers.onDragEnd?.(dragEvent('task-presentation'));
    });

    expect(onCommit).not.toHaveBeenCalled();
  });
});
