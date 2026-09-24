import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from 'react';

import {
  dayNames,
  taskLocations,
  type StoredTask,
  type TaskColumns,
  type TaskLocation,
} from '../domain/model';
import styles from './TaskMoveDialog.module.css';

interface MoveDestination {
  columnId: TaskLocation;
  index: number;
}

interface TaskMoveDialogProps {
  columns: TaskColumns;
  task: StoredTask | null;
  returnFocusRef: RefObject<HTMLElement | null>;
  onSubmit: (taskId: string, destination: MoveDestination) => void;
  onClose: () => void;
}

interface MoveTaskFormProps {
  columns: TaskColumns;
  task: StoredTask;
  onCancel: () => void;
  onSubmit: (destination: MoveDestination) => void;
}

const locationLabels: Record<TaskLocation, string> = {
  backlog: 'Do zaplanowania',
  ...dayNames,
};

function findTaskPosition(columns: TaskColumns, taskId: string) {
  for (const columnId of taskLocations) {
    const index = columns[columnId].indexOf(taskId);

    if (index !== -1) {
      return { columnId, index };
    }
  }

  return { columnId: 'backlog' as const, index: 0 };
}

function positionLabel(position: number, count: number) {
  if (position === 1) {
    return count === 1 ? '1 — jedyna pozycja' : '1 — początek';
  }

  if (position === count) {
    return `${position} — koniec`;
  }

  return String(position);
}

function MoveTaskForm({
  columns,
  task,
  onCancel,
  onSubmit,
}: MoveTaskFormProps) {
  const currentPosition = findTaskPosition(columns, task.id);
  const [columnId, setColumnId] = useState<TaskLocation>(
    currentPosition.columnId,
  );
  const [position, setPosition] = useState(currentPosition.index + 1);
  const columnIdInputId = useId();
  const positionInputId = useId();
  const availablePositionCount =
    columns[columnId].filter((taskId) => taskId !== task.id).length + 1;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ columnId, index: position - 1 });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.taskName}>
        Zadanie: <strong>{task.title}</strong>
      </p>
      <p className={styles.currentLocation}>
        Teraz: {locationLabels[currentPosition.columnId]}, pozycja{' '}
        {currentPosition.index + 1}.
      </p>

      <div className={styles.field}>
        <label htmlFor={columnIdInputId}>Miejsce docelowe</label>
        <select
          id={columnIdInputId}
          value={columnId}
          onChange={(event) => {
            const nextColumnId = event.target.value as TaskLocation;
            const nextPosition =
              columns[nextColumnId].filter((taskId) => taskId !== task.id)
                .length + 1;

            setColumnId(nextColumnId);
            setPosition(nextPosition);
          }}
        >
          {taskLocations.map((location) => (
            <option key={location} value={location}>
              {locationLabels[location]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor={positionInputId}>Pozycja w kolumnie</label>
        <select
          id={positionInputId}
          value={Math.min(position, availablePositionCount)}
          onChange={(event) => {
            setPosition(Number(event.target.value));
          }}
        >
          {Array.from({ length: availablePositionCount }, (_, index) => {
            const optionPosition = index + 1;

            return (
              <option key={optionPosition} value={optionPosition}>
                {positionLabel(optionPosition, availablePositionCount)}
              </option>
            );
          })}
        </select>
      </div>

      <div className={styles.actions}>
        <button className={styles.primaryAction} type="submit">
          Przenieś zadanie
        </button>
        <button
          className={styles.secondaryAction}
          type="button"
          onClick={onCancel}
        >
          Anuluj
        </button>
      </div>
    </form>
  );
}

export function TaskMoveDialog({
  columns,
  task,
  returnFocusRef,
  onSubmit,
  onClose,
}: TaskMoveDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const taskId = task?.id ?? null;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (taskId && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [taskId]);

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={headingId}
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClose={() => {
        if (returnFocusRef.current?.isConnected) {
          returnFocusRef.current.focus();
        }
        onClose();
      }}
    >
      {task ? (
        <div className={styles.content}>
          <div className={styles.heading}>
            <p className={styles.eyebrow}>Dostępne przenoszenie</p>
            <h2 id={headingId}>Przenieś do…</h2>
          </div>
          <MoveTaskForm
            key={task.id}
            columns={columns}
            task={task}
            onCancel={closeDialog}
            onSubmit={(destination) => {
              onSubmit(task.id, destination);
              closeDialog();
            }}
          />
        </div>
      ) : null}
    </dialog>
  );
}
