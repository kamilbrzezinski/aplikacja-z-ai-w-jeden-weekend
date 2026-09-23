import { z } from 'zod';

import {
  createEmptyAppState,
  isValidTaskDuration,
  isValidTaskTitle,
  priorities,
  taskLocations,
  taskStatuses,
  type AppState,
  type TaskColumns,
} from '../domain/model';

export const STORAGE_KEY = 'organizer-tygodnia:v1';

export type AppStateStorage = Pick<Storage, 'getItem' | 'setItem'>;

const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().refine(isValidTaskTitle),
  priority: z.enum(priorities),
  durationMinutes: z.number().refine(isValidTaskDuration),
  status: z.enum(taskStatuses),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

const columnIdsSchema = z.array(z.string());

const columnsSchema = z.object({
  backlog: columnIdsSchema,
  monday: columnIdsSchema,
  tuesday: columnIdsSchema,
  wednesday: columnIdsSchema,
  thursday: columnIdsSchema,
  friday: columnIdsSchema,
  saturday: columnIdsSchema,
  sunday: columnIdsSchema,
}) satisfies z.ZodType<TaskColumns>;

export const appStateSchema = z
  .object({
    schemaVersion: z.literal(1),
    tasks: z.record(z.string(), taskSchema),
    columns: columnsSchema,
  })
  .superRefine(({ columns, tasks }, context) => {
    const placedIds = taskLocations.flatMap((columnId) => columns[columnId]);
    const uniquePlacedIds = new Set(placedIds);

    if (uniquePlacedIds.size !== placedIds.length) {
      context.addIssue({
        code: 'custom',
        message: 'Identyfikator zadania występuje w kolumnach więcej niż raz.',
        path: ['columns'],
      });
    }

    for (const id of uniquePlacedIds) {
      if (!Object.hasOwn(tasks, id)) {
        context.addIssue({
          code: 'custom',
          message: `Kolumny zawierają nieistniejące zadanie: ${id}.`,
          path: ['columns'],
        });
      }
    }

    for (const [key, task] of Object.entries(tasks)) {
      if (task.id !== key) {
        context.addIssue({
          code: 'custom',
          message: `Klucz zadania nie zgadza się z jego identyfikatorem: ${key}.`,
          path: ['tasks', key],
        });
      }

      if (!uniquePlacedIds.has(key)) {
        context.addIssue({
          code: 'custom',
          message: `Zadanie nie znajduje się w żadnej kolumnie: ${key}.`,
          path: ['tasks', key],
        });
      }
    }
  }) satisfies z.ZodType<AppState>;

export function getBrowserStorage(): AppStateStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadAppState(storage: AppStateStorage | null): AppState {
  if (!storage) {
    return createEmptyAppState();
  }

  try {
    const rawState = storage.getItem(STORAGE_KEY);

    if (rawState === null) {
      return createEmptyAppState();
    }

    const result = appStateSchema.safeParse(JSON.parse(rawState));

    return result.success ? result.data : createEmptyAppState();
  } catch {
    return createEmptyAppState();
  }
}

export function saveAppState(
  storage: AppStateStorage | null,
  state: AppState,
): boolean {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
