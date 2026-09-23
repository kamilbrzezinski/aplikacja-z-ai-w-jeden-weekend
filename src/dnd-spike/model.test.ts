import { describe, expect, it } from 'vitest';

import {
  createInitialSpikeColumns,
  moveSpikeItem,
  spikeColumnIds,
  spikeReducer,
} from './model';

describe('spikeReducer', () => {
  it('reorders an item within the same column', () => {
    const initial = createInitialSpikeColumns();

    const result = spikeReducer(initial, {
      type: 'item/moved',
      itemId: 'task-presentation',
      destination: { columnId: 'backlog', index: 2 },
    });

    expect(result.backlog).toEqual([
      'task-email',
      'task-shopping',
      'task-presentation',
    ]);
    expect(result.monday).toEqual([]);
  });

  it('moves an item to an empty column', () => {
    const initial = createInitialSpikeColumns();

    const result = spikeReducer(initial, {
      type: 'item/moved',
      itemId: 'task-email',
      destination: { columnId: 'monday', index: 0 },
    });

    expect(result.backlog).toEqual(['task-presentation', 'task-shopping']);
    expect(result.monday).toEqual(['task-email']);
  });

  it('moves an item between populated columns at the requested index', () => {
    const initial = {
      backlog: ['task-presentation', 'task-email'],
      monday: ['task-shopping'],
    };

    const result = moveSpikeItem(initial, 'task-email', {
      columnId: 'monday',
      index: 0,
    });

    expect(result).toEqual({
      backlog: ['task-presentation'],
      monday: ['task-email', 'task-shopping'],
    });
  });

  it('keeps every item in exactly one column after a move', () => {
    const result = moveSpikeItem(
      {
        backlog: ['task-presentation', 'task-email'],
        monday: ['task-email', 'task-shopping'],
      },
      'task-email',
      { columnId: 'monday', index: 1 },
    );
    const allItems = spikeColumnIds.flatMap((columnId) => result[columnId]);

    expect(allItems.filter((id) => id === 'task-email')).toHaveLength(1);
    expect(allItems).toHaveLength(3);
  });

  it('returns the same state for a missing item or an unchanged position', () => {
    const initial = createInitialSpikeColumns();

    expect(
      moveSpikeItem(initial, 'missing-task', {
        columnId: 'monday',
        index: 0,
      }),
    ).toBe(initial);
    expect(
      moveSpikeItem(initial, 'task-email', {
        columnId: 'backlog',
        index: 1,
      }),
    ).toBe(initial);
  });
});
