import {
  isValidTaskDuration,
  isValidTaskTitle,
  taskLocations,
  type AppState,
  type Priority,
  type StoredTask,
  type TaskLocation,
  type TaskStatus,
} from './model';

export interface AddTaskAction {
  type: 'task/added';
  task: StoredTask;
}

export interface EditTaskAction {
  type: 'task/edited';
  taskId: string;
  changes: {
    title: string;
    priority: Priority;
    durationMinutes: number;
  };
  updatedAt: string;
}

export interface DeleteTaskAction {
  type: 'task/deleted';
  taskId: string;
}

export interface ChangeTaskStatusAction {
  type: 'task/statusChanged';
  taskId: string;
  status: TaskStatus;
  updatedAt: string;
}

export interface MoveTaskAction {
  type: 'item/moved';
  itemId: string;
  destination: {
    columnId: TaskLocation;
    index: number;
  };
  updatedAt: string;
}

export type AppAction =
  | AddTaskAction
  | EditTaskAction
  | DeleteTaskAction
  | ChangeTaskStatusAction
  | MoveTaskAction;

interface TaskPosition {
  columnId: TaskLocation;
  index: number;
}

function findTaskPosition(
  state: AppState,
  taskId: string,
): TaskPosition | null {
  for (const columnId of taskLocations) {
    const index = state.columns[columnId].indexOf(taskId);

    if (index !== -1) {
      return { columnId, index };
    }
  }

  return null;
}

function addTask(state: AppState, task: StoredTask): AppState {
  if (
    state.tasks[task.id] ||
    findTaskPosition(state, task.id) ||
    !isValidTaskTitle(task.title) ||
    !isValidTaskDuration(task.durationMinutes)
  ) {
    return state;
  }

  return {
    ...state,
    tasks: {
      ...state.tasks,
      [task.id]: task,
    },
    columns: {
      ...state.columns,
      backlog: [...state.columns.backlog, task.id],
    },
  };
}

function editTask(
  state: AppState,
  { changes, taskId, updatedAt }: EditTaskAction,
): AppState {
  const task = state.tasks[taskId];

  if (
    !task ||
    !isValidTaskTitle(changes.title) ||
    !isValidTaskDuration(changes.durationMinutes)
  ) {
    return state;
  }

  if (
    task.title === changes.title &&
    task.priority === changes.priority &&
    task.durationMinutes === changes.durationMinutes
  ) {
    return state;
  }

  return {
    ...state,
    tasks: {
      ...state.tasks,
      [taskId]: {
        ...task,
        ...changes,
        updatedAt,
      },
    },
  };
}

function deleteTask(state: AppState, taskId: string): AppState {
  if (!state.tasks[taskId] && !findTaskPosition(state, taskId)) {
    return state;
  }

  const remainingTasks = { ...state.tasks };
  const columns = { ...state.columns };

  delete remainingTasks[taskId];

  for (const columnId of taskLocations) {
    columns[columnId] = state.columns[columnId].filter((id) => id !== taskId);
  }

  return {
    ...state,
    tasks: remainingTasks,
    columns,
  };
}

function changeTaskStatus(
  state: AppState,
  { status, taskId, updatedAt }: ChangeTaskStatusAction,
): AppState {
  const task = state.tasks[taskId];

  if (!task || task.status === status) {
    return state;
  }

  return {
    ...state,
    tasks: {
      ...state.tasks,
      [taskId]: {
        ...task,
        status,
        updatedAt,
      },
    },
  };
}

function moveTask(
  state: AppState,
  { destination, itemId, updatedAt }: MoveTaskAction,
): AppState {
  const task = state.tasks[itemId];
  const source = findTaskPosition(state, itemId);

  if (!task || !source || !Number.isInteger(destination.index)) {
    return state;
  }

  const columns = { ...state.columns };

  for (const columnId of taskLocations) {
    columns[columnId] = state.columns[columnId].filter((id) => id !== itemId);
  }

  const destinationItems = columns[destination.columnId];
  const destinationIndex = Math.max(
    0,
    Math.min(destination.index, destinationItems.length),
  );
  const nextDestinationItems = [...destinationItems];

  nextDestinationItems.splice(destinationIndex, 0, itemId);
  columns[destination.columnId] = nextDestinationItems;

  if (
    source.columnId === destination.columnId &&
    source.index === destinationIndex
  ) {
    return state;
  }

  return {
    ...state,
    tasks: {
      ...state.tasks,
      [itemId]: {
        ...task,
        updatedAt,
      },
    },
    columns,
  };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'task/added':
      return addTask(state, action.task);
    case 'task/edited':
      return editTask(state, action);
    case 'task/deleted':
      return deleteTask(state, action.taskId);
    case 'task/statusChanged':
      return changeTaskStatus(state, action);
    case 'item/moved':
      return moveTask(state, action);
  }
}
