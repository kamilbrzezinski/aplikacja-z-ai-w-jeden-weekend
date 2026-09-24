import { describe, expect, it } from 'vitest';

import { createEmptyColumns } from '../domain/model';
import { cloneTaskColumns, createMoveTaskAction } from './dnd';

const UPDATED_AT = '2026-09-24T09:00:00.000Z';

describe('task drag mapping', () => {
  it('maps the final draft position to one semantic reducer action', () => {
    const snapshot = createEmptyColumns();
    snapshot.backlog = ['first', 'moved', 'last'];
    const finalColumns = cloneTaskColumns(snapshot);
    finalColumns.backlog = ['first', 'last'];
    finalColumns.friday = ['moved'];

    expect(
      createMoveTaskAction(snapshot, finalColumns, 'moved', UPDATED_AT),
    ).toEqual({
      type: 'item/moved',
      itemId: 'moved',
      destination: { columnId: 'friday', index: 0 },
      updatedAt: UPDATED_AT,
    });
  });

  it('does not create an action for an unchanged or missing task', () => {
    const snapshot = createEmptyColumns();
    snapshot.backlog = ['task'];

    expect(
      createMoveTaskAction(
        snapshot,
        cloneTaskColumns(snapshot),
        'task',
        UPDATED_AT,
      ),
    ).toBeNull();
    expect(
      createMoveTaskAction(
        snapshot,
        cloneTaskColumns(snapshot),
        'missing',
        UPDATED_AT,
      ),
    ).toBeNull();
  });
});
