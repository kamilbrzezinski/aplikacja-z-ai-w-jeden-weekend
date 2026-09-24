import { useRef, useState, type Dispatch } from 'react';

import styles from '../App.module.css';
import { type AppState, type StoredTask } from '../domain/model';
import type { AppAction } from '../domain/reducer';
import { TaskEditDialog } from '../task-form/TaskEditDialog';
import { TaskForm, type TaskFormValues } from '../task-form/TaskForm';
import { TaskCard, type TaskCardVariant } from './TaskCard';
import managementStyles from './TaskManagement.module.css';

interface TaskManagementProps {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const cardVariantOptions: Array<{
  value: TaskCardVariant;
  name: string;
  description: string;
}> = [
  {
    value: 'calm',
    name: 'A · Spokojny',
    description: 'Przestronny, neutralny i skupiony na treści.',
  },
  {
    value: 'compact',
    name: 'B · Kompaktowy',
    description: 'Gęsty układ do szybkiego przeglądania listy.',
  },
  {
    value: 'bold',
    name: 'C · Wyrazisty',
    description: 'Mocniej eksponuje priorytet i charakter zadania.',
  },
];

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
  const [cardVariant, setCardVariant] = useState<TaskCardVariant>('calm');
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

  const changeTaskStatus = (task: StoredTask) => {
    dispatch({
      type: 'task/statusChanged',
      taskId: task.id,
      status: task.status === 'active' ? 'completed' : 'active',
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteTask = (task: StoredTask) => {
    const shouldDelete = window.confirm(
      `Usunąć zadanie „${task.title}”? Tej operacji nie można cofnąć.`,
    );

    if (shouldDelete) {
      dispatch({ type: 'task/deleted', taskId: task.id });
    }
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

        <fieldset className={managementStyles.variantPicker}>
          <legend>Wariant wyglądu kart</legend>
          <p className={managementStyles.variantHint}>
            Wybór roboczy — nie zmienia danych
          </p>
          <div className={managementStyles.variantOptions}>
            {cardVariantOptions.map((option) => (
              <label
                key={option.value}
                className={managementStyles.variantOption}
              >
                <input
                  type="radio"
                  name="card-variant"
                  value={option.value}
                  checked={cardVariant === option.value}
                  onChange={() => {
                    setCardVariant(option.value);
                  }}
                />
                <span className={managementStyles.variantName}>
                  {option.name}
                </span>
                <span className={managementStyles.variantDescription}>
                  {option.description}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {backlogTasks.length === 0 ? (
          <p className={styles.emptyState}>
            Nie masz jeszcze zadań. Dodaj pierwsze powyżej.
          </p>
        ) : (
          <ul className={styles.taskList}>
            {backlogTasks.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  variant={cardVariant}
                  onEdit={(taskId, trigger) => {
                    editTriggerRef.current = trigger;
                    setEditedTaskId(taskId);
                  }}
                  onStatusChange={changeTaskStatus}
                  onDelete={deleteTask}
                />
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
