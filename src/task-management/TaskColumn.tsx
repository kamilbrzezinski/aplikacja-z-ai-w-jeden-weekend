import {
  formatDuration,
  type StoredTask,
  type TaskLocation,
} from '../domain/model';
import type { DaySummary } from '../domain/selectors';
import { TaskCard } from './TaskCard';
import styles from './TaskColumn.module.css';

interface TaskColumnProps {
  emptyMessage: string;
  location: TaskLocation;
  onDelete: (task: StoredTask) => void;
  onEdit: (taskId: string, trigger: HTMLButtonElement) => void;
  onStatusChange: (task: StoredTask) => void;
  summary?: DaySummary;
  tasks: StoredTask[];
  title: string;
}

export function TaskColumn({
  emptyMessage,
  location,
  onDelete,
  onEdit,
  onStatusChange,
  summary,
  tasks,
  title,
}: TaskColumnProps) {
  const isBacklog = location === 'backlog';
  const headingId = `${location}-heading`;
  const taskCountLabel = isBacklog
    ? `Liczba zadań: ${tasks.length}`
    : `Liczba zadań — ${title}: ${tasks.length}`;

  return (
    <section
      className={styles.column}
      data-location={location}
      data-variant={isBacklog ? 'backlog' : 'day'}
      aria-labelledby={headingId}
    >
      <header className={styles.heading}>
        {isBacklog ? (
          <h2 id={headingId}>{title}</h2>
        ) : (
          <h3 id={headingId}>{title}</h3>
        )}
        <span className={styles.count} aria-label={taskCountLabel}>
          {tasks.length}
        </span>
      </header>

      <div className={styles.taskArea}>
        {tasks.length === 0 ? (
          <p className={styles.emptyState}>{emptyMessage}</p>
        ) : (
          <ul className={styles.taskList}>
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskCard
                  compact
                  task={task}
                  onEdit={onEdit}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {!isBacklog && summary ? (
        <footer
          className={styles.summary}
          aria-label={`Podsumowanie — ${title}`}
        >
          <span>Zaplanowano: {formatDuration(summary.plannedMinutes)}</span>
          <span aria-hidden="true">·</span>
          <span>Pozostało: {formatDuration(summary.remainingMinutes)}</span>
        </footer>
      ) : null}
    </section>
  );
}
