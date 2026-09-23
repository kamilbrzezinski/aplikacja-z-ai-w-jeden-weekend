import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  createEmptyAppState,
  dayLocations,
  dayNames,
  formatDuration,
  isValidTaskDuration,
  isValidTaskTitle,
  priorities,
  taskLocations,
  taskStatuses,
  type AppState,
  type Priority,
  type StoredTask,
  type Task,
  type TaskLocation,
  type TaskStatus,
} from './model';

describe('domain model', () => {
  it('limits priority, status and location to their domain values', () => {
    expect(priorities).toEqual(['low', 'medium', 'high']);
    expect(taskStatuses).toEqual(['active', 'completed']);
    expect(taskLocations).toEqual([
      'backlog',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ]);

    expectTypeOf<Priority>().toEqualTypeOf<'low' | 'medium' | 'high'>();
    expectTypeOf<TaskStatus>().toEqualTypeOf<'active' | 'completed'>();
    expectTypeOf<TaskLocation>().toEqualTypeOf<
      | 'backlog'
      | 'monday'
      | 'tuesday'
      | 'wednesday'
      | 'thursday'
      | 'friday'
      | 'saturday'
      | 'sunday'
    >();
  });

  it('defines all seven days and their Polish names', () => {
    expect(dayLocations).toHaveLength(7);
    expect(dayNames).toEqual({
      monday: 'Poniedziałek',
      tuesday: 'Wtorek',
      wednesday: 'Środa',
      thursday: 'Czwartek',
      friday: 'Piątek',
      saturday: 'Sobota',
      sunday: 'Niedziela',
    });
  });

  it('represents stored tasks without duplicated location and order', () => {
    expectTypeOf<StoredTask>().toEqualTypeOf<
      Omit<Task, 'location' | 'order'>
    >();
  });

  it('creates a fresh empty state with every location', () => {
    const first = createEmptyAppState();
    const second = createEmptyAppState();

    expect(first).toEqual({
      schemaVersion: 1,
      tasks: {},
      columns: {
        backlog: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    } satisfies AppState);
    expect(first).not.toBe(second);
    expect(first.tasks).not.toBe(second.tasks);
    expect(first.columns).not.toBe(second.columns);

    for (const location of taskLocations) {
      expect(first.columns[location]).not.toBe(second.columns[location]);
    }
  });
});

describe('isValidTaskTitle', () => {
  it.each(['Zadanie', '  Zadanie  ', 'Wysłać e-mail'])(
    'accepts a non-empty title: %j',
    (value) => {
      expect(isValidTaskTitle(value)).toBe(true);
    },
  );

  it.each(['', '   ', '\n\t', null, undefined])(
    'rejects an empty or non-string title: %j',
    (value) => {
      expect(isValidTaskTitle(value)).toBe(false);
    },
  );
});

describe('isValidTaskDuration', () => {
  it.each([15, 30, 90, 120])('accepts %s minutes', (value) => {
    expect(isValidTaskDuration(value)).toBe(true);
  });

  it.each([
    { value: '', case: 'an empty value' },
    { value: -15, case: 'a negative value' },
    { value: 1.5, case: 'a fractional value' },
    { value: 0, case: 'zero' },
    { value: 14, case: 'less than the minimum' },
    { value: 16, case: 'a value not divisible by 15' },
  ])('rejects $value ($case)', ({ value }) => {
    expect(isValidTaskDuration(value)).toBe(false);
  });
});

describe('formatDuration', () => {
  it.each([
    [0, '0 min'],
    [30, '30 min'],
    [90, '1 godz. 30 min'],
    [120, '2 godz.'],
  ])('formats %s minutes as %s', (value, expected) => {
    expect(formatDuration(value)).toBe(expected);
  });
});
