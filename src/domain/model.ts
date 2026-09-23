export const priorities = ['low', 'medium', 'high'] as const;

export type Priority = (typeof priorities)[number];

export const taskStatuses = ['active', 'completed'] as const;

export type TaskStatus = (typeof taskStatuses)[number];

export const dayLocations = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type DayLocation = (typeof dayLocations)[number];

export const taskLocations = ['backlog', ...dayLocations] as const;

export type TaskLocation = (typeof taskLocations)[number];

export const dayNames: Record<DayLocation, string> = {
  monday: 'Poniedziałek',
  tuesday: 'Wtorek',
  wednesday: 'Środa',
  thursday: 'Czwartek',
  friday: 'Piątek',
  saturday: 'Sobota',
  sunday: 'Niedziela',
};

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  durationMinutes: number;
  status: TaskStatus;
  location: TaskLocation;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type StoredTask = Omit<Task, 'location' | 'order'>;

export type TaskColumns = Record<TaskLocation, string[]>;

export interface AppState {
  schemaVersion: 1;
  tasks: Record<string, StoredTask>;
  columns: TaskColumns;
}

export function createEmptyColumns(): TaskColumns {
  return {
    backlog: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };
}

export function createEmptyAppState(): AppState {
  return {
    schemaVersion: 1,
    tasks: {},
    columns: createEmptyColumns(),
  };
}

export function isValidTaskTitle(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidTaskDuration(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 15 &&
    value % 15 === 0
  );
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} godz.`;
  }

  return `${hours} godz. ${remainingMinutes} min`;
}
