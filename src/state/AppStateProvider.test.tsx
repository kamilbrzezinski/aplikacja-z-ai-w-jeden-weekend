import { act, cleanup, render, screen } from '@testing-library/react';
import { StrictMode, useEffect, type Dispatch } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createEmptyAppState,
  taskLocations,
  type StoredTask,
} from '../domain/model';
import type { AppAction } from '../domain/reducer';
import {
  STORAGE_KEY,
  appStateSchema,
  type AppStateStorage,
} from '../storage/appStateStorage';
import { useAppDispatch, useAppState } from './AppStateContext';
import { AppStateProvider } from './AppStateProvider';

const TIMESTAMP = '2026-09-23T08:00:00.000Z';
const UPDATED_AT = '2026-09-23T09:00:00.000Z';

function createTask(id: string): StoredTask {
  return {
    id,
    title: `Zadanie ${id}`,
    priority: 'medium',
    durationMinutes: 30,
    status: 'active',
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  };
}

function createFakeStorage(initialValue?: string) {
  const values = new Map<string, string>();

  if (initialValue !== undefined) {
    values.set(STORAGE_KEY, initialValue);
  }

  return {
    values,
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
  } satisfies AppStateStorage & { values: Map<string, string> };
}

const probe: { dispatch: Dispatch<AppAction> | null } = { dispatch: null };

function StateProbe() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    probe.dispatch = dispatch;
  }, [dispatch]);

  return (
    <ul>
      {taskLocations.map((columnId) => (
        <li key={columnId}>
          {columnId}:{' '}
          {state.columns[columnId]
            .map((id) => `${id}/${state.tasks[id]?.status ?? '?'}`)
            .join(',')}
        </li>
      ))}
    </ul>
  );
}

function renderProvider(storage: AppStateStorage | null) {
  return render(
    <StrictMode>
      <AppStateProvider storage={storage}>
        <StateProbe />
      </AppStateProvider>
    </StrictMode>,
  );
}

function dispatch(action: AppAction) {
  act(() => {
    probe.dispatch?.(action);
  });
}

function readSavedState(storage: ReturnType<typeof createFakeStorage>) {
  return appStateSchema.parse(
    JSON.parse(storage.values.get(STORAGE_KEY) ?? 'null'),
  );
}

afterEach(() => {
  cleanup();
  probe.dispatch = null;
  vi.restoreAllMocks();
});

function addTask(id: string) {
  dispatch({ type: 'task/added', task: createTask(id) });
}

describe('AppStateProvider', () => {
  it('starts with an empty state and does not write on mount', () => {
    const storage = createFakeStorage();

    renderProvider(storage);

    expect(screen.getByText('backlog:')).toBeInTheDocument();
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('does not rewrite a valid entry on mount', () => {
    const state = createEmptyAppState();
    state.tasks.first = createTask('first');
    state.columns.monday = ['first'];
    const storage = createFakeStorage(JSON.stringify(state));

    renderProvider(storage);

    expect(screen.getByText('monday: first/active')).toBeInTheDocument();
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('saves a schema-valid state after the first user change', () => {
    const storage = createFakeStorage();
    renderProvider(storage);

    addTask('first');

    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(readSavedState(storage).columns.backlog).toEqual(['first']);
  });

  it('does not write when an action leaves the state unchanged', () => {
    const storage = createFakeStorage();
    renderProvider(storage);

    dispatch({
      type: 'task/statusChanged',
      taskId: 'missing',
      status: 'completed',
      updatedAt: UPDATED_AT,
    });

    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('keeps a corrupted raw entry until the first change replaces it', () => {
    const corrupted = '{"schemaVersion":1,"tasks":';
    const storage = createFakeStorage(corrupted);
    renderProvider(storage);

    expect(screen.getByText('backlog:')).toBeInTheDocument();
    expect(storage.values.get(STORAGE_KEY)).toBe(corrupted);

    addTask('first');

    expect(readSavedState(storage).columns.backlog).toEqual(['first']);
  });

  it('keeps the current state on screen when saving fails', () => {
    const storage = createFakeStorage();
    storage.setItem.mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });
    renderProvider(storage);

    addTask('first');
    addTask('second');

    expect(storage.setItem).toHaveBeenCalledTimes(2);
    expect(
      screen.getByText('backlog: first/active,second/active'),
    ).toBeInTheDocument();
  });

  it('works without storage when localStorage is unavailable', () => {
    renderProvider(null);

    addTask('first');

    expect(screen.getByText('backlog: first/active')).toBeInTheDocument();
  });

  it('starts empty when reading throws', () => {
    const storage = createFakeStorage();
    storage.getItem.mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError');
    });

    renderProvider(storage);

    expect(screen.getByText('backlog:')).toBeInTheDocument();
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('restores order and status after the provider is recreated', () => {
    const storage = createFakeStorage();
    const { unmount } = renderProvider(storage);

    addTask('first');
    addTask('second');
    addTask('third');
    dispatch({
      type: 'item/moved',
      itemId: 'first',
      destination: { columnId: 'wednesday', index: 0 },
      updatedAt: UPDATED_AT,
    });
    dispatch({
      type: 'item/moved',
      itemId: 'third',
      destination: { columnId: 'backlog', index: 0 },
      updatedAt: UPDATED_AT,
    });
    dispatch({
      type: 'task/statusChanged',
      taskId: 'first',
      status: 'completed',
      updatedAt: UPDATED_AT,
    });
    unmount();

    renderProvider(storage);

    expect(
      screen.getByText('backlog: third/active,second/active'),
    ).toBeInTheDocument();
    expect(screen.getByText('wednesday: first/completed')).toBeInTheDocument();
  });
});

describe('state hooks', () => {
  it('throw a clear error outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<StateProbe />)).toThrow(
      'useAppState wymaga komponentu AppStateProvider.',
    );
  });
});
