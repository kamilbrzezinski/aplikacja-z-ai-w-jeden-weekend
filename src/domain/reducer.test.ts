import { describe, expect, it } from 'vitest';

import {
  createEmptyAppState,
  taskLocations,
  type AppState,
  type StoredTask,
  type TaskLocation,
} from './model';
import { appReducer, type MoveTaskAction } from './reducer';

const CREATED_AT = '2026-09-23T08:00:00.000Z';
const UPDATED_AT = '2026-09-23T09:00:00.000Z';
const NEXT_UPDATED_AT = '2026-09-23T10:00:00.000Z';

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
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    ...overrides,
  };
}

function createState(
  columns: Partial<Record<TaskLocation, string[]>>,
  tasks: StoredTask[],
): AppState {
  const state = createEmptyAppState();

  for (const [columnId, taskIds] of Object.entries(columns)) {
    state.columns[columnId as TaskLocation] = taskIds;
  }

  state.tasks = Object.fromEntries(tasks.map((task) => [task.id, task]));

  return state;
}

function moveTask(
  state: AppState,
  itemId: string,
  columnId: TaskLocation,
  index: number,
  updatedAt = UPDATED_AT,
) {
  const action: MoveTaskAction = {
    type: 'item/moved',
    itemId,
    destination: { columnId, index },
    updatedAt,
  };

  return appReducer(state, action);
}

function allColumnTaskIds(state: AppState) {
  return taskLocations.flatMap((columnId) => state.columns[columnId]);
}

describe('appReducer task lifecycle', () => {
  it('adds a task record at the end of the backlog', () => {
    const firstTask = createTask('first');
    const addedTask = createTask('added');
    const state = createState({ backlog: [firstTask.id] }, [firstTask]);

    const result = appReducer(state, {
      type: 'task/added',
      task: addedTask,
    });

    expect(result.tasks.added).toEqual(addedTask);
    expect(result.columns.backlog).toEqual(['first', 'added']);
    expect(result.columns.monday).toEqual([]);
  });

  it('does not add a duplicate task identifier', () => {
    const task = createTask('duplicate');
    const state = createState({ backlog: [task.id] }, [task]);

    const result = appReducer(state, {
      type: 'task/added',
      task: createTask('duplicate', { title: 'Inne zadanie' }),
    });

    expect(result).toBe(state);
  });

  it.each([
    createTask('blank-title', { title: '   ' }),
    createTask('invalid-duration', { durationMinutes: 16 }),
  ])('does not add a task with invalid data: $id', (task) => {
    const state = createEmptyAppState();

    const result = appReducer(state, { type: 'task/added', task });

    expect(result).toBe(state);
  });

  it('edits task data while preserving its identity, status and position', () => {
    const task = createTask('edited');
    const state = createState({ wednesday: [task.id] }, [task]);

    const result = appReducer(state, {
      type: 'task/edited',
      taskId: task.id,
      changes: {
        title: 'Zmienione zadanie',
        priority: 'high',
        durationMinutes: 120,
      },
      updatedAt: UPDATED_AT,
    });

    expect(result.tasks[task.id]).toEqual({
      ...task,
      title: 'Zmienione zadanie',
      priority: 'high',
      durationMinutes: 120,
      updatedAt: UPDATED_AT,
    });
    expect(result.tasks[task.id]?.createdAt).toBe(CREATED_AT);
    expect(result.tasks[task.id]?.status).toBe('active');
    expect(result.columns).toBe(state.columns);
  });

  it('returns the same state when edited data is unchanged', () => {
    const task = createTask('unchanged');
    const state = createState({ backlog: [task.id] }, [task]);

    const result = appReducer(state, {
      type: 'task/edited',
      taskId: task.id,
      changes: {
        title: task.title,
        priority: task.priority,
        durationMinutes: task.durationMinutes,
      },
      updatedAt: UPDATED_AT,
    });

    expect(result).toBe(state);
    expect(result.tasks[task.id]?.updatedAt).toBe(CREATED_AT);
  });

  it.each([
    { title: '   ', durationMinutes: 30 },
    { title: 'Poprawny tytuł', durationMinutes: 16 },
  ])('rejects invalid edited task data: %o', (changes) => {
    const task = createTask('edited');
    const state = createState({ backlog: [task.id] }, [task]);

    const result = appReducer(state, {
      type: 'task/edited',
      taskId: task.id,
      changes: { ...changes, priority: 'low' },
      updatedAt: UPDATED_AT,
    });

    expect(result).toBe(state);
  });

  it('changes status without moving the task', () => {
    const task = createTask('completed');
    const state = createState({ friday: [task.id] }, [task]);

    const result = appReducer(state, {
      type: 'task/statusChanged',
      taskId: task.id,
      status: 'completed',
      updatedAt: UPDATED_AT,
    });

    expect(result.tasks[task.id]).toEqual({
      ...task,
      status: 'completed',
      updatedAt: UPDATED_AT,
    });
    expect(result.tasks[task.id]?.createdAt).toBe(CREATED_AT);
    expect(result.columns).toBe(state.columns);
  });

  it('returns the same state when setting the existing status', () => {
    const task = createTask('active');
    const state = createState({ backlog: [task.id] }, [task]);

    const result = appReducer(state, {
      type: 'task/statusChanged',
      taskId: task.id,
      status: 'active',
      updatedAt: UPDATED_AT,
    });

    expect(result).toBe(state);
  });

  it('deletes the task record and every occurrence in columns', () => {
    const deletedTask = createTask('deleted');
    const keptTask = createTask('kept');
    const state = createState(
      { backlog: [deletedTask.id], monday: [keptTask.id, deletedTask.id] },
      [deletedTask, keptTask],
    );

    const result = appReducer(state, {
      type: 'task/deleted',
      taskId: deletedTask.id,
    });

    expect(result.tasks).toEqual({ kept: keptTask });
    expect(result.columns.backlog).toEqual([]);
    expect(result.columns.monday).toEqual(['kept']);
  });

  it('ignores mutations of missing tasks', () => {
    const state = createEmptyAppState();

    expect(
      appReducer(state, {
        type: 'task/edited',
        taskId: 'missing',
        changes: {
          title: 'Brak',
          priority: 'medium',
          durationMinutes: 30,
        },
        updatedAt: UPDATED_AT,
      }),
    ).toBe(state);
    expect(
      appReducer(state, {
        type: 'task/statusChanged',
        taskId: 'missing',
        status: 'completed',
        updatedAt: UPDATED_AT,
      }),
    ).toBe(state);
    expect(appReducer(state, { type: 'task/deleted', taskId: 'missing' })).toBe(
      state,
    );
  });
});

describe('appReducer moving and reordering', () => {
  it.each([
    { label: 'beginning', index: 0, expected: ['moved', 'first', 'second'] },
    { label: 'middle', index: 1, expected: ['first', 'moved', 'second'] },
    { label: 'end', index: 2, expected: ['first', 'second', 'moved'] },
  ])('moves a task to the $label of another column', ({ index, expected }) => {
    const movedTask = createTask('moved');
    const firstTask = createTask('first');
    const secondTask = createTask('second');
    const state = createState(
      {
        backlog: [movedTask.id],
        tuesday: [firstTask.id, secondTask.id],
      },
      [movedTask, firstTask, secondTask],
    );

    const result = moveTask(state, movedTask.id, 'tuesday', index);

    expect(result.columns.backlog).toEqual([]);
    expect(result.columns.tuesday).toEqual(expected);
    expect(result.tasks[movedTask.id]).toEqual({
      ...movedTask,
      updatedAt: UPDATED_AT,
    });
    expect(result.tasks[movedTask.id]?.createdAt).toBe(CREATED_AT);
  });

  it('moves a task to an empty column', () => {
    const task = createTask('moved');
    const state = createState({ backlog: [task.id] }, [task]);

    const result = moveTask(state, task.id, 'sunday', 0);

    expect(result.columns.backlog).toEqual([]);
    expect(result.columns.sunday).toEqual([task.id]);
  });

  it('clamps a destination index to the available range', () => {
    const firstTask = createTask('first');
    const movedTask = createTask('moved');
    const state = createState(
      { backlog: [movedTask.id], thursday: [firstTask.id] },
      [firstTask, movedTask],
    );

    expect(
      moveTask(state, movedTask.id, 'thursday', -10).columns.thursday,
    ).toEqual(['moved', 'first']);
    expect(
      moveTask(state, movedTask.id, 'thursday', 99).columns.thursday,
    ).toEqual(['first', 'moved']);
  });

  it('reorders a task in the same column in both directions', () => {
    const tasks = ['first', 'second', 'third'].map((id) => createTask(id));
    const state = createState(
      { saturday: tasks.map((task) => task.id) },
      tasks,
    );

    const movedDown = moveTask(state, 'first', 'saturday', 2);
    const movedBackUp = moveTask(
      movedDown,
      'first',
      'saturday',
      0,
      NEXT_UPDATED_AT,
    );

    expect(movedDown.columns.saturday).toEqual(['second', 'third', 'first']);
    expect(movedDown.tasks.first?.updatedAt).toBe(UPDATED_AT);
    expect(movedBackUp.columns.saturday).toEqual(['first', 'second', 'third']);
    expect(movedBackUp.tasks.first?.updatedAt).toBe(NEXT_UPDATED_AT);
    expect(movedBackUp.tasks.first?.createdAt).toBe(CREATED_AT);
  });

  it('returns the same state for an unchanged or invalid move', () => {
    const task = createTask('task');
    const state = createState({ backlog: [task.id] }, [task]);

    expect(moveTask(state, task.id, 'backlog', 0)).toBe(state);
    expect(moveTask(state, 'missing', 'monday', 0)).toBe(state);
    expect(moveTask(state, task.id, 'monday', 0.5)).toBe(state);
  });

  it('keeps every task in exactly one column without losing identifiers', () => {
    const tasks = ['first', 'second', 'third', 'fourth'].map((id) =>
      createTask(id),
    );
    const state = createState(
      {
        backlog: ['first', 'second'],
        monday: ['third'],
        friday: ['fourth'],
      },
      tasks,
    );

    const afterFirstMove = moveTask(state, 'second', 'monday', 1);
    const result = moveTask(
      afterFirstMove,
      'third',
      'friday',
      0,
      NEXT_UPDATED_AT,
    );
    const identifiers = allColumnTaskIds(result);

    expect(identifiers).toHaveLength(tasks.length);
    expect(new Set(identifiers).size).toBe(tasks.length);
    expect(identifiers.toSorted()).toEqual(
      Object.keys(result.tasks).toSorted(),
    );
  });
});
