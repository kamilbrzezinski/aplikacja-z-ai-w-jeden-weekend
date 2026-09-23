import { describe, expect, it } from 'vitest';

import { createEmptyAppState, type StoredTask } from './model';
import { selectDaySummary } from './selectors';

function createTask(
  id: string,
  durationMinutes: number,
  status: StoredTask['status'],
): StoredTask {
  return {
    id,
    title: `Zadanie ${id}`,
    priority: 'medium',
    durationMinutes,
    status,
    createdAt: '2026-09-23T08:00:00.000Z',
    updatedAt: '2026-09-23T08:00:00.000Z',
  };
}

describe('selectDaySummary', () => {
  it('includes all tasks in planned time and only active tasks in remaining time', () => {
    const activeTask = createTask('active', 90, 'active');
    const completedTask = createTask('completed', 30, 'completed');
    const backlogTask = createTask('backlog', 240, 'active');
    const state = createEmptyAppState();

    state.tasks = {
      active: activeTask,
      completed: completedTask,
      backlog: backlogTask,
    };
    state.columns.wednesday = [activeTask.id, completedTask.id];
    state.columns.backlog = [backlogTask.id];

    expect(selectDaySummary(state, 'wednesday')).toEqual({
      plannedMinutes: 120,
      remainingMinutes: 90,
    });
  });

  it('returns zero values for an empty day', () => {
    expect(selectDaySummary(createEmptyAppState(), 'sunday')).toEqual({
      plannedMinutes: 0,
      remainingMinutes: 0,
    });
  });

  it('ignores a stale column identifier without a task record', () => {
    const state = createEmptyAppState();
    state.columns.monday = ['missing'];

    expect(selectDaySummary(state, 'monday')).toEqual({
      plannedMinutes: 0,
      remainingMinutes: 0,
    });
  });
});
