import { useId, useRef, useState, type FormEvent } from 'react';

import {
  isValidTaskDuration,
  isValidTaskTitle,
  type Priority,
} from '../domain/model';
import styles from './TaskForm.module.css';

export interface TaskFormValues {
  title: string;
  priority: Priority;
  durationMinutes: number;
}

interface TaskFormDraft {
  title: string;
  priority: Priority;
  durationMinutes: string;
}

interface TaskFormErrors {
  title?: string;
  durationMinutes?: string;
}

interface TaskFormProps {
  initialValues?: TaskFormValues;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => void;
  onCancel?: () => void;
  resetAfterSubmit?: boolean;
  titleAutoFocus?: boolean;
}

const defaultTaskFormValues: TaskFormValues = {
  title: '',
  priority: 'medium',
  durationMinutes: 30,
};

const priorityLabels: Record<Priority, string> = {
  low: 'Niski',
  medium: 'Średni',
  high: 'Wysoki',
};

function createDraft(values: TaskFormValues): TaskFormDraft {
  return {
    title: values.title,
    priority: values.priority,
    durationMinutes: String(values.durationMinutes),
  };
}

function validateDraft(draft: TaskFormDraft): {
  errors: TaskFormErrors;
  values: TaskFormValues | null;
} {
  const errors: TaskFormErrors = {};
  const duration =
    draft.durationMinutes.trim() === ''
      ? Number.NaN
      : Number(draft.durationMinutes);

  if (!isValidTaskTitle(draft.title)) {
    errors.title = 'Wpisz nazwę zadania.';
  }

  if (!isValidTaskDuration(duration)) {
    errors.durationMinutes =
      draft.durationMinutes.trim() === ''
        ? 'Wpisz czas zadania w minutach.'
        : 'Czas musi wynosić co najmniej 15 minut i być wielokrotnością 15.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: null };
  }

  return {
    errors,
    values: {
      title: draft.title.trim(),
      priority: draft.priority,
      durationMinutes: duration,
    },
  };
}

export function TaskForm({
  initialValues = defaultTaskFormValues,
  submitLabel,
  onSubmit,
  onCancel,
  resetAfterSubmit = false,
  titleAutoFocus = false,
}: TaskFormProps) {
  const [draft, setDraft] = useState(() => createDraft(initialValues));
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const titleId = useId();
  const priorityId = useId();
  const durationId = useId();
  const titleRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = validateDraft(draft);
    setErrors(result.errors);

    if (!result.values) {
      if (result.errors.title) {
        titleRef.current?.focus();
      } else {
        durationRef.current?.focus();
      }
      return;
    }

    onSubmit(result.values);

    if (resetAfterSubmit) {
      setDraft(createDraft(defaultTaskFormValues));
      setErrors({});
      titleRef.current?.focus();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor={titleId}>Nazwa</label>
        <input
          ref={titleRef}
          id={titleId}
          name="title"
          type="text"
          required
          value={draft.title}
          autoFocus={titleAutoFocus}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? `${titleId}-error` : undefined}
          onChange={(event) => {
            setDraft((current) => ({
              ...current,
              title: event.target.value,
            }));
            setErrors((current) => {
              const next = { ...current };
              delete next.title;
              return next;
            });
          }}
        />
        {errors.title ? (
          <p id={`${titleId}-error`} className={styles.error} role="alert">
            {errors.title}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor={priorityId}>Priorytet</label>
        <select
          id={priorityId}
          name="priority"
          value={draft.priority}
          onChange={(event) => {
            setDraft((current) => ({
              ...current,
              priority: event.target.value as Priority,
            }));
          }}
        >
          {(Object.keys(priorityLabels) as Priority[]).map((priority) => (
            <option key={priority} value={priority}>
              {priorityLabels[priority]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor={durationId}>Czas (minuty)</label>
        <input
          ref={durationRef}
          id={durationId}
          name="durationMinutes"
          type="number"
          min="15"
          step="15"
          required
          value={draft.durationMinutes}
          aria-invalid={Boolean(errors.durationMinutes)}
          aria-describedby={
            errors.durationMinutes ? `${durationId}-error` : undefined
          }
          onChange={(event) => {
            setDraft((current) => ({
              ...current,
              durationMinutes: event.target.value,
            }));
            setErrors((current) => {
              const next = { ...current };
              delete next.durationMinutes;
              return next;
            });
          }}
        />
        {errors.durationMinutes ? (
          <p id={`${durationId}-error`} className={styles.error} role="alert">
            {errors.durationMinutes}
          </p>
        ) : null}
      </div>

      <div className={styles.actions}>
        <button className={styles.primaryAction} type="submit">
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            className={styles.secondaryAction}
            type="button"
            onClick={onCancel}
          >
            Anuluj
          </button>
        ) : null}
      </div>
    </form>
  );
}
