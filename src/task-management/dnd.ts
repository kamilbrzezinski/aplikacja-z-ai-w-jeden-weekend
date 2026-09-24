import {
  taskLocations,
  type TaskColumns,
  type TaskLocation,
} from '../domain/model';
import type { MoveTaskAction } from '../domain/reducer';

export const TASK_DRAG_TYPE = 'task';
export const COLUMN_COLLISION_PRIORITY = 1;

interface TaskPosition {
  columnId: TaskLocation;
  index: number;
}

export function cloneTaskColumns(columns: TaskColumns): TaskColumns {
  return Object.fromEntries(
    taskLocations.map((columnId) => [columnId, [...columns[columnId]]]),
  ) as TaskColumns;
}

export function findTaskPosition(
  columns: TaskColumns,
  taskId: string,
): TaskPosition | null {
  for (const columnId of taskLocations) {
    const index = columns[columnId].indexOf(taskId);

    if (index !== -1) {
      return { columnId, index };
    }
  }

  return null;
}

export function createMoveTaskAction(
  snapshot: TaskColumns,
  finalColumns: TaskColumns,
  taskId: string,
  updatedAt: string,
): MoveTaskAction | null {
  const source = findTaskPosition(snapshot, taskId);
  const destination = findTaskPosition(finalColumns, taskId);

  if (
    !source ||
    !destination ||
    (source.columnId === destination.columnId &&
      source.index === destination.index)
  ) {
    return null;
  }

  return {
    type: 'item/moved',
    itemId: taskId,
    destination,
    updatedAt,
  };
}
