import { createContext, useContext, type Dispatch } from 'react';

import type { AppState } from '../domain/model';
import type { AppAction } from '../domain/reducer';

export const AppStateContext = createContext<AppState | null>(null);

export const AppDispatchContext = createContext<Dispatch<AppAction> | null>(
  null,
);

export function useAppState(): AppState {
  const state = useContext(AppStateContext);

  if (!state) {
    throw new Error('useAppState wymaga komponentu AppStateProvider.');
  }

  return state;
}

export function useAppDispatch(): Dispatch<AppAction> {
  const dispatch = useContext(AppDispatchContext);

  if (!dispatch) {
    throw new Error('useAppDispatch wymaga komponentu AppStateProvider.');
  }

  return dispatch;
}
