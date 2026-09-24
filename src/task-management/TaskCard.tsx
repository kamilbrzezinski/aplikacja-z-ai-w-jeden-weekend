import { formatDuration, type StoredTask } from '../domain/model';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  compact?: boolean;
  dragHandleId?: string;
  dragHandleRef?: (element: HTMLButtonElement | null) => void;
  task: StoredTask;
  onEdit: (taskId: string, trigger: HTMLButtonElement) => void;
  onMove: (taskId: string, trigger: HTMLButtonElement) => void;
  onDelete: (task: StoredTask) => void;
  onStatusChange: (task: StoredTask) => void;
}

const priorityLabels: Record<StoredTask['priority'], string> = {
  low: 'Niski',
  medium: 'Średni',
  high: 'Wysoki',
};

export function TaskCard({
  compact = false,
  dragHandleId,
  dragHandleRef,
  task,
  onEdit,
  onMove,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const isCompleted = task.status === 'completed';
  const statusAction = isCompleted
    ? 'Oznacz jako niewykonane'
    : 'Oznacz jako wykonane';

  return (
    <article
      className={styles.card}
      data-layout={compact ? 'compact' : 'wide'}
      data-priority={task.priority}
      data-status={task.status}
      aria-label={`Zadanie: ${task.title}`}
    >
      <button
        ref={dragHandleRef}
        id={dragHandleId}
        type="button"
        className={styles.dragHandle}
        title="Uchwyt przeciągania"
        aria-label={`Przenieś: ${task.title}`}
        aria-describedby="dnd-instructions"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <div className={styles.content}>
        <div className={styles.headingRow}>
          <h3 className={styles.title}>{task.title}</h3>
          <span className={styles.status}>
            {isCompleted ? 'Wykonane' : 'Do zrobienia'}
          </span>
        </div>

        <div className={styles.meta}>
          <span className={styles.priority}>
            <span className={styles.priorityMark} aria-hidden="true" />
            {priorityLabels[task.priority]} priorytet
          </span>
          <span className={styles.duration}>
            <span aria-hidden="true">◷</span>
            {formatDuration(task.durationMinutes)}
          </span>
        </div>

        <div className={styles.footer}>
          <label className={styles.completionControl}>
            <input
              type="checkbox"
              checked={isCompleted}
              aria-label={`${statusAction}: ${task.title}`}
              onChange={() => {
                onStatusChange(task);
              }}
            />
            <span aria-hidden="true" className={styles.checkboxVisual} />
            <span>{statusAction}</span>
          </label>

          <div className={styles.actions}>
            <button
              id={`move-button-${task.id}`}
              type="button"
              className={styles.moveButton}
              aria-label={`Przenieś do…: ${task.title}`}
              onClick={(event) => {
                onMove(task.id, event.currentTarget);
              }}
            >
              <span aria-hidden="true">↪</span>
              <span>Przenieś do…</span>
            </button>
            <button
              type="button"
              className={styles.editButton}
              aria-label={`Edytuj: ${task.title}`}
              onClick={(event) => {
                onEdit(task.id, event.currentTarget);
              }}
            >
              <span aria-hidden="true">✎</span>
              <span>Edytuj</span>
            </button>
            <button
              type="button"
              className={styles.deleteButton}
              aria-label={`Usuń: ${task.title}`}
              onClick={() => {
                onDelete(task);
              }}
            >
              <span aria-hidden="true">×</span>
              <span>Usuń</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
