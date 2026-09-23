import type { AppState, DayLocation } from './model';

export interface DaySummary {
  plannedMinutes: number;
  remainingMinutes: number;
}

export function selectDaySummary(
  state: AppState,
  day: DayLocation,
): DaySummary {
  return state.columns[day].reduce<DaySummary>(
    (summary, taskId) => {
      const task = state.tasks[taskId];

      if (!task) {
        return summary;
      }

      return {
        plannedMinutes: summary.plannedMinutes + task.durationMinutes,
        remainingMinutes:
          summary.remainingMinutes +
          (task.status === 'active' ? task.durationMinutes : 0),
      };
    },
    { plannedMinutes: 0, remainingMinutes: 0 },
  );
}
