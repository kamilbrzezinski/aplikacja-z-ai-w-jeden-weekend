import { DndSpike } from './dnd-spike/DndSpike';
import { AppStateProvider } from './state/AppStateProvider';

export function App() {
  return (
    <AppStateProvider>
      <DndSpike />
    </AppStateProvider>
  );
}
