import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createEmptyAppState,
  type AppState,
  type StoredTask,
} from '../domain/model';
import {
  STORAGE_KEY,
  getBrowserStorage,
  loadAppState,
  saveAppState,
  type AppStateStorage,
} from './appStateStorage';

const TIMESTAMP = '2026-09-23T08:00:00.000Z';

function createTask(
  id: string,
  overrides: Partial<StoredTask> = {},
): StoredTask {
  return {
    id,
    title: `Zadanie ${id}`,
    priority: 'medium',
    durationMinutes: 30,
    status: 'active',
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
    ...overrides,
  };
}

function createValidState(): AppState {
  const state = createEmptyAppState();

  state.tasks = {
    first: createTask('first'),
    second: createTask('second', { status: 'completed', priority: 'high' }),
    third: createTask('third', { durationMinutes: 120 }),
  };
  state.columns.backlog = ['third', 'first'];
  state.columns.wednesday = ['second'];

  return state;
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

function loadRaw(rawValue: unknown) {
  return loadAppState(createFakeStorage(JSON.stringify(rawValue)));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('loadAppState', () => {
  it('returns an empty state when there is no entry', () => {
    expect(loadAppState(createFakeStorage())).toEqual(createEmptyAppState());
  });

  it('returns an empty state when storage is unavailable', () => {
    expect(loadAppState(null)).toEqual(createEmptyAppState());
  });

  it('restores tasks, statuses and column order from a valid entry', () => {
    const state = createValidState();

    expect(loadRaw(state)).toEqual(state);
  });

  it('reads the entry stored under the versioned key', () => {
    const storage = createFakeStorage();

    loadAppState(storage);

    expect(storage.getItem).toHaveBeenCalledWith('organizer-tygodnia:v1');
  });

  it('returns an empty state for malformed JSON', () => {
    expect(loadAppState(createFakeStorage('{"schemaVersion":'))).toEqual(
      createEmptyAppState(),
    );
  });

  it.each([
    ['null', null],
    ['an array', []],
    ['an object without columns', { schemaVersion: 1, tasks: {} }],
    [
      'a missing day column',
      {
        ...createValidState(),
        columns: Object.fromEntries(
          Object.entries(createValidState().columns).filter(
            ([columnId]) => columnId !== 'sunday',
          ),
        ),
      },
    ],
    [
      'an invalid priority',
      {
        ...createValidState(),
        tasks: {
          ...createValidState().tasks,
          first: { ...createTask('first'), priority: 'urgent' },
        },
      },
    ],
    [
      'a duration not divisible by 15',
      {
        ...createValidState(),
        tasks: {
          ...createValidState().tasks,
          first: createTask('first', { durationMinutes: 20 }),
        },
      },
    ],
    [
      'a blank title',
      {
        ...createValidState(),
        tasks: {
          ...createValidState().tasks,
          first: createTask('first', { title: '   ' }),
        },
      },
    ],
    [
      'an invalid timestamp',
      {
        ...createValidState(),
        tasks: {
          ...createValidState().tasks,
          first: createTask('first', { updatedAt: 'wczoraj' }),
        },
      },
    ],
  ])('returns an empty state for valid JSON with %s', (_, rawValue) => {
    expect(loadRaw(rawValue)).toEqual(createEmptyAppState());
  });

  it('returns an empty state for a foreign schema version', () => {
    expect(loadRaw({ ...createValidState(), schemaVersion: 2 })).toEqual(
      createEmptyAppState(),
    );
  });

  it('rejects a task missing from every column', () => {
    const state = createValidState();
    state.columns.backlog = ['first'];

    expect(loadRaw(state)).toEqual(createEmptyAppState());
  });

  it('rejects an orphaned identifier in a column', () => {
    const state = createValidState();
    state.columns.friday = ['ghost'];

    expect(loadRaw(state)).toEqual(createEmptyAppState());
  });

  it('rejects an identifier placed in two columns', () => {
    const state = createValidState();
    state.columns.monday = ['first'];

    expect(loadRaw(state)).toEqual(createEmptyAppState());
  });

  it('rejects an identifier placed twice in one column', () => {
    const state = createValidState();
    state.columns.backlog = ['third', 'first', 'first'];

    expect(loadRaw(state)).toEqual(createEmptyAppState());
  });

  it('rejects a task stored under a key different from its id', () => {
    const state = createValidState();
    state.tasks.first = createTask('other');

    expect(loadRaw(state)).toEqual(createEmptyAppState());
  });

  it('returns an empty state when getItem throws', () => {
    const storage = createFakeStorage();
    storage.getItem.mockImplementation(() => {
      throw new Error('SecurityError');
    });

    expect(loadAppState(storage)).toEqual(createEmptyAppState());
  });
});

describe('saveAppState', () => {
  it('writes a state that can be loaded back', () => {
    const storage = createFakeStorage();
    const state = createValidState();

    expect(saveAppState(storage, state)).toBe(true);
    expect(storage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      expect.any(String),
    );
    expect(loadAppState(storage)).toEqual(state);
  });

  it('reports failure instead of throwing when setItem throws', () => {
    const storage = createFakeStorage();
    storage.setItem.mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });

    expect(saveAppState(storage, createValidState())).toBe(false);
  });

  it('reports failure when storage is unavailable', () => {
    expect(saveAppState(null, createValidState())).toBe(false);
  });
});

describe('getBrowserStorage', () => {
  it('returns localStorage when it is accessible', () => {
    expect(getBrowserStorage()).toBe(window.localStorage);
  });

  it('returns null when accessing localStorage throws', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError');
    });

    expect(getBrowserStorage()).toBeNull();
  });
});
