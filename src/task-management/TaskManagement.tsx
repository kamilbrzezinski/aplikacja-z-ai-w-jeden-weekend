import { move } from '@dnd-kit/helpers';
import {
  DragDropProvider,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/react';
import { useEffect, useRef, useState, type Dispatch } from 'react';

import styles from '../App.module.css';
import {
  dayLocations,
  dayNames,
  type AppState,
  type StoredTask,
  type TaskColumns,
  type TaskLocation,
} from '../domain/model';
import type { AppAction } from '../domain/reducer';
import { selectDaySummary } from '../domain/selectors';
import { TaskEditDialog } from '../task-form/TaskEditDialog';
import { TaskForm, type TaskFormValues } from '../task-form/TaskForm';
import { TaskColumn } from './TaskColumn';
import { cloneTaskColumns, createMoveTaskAction } from './dnd';

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
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editedTaskId, setEditedTaskId] = useState<string | null>(null);
  const addTaskTriggerRef = useRef<HTMLButtonElement | null>(null);
  const editTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [draftColumns, setDraftColumns] = useState<TaskColumns>(() =>
    cloneTaskColumns(state.columns),
  );
  const snapshotRef = useRef(cloneTaskColumns(state.columns));
  const draftRef = useRef(draftColumns);
  const isDraggingRef = useRef(false);
  const editedTask = editedTaskId ? (state.tasks[editedTaskId] ?? null) : null;

  const updateDraft = (columns: TaskColumns) => {
    draftRef.current = columns;
    setDraftColumns(columns);
  };

  useEffect(() => {
    if (!isDraggingRef.current) {
      updateDraft(cloneTaskColumns(state.columns));
    }
  }, [state.columns]);

  const tasksIn = (location: TaskLocation) =>
    draftColumns[location].flatMap((taskId) => {
      const task = state.tasks[taskId];

      return task ? [task] : [];
    });

  const restoreDragHandleFocus = (taskId: string) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(`drag-handle-${taskId}`)?.focus();
      });
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const sourceId = event.operation.source?.id;

    if (typeof sourceId !== 'string' || !state.tasks[sourceId]) {
      return;
    }

    isDraggingRef.current = true;
    snapshotRef.current = cloneTaskColumns(state.columns);
    updateDraft(cloneTaskColumns(state.columns));
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!isDraggingRef.current) {
      return;
    }

    const nextDraft = move(draftRef.current, event);

    if (nextDraft !== draftRef.current) {
      updateDraft(nextDraft);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const sourceId = event.operation.source?.id;
    const targetId = event.operation.target?.id;
    const snapshot = snapshotRef.current;

    isDraggingRef.current = false;

    if (typeof sourceId !== 'string') {
      updateDraft(cloneTaskColumns(snapshot));
      return;
    }

    if (event.canceled || targetId == null) {
      updateDraft(cloneTaskColumns(snapshot));
      restoreDragHandleFocus(sourceId);
      return;
    }

    let finalDraft = draftRef.current;
    const updatedAt = new Date().toISOString();
    let action = createMoveTaskAction(
      snapshot,
      finalDraft,
      sourceId,
      updatedAt,
    );

    if (!action) {
      finalDraft = move(draftRef.current, event);
      action = createMoveTaskAction(snapshot, finalDraft, sourceId, updatedAt);
    }

    if (!action) {
      updateDraft(cloneTaskColumns(snapshot));
      restoreDragHandleFocus(sourceId);
      return;
    }

    dispatch(action);
    updateDraft(finalDraft);
    restoreDragHandleFocus(sourceId);
  };

  const addTask = (values: TaskFormValues) => {
    dispatch({ type: 'task/added', task: createTask(values) });
  };

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const closeAddForm = () => {
    setIsAddFormOpen(false);
    addTaskTriggerRef.current?.focus();
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
      <header className={styles.appHeader}>
        <div>
          <p className={styles.eyebrow}>Organizer tygodnia</p>
          <h1>Mój tydzień</h1>
          <p className={styles.lead}>
            Zbierz zadania i rozłóż je na spokojny, wykonalny plan.
          </p>
        </div>
        <button
          ref={addTaskTriggerRef}
          type="button"
          className={styles.addTaskButton}
          aria-expanded={isAddFormOpen}
          aria-controls="add-task-panel"
          onClick={() => {
            setIsAddFormOpen((isOpen) => !isOpen);
          }}
        >
          <span aria-hidden="true">{isAddFormOpen ? '−' : '+'}</span>
          {isAddFormOpen ? 'Zwiń formularz' : 'Dodaj zadanie'}
        </button>
      </header>

      {isAddFormOpen ? (
        <section
          id="add-task-panel"
          className={styles.addPanel}
          aria-labelledby="add-task-heading"
        >
          <div className={styles.addPanelHeading}>
            <h2 id="add-task-heading">Dodaj zadanie</h2>
            <p>
              Uzupełnij szczegóły. Po dodaniu możesz od razu wpisać kolejne.
            </p>
          </div>
          <TaskForm
            submitLabel="Dodaj zadanie"
            resetAfterSubmit
            titleAutoFocus
            onCancel={closeAddForm}
            onSubmit={addTask}
          />
        </section>
      ) : null}

      <p id="dnd-instructions" className={styles.visuallyHidden}>
        Aby przenieść zadanie klawiaturą, ustaw fokus na uchwycie, rozpocznij
        spacją lub Enterem, poruszaj strzałkami i zatwierdź spacją albo Enterem.
        Naciśnij Esc, aby anulować.
      </p>

      <DragDropProvider
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <TaskColumn
          location="backlog"
          title="Do zaplanowania"
          tasks={tasksIn('backlog')}
          emptyMessage="Tu pojawią się zadania, które czekają na zaplanowanie."
          emptyActionLabel="Dodaj pierwsze zadanie"
          onEmptyAction={openAddForm}
          onEdit={(taskId, trigger) => {
            editTriggerRef.current = trigger;
            setEditedTaskId(taskId);
          }}
          onStatusChange={changeTaskStatus}
          onDelete={deleteTask}
        />

        <section className={styles.week} aria-labelledby="week-heading">
          <div className={styles.weekHeading}>
            <div>
              <p className={styles.sectionEyebrow}>Plan tygodnia</p>
              <h2 id="week-heading">Od poniedziałku do niedzieli</h2>
            </div>
            <p>Na mniejszych ekranach przewiń planszę poziomo.</p>
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
                  tasks={tasksIn(day)}
                  summary={selectDaySummary(state, day)}
                  emptyMessage="Upuść zadanie tutaj"
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
      </DragDropProvider>

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
