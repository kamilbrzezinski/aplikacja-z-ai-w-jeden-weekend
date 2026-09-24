import { useRef, useState, type Dispatch } from 'react';

import styles from '../App.module.css';
import {
  dayLocations,
  dayNames,
  type AppState,
  type StoredTask,
} from '../domain/model';
import type { AppAction } from '../domain/reducer';
import { selectDaySummary, selectTasksByLocation } from '../domain/selectors';
import { TaskEditDialog } from '../task-form/TaskEditDialog';
import { TaskForm, type TaskFormValues } from '../task-form/TaskForm';
import { TaskColumn } from './TaskColumn';

interface TaskManagementProps {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

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
  const backlogTasks = selectTasksByLocation(state, 'backlog');
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
          Dodaj to, co chcesz zrobić, a potem rozłóż zadania na wybrane dni
          tygodnia.
        </p>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.sidebar} aria-label="Zadania do zaplanowania">
          <section
            className={styles.addPanel}
            aria-labelledby="add-task-heading"
          >
            <h2 id="add-task-heading">Dodaj zadanie</h2>
            <TaskForm
              layout="stacked"
              submitLabel="Dodaj zadanie"
              resetAfterSubmit
              onSubmit={addTask}
            />
          </section>

          <TaskColumn
            location="backlog"
            title="Do zaplanowania"
            tasks={backlogTasks}
            emptyMessage="Nie masz jeszcze zadań. Dodaj pierwsze powyżej."
            onEdit={(taskId, trigger) => {
              editTriggerRef.current = trigger;
              setEditedTaskId(taskId);
            }}
            onStatusChange={changeTaskStatus}
            onDelete={deleteTask}
          />
        </aside>

        <section className={styles.week} aria-labelledby="week-heading">
          <div className={styles.weekHeading}>
            <div>
              <p className={styles.sectionEyebrow}>Plan tygodnia</p>
              <h2 id="week-heading">Twój tydzień</h2>
            </div>
            <p>Siedem dni · przewiń poziomo, aby zobaczyć cały plan</p>
          </div>

          <div
            className={styles.weekScroller}
            tabIndex={0}
            aria-label="Kolumny dni tygodnia"
          >
            <div className={styles.weekColumns}>
              {dayLocations.map((day) => (
                <TaskColumn
                  key={day}
                  location={day}
                  title={dayNames[day]}
                  tasks={selectTasksByLocation(state, day)}
                  summary={selectDaySummary(state, day)}
                  emptyMessage="Brak zadań. To miejsce jest gotowe na Twój plan."
                  onEdit={(taskId, trigger) => {
                    editTriggerRef.current = trigger;
                    setEditedTaskId(taskId);
                  }}
                  onStatusChange={changeTaskStatus}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

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
