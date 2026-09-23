import { useEffect, useReducer, useRef, type ReactNode } from 'react';

import { appReducer } from '../domain/reducer';
import {
  getBrowserStorage,
  loadAppState,
  saveAppState,
  type AppStateStorage,
} from '../storage/appStateStorage';
import { AppDispatchContext, AppStateContext } from './AppStateContext';

interface AppStateProviderProps {
  children: ReactNode;
  storage?: AppStateStorage | null;
}

const browserStorage = getBrowserStorage();

export function AppStateProvider({
  children,
  storage = browserStorage,
}: AppStateProviderProps) {
  const [state, dispatch] = useReducer(appReducer, storage, loadAppState);
  // The reducer keeps the same reference for no-op actions, so comparing with
  // the loaded state skips writes on mount (also in Strict Mode) and keeps an
  // unreadable raw entry intact until the user really changes something.
  const loadedStateRef = useRef(state);

  useEffect(() => {
    if (state === loadedStateRef.current) {
      return;
    }

    saveAppState(storage, state);
  }, [state, storage]);

  return (
    <AppStateContext value={state}>
      <AppDispatchContext value={dispatch}>{children}</AppDispatchContext>
    </AppStateContext>
  );
}
