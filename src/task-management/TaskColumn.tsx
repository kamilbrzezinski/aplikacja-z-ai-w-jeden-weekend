import { useDroppable } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';

import {
  formatDuration,
  type StoredTask,
  type TaskLocation,
} from '../domain/model';
import type { DaySummary } from '../domain/selectors';
import { TaskCard } from './TaskCard';
import { COLUMN_COLLISION_PRIORITY, TASK_DRAG_TYPE } from './dnd';
import styles from './TaskColumn.module.css';

interface TaskColumnProps {
  emptyActionLabel?: string;
  emptyMessage: string;
  location: TaskLocation;
  onDelete: (task: StoredTask) => void;
  onEmptyAction?: () => void;
  onEdit: (taskId: string, trigger: HTMLButtonElement) => void;
  onMove: (taskId: string, trigger: HTMLButtonElement) => void;
  onStatusChange: (task: StoredTask) => void;
  summary?: DaySummary;
  tasks: StoredTask[];
  title: string;
}

interface SortableTaskCardProps {
  index: number;
  location: TaskLocation;
  onDelete: (task: StoredTask) => void;
  onEdit: (taskId: string, trigger: HTMLButtonElement) => void;
  onMove: (taskId: string, trigger: HTMLButtonElement) => void;
  onStatusChange: (task: StoredTask) => void;
  task: StoredTask;
}

function SortableTaskCard({
  index,
  location,
  onDelete,
  onEdit,
  onMove,
  onStatusChange,
  task,
}: SortableTaskCardProps) {
  const { handleRef, isDragging, isDropping, isDropTarget, ref } = useSortable({
    id: task.id,
    index,
    group: location,
    type: TASK_DRAG_TYPE,
    accept: TASK_DRAG_TYPE,
  });

  return (
    <li
      ref={ref}
      data-task-id={task.id}
      data-dragging={isDragging || undefined}
      data-dropping={isDropping || undefined}
      data-drop-target={isDropTarget || undefined}
    >
      <TaskCard
        compact
        dragHandleRef={(element) => {
          handleRef(element);
        }}
        task={task}
        onEdit={onEdit}
        onMove={onMove}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
    </li>
  );
}

export function TaskColumn({
  emptyActionLabel,
  emptyMessage,
  location,
  onDelete,
  onEmptyAction,
  onEdit,
  onMove,
  onStatusChange,
  summary,
  tasks,
  title,
}: TaskColumnProps) {
  const { isDropTarget, ref } = useDroppable({
    id: location,
    accept: TASK_DRAG_TYPE,
    collisionPriority: COLUMN_COLLISION_PRIORITY,
  });
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

      <div
        ref={ref}
        className={styles.taskArea}
        data-drop-target={isDropTarget || undefined}
        data-testid={`dropzone-${location}`}
      >
        {tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{emptyMessage}</p>
            {emptyActionLabel && onEmptyAction ? (
              <button type="button" onClick={onEmptyAction}>
                <span aria-hidden="true">+</span>
                {emptyActionLabel}
              </button>
            ) : null}
          </div>
        ) : (
          <ul className={styles.taskList}>
            {tasks.map((task, index) => (
              <SortableTaskCard
                key={task.id}
                index={index}
                location={location}
                task={task}
                onEdit={onEdit}
                onMove={onMove}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
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
