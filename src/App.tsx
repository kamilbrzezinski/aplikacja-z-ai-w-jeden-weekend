import { useAppDispatch, useAppState } from './state/AppStateContext';
import { AppStateProvider } from './state/AppStateProvider';
import { TaskManagement } from './task-management/TaskManagement';

function ConnectedTaskManagement() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return <TaskManagement state={state} dispatch={dispatch} />;
}

export function App() {
  return (
    <AppStateProvider>
      <ConnectedTaskManagement />
    </AppStateProvider>
  );
}
