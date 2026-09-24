import { formatDuration, type StoredTask } from '../domain/model';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: StoredTask;
  onEdit: (taskId: string, trigger: HTMLButtonElement) => void;
  onDelete: (task: StoredTask) => void;
  onStatusChange: (task: StoredTask) => void;
}

const priorityLabels: Record<StoredTask['priority'], string> = {
  low: 'Niski',
  medium: 'Średni',
  high: 'Wysoki',
};

export function TaskCard({
  task,
  onEdit,
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
      data-priority={task.priority}
      data-status={task.status}
      aria-label={`Zadanie: ${task.title}`}
    >
      <span
        className={styles.dragHandle}
        title="Uchwyt przeciągania"
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>

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
