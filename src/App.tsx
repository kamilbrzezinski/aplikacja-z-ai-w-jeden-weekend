import { useReducer } from 'react';

import { createEmptyAppState } from './domain/model';
import { appReducer } from './domain/reducer';
import { TaskManagement } from './task-management/TaskManagement';

export function App() {
  const [state, dispatch] = useReducer(
    appReducer,
    undefined,
    createEmptyAppState,
  );
  return <TaskManagement state={state} dispatch={dispatch} />;
}
