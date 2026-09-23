import { useRef, useState, type Dispatch } from 'react';

import styles from '../App.module.css';
import {
  formatDuration,
  type AppState,
  type Priority,
  type StoredTask,
} from '../domain/model';
import type { AppAction } from '../domain/reducer';
import { TaskEditDialog } from '../task-form/TaskEditDialog';
import { TaskForm, type TaskFormValues } from '../task-form/TaskForm';

interface TaskManagementProps {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const priorityLabels: Record<Priority, string> = {
  low: 'Niski',
  medium: 'Średni',
  high: 'Wysoki',
};

function createTask(values: TaskFormValues): StoredTask {
  const timestamp = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    ...values,
    status: 'active',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function TaskManagement({ state, dispatch }: TaskManagementProps) {
  const [editedTaskId, setEditedTaskId] = useState<string | null>(null);
  const editTriggerRef = useRef<HTMLButtonElement | null>(null);
  const backlogTasks = state.columns.backlog.flatMap((taskId) => {
    const task = state.tasks[taskId];
    return task ? [task] : [];
  });
  const editedTask = editedTaskId ? (state.tasks[editedTaskId] ?? null) : null;

  const addTask = (values: TaskFormValues) => {
    dispatch({ type: 'task/added', task: createTask(values) });
  };

  const editTask = (taskId: string, values: TaskFormValues) => {
    dispatch({
      type: 'task/edited',
      taskId,
      changes: values,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <main className={styles.shell}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Organizer tygodnia</p>
        <h1>Zacznij od zadań</h1>
        <p className={styles.lead}>
          Dodaj to, co chcesz zrobić. Planowanie zadań na konkretne dni pojawi
          się w kolejnym etapie.
        </p>
      </header>

      <section className={styles.panel} aria-labelledby="add-task-heading">
        <h2 id="add-task-heading">Dodaj zadanie</h2>
        <TaskForm
          submitLabel="Dodaj zadanie"
          resetAfterSubmit
          onSubmit={addTask}
        />
      </section>

      <section className={styles.panel} aria-labelledby="backlog-heading">
        <div className={styles.backlogHeading}>
          <h2 id="backlog-heading">Do zaplanowania</h2>
          <span
            className={styles.count}
            aria-label={`Liczba zadań: ${backlogTasks.length}`}
          >
            {backlogTasks.length}
          </span>
        </div>

        {backlogTasks.length === 0 ? (
          <p className={styles.emptyState}>
            Nie masz jeszcze zadań. Dodaj pierwsze powyżej.
          </p>
        ) : (
          <ul className={styles.taskList}>
            {backlogTasks.map((task) => (
              <li key={task.id} className={styles.taskPreview}>
                <span className={styles.taskData}>
                  <span className={styles.taskTitle}>{task.title}</span>
                  <span className={styles.taskMeta}>
                    Priorytet: {priorityLabels[task.priority]} · Czas:{' '}
                    {formatDuration(task.durationMinutes)}
                  </span>
                </span>
                <button
                  type="button"
                  className={styles.editButton}
                  aria-label={`Edytuj: ${task.title}`}
                  onClick={(event) => {
                    editTriggerRef.current = event.currentTarget;
                    setEditedTaskId(task.id);
                  }}
                >
                  Edytuj
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <TaskEditDialog
        task={editedTask}
        returnFocusRef={editTriggerRef}
        onSubmit={editTask}
        onClose={() => {
          setEditedTaskId(null);
        }}
      />
    </main>
  );
}
