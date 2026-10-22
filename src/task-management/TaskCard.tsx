import { Fragment } from 'react';

import { formatDuration, type StoredTask } from '../domain/model';
import { PriorityHighIcon, PriorityLowIcon } from './icons';
import { TaskActionsMenu } from './TaskActionsMenu';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  dragHandleRef?: (element: HTMLDivElement | null) => void;
  headingLevel: 3 | 4;
  task: StoredTask;
  onEdit: (taskId: string, trigger: HTMLButtonElement) => void;
  onMove: (taskId: string, trigger: HTMLButtonElement) => void;
  onDelete: (task: StoredTask) => void;
  onStatusChange: (task: StoredTask) => void;
}

const priorityLabels: Record<StoredTask['priority'], string> = {
  low: 'Niski priorytet',
  medium: 'Średni priorytet',
  high: 'Wysoki priorytet',
};

// W wąskiej kolumnie dnia czas może się złamać tylko między godzinami a minutami;
// liczba zostaje przy jednostce, a znacznik priorytetu przy pierwszej części.
function splitDuration(duration: string) {
  return duration.split(/ (?=\d)/).map((part) => part.replace(' ', '\u00a0'));
}

function PriorityMark({ priority }: { priority: StoredTask['priority'] }) {
  const label = priorityLabels[priority];

  // Średni priorytet jest domyślny, więc nie dokładamy mu znacznika na każdej
  // karcie; czytniki ekranu nadal dostają pełną informację.
  if (priority === 'medium') {
    return <span className={styles.visuallyHidden}>{label}</span>;
  }

  return (
    <span className={styles.priority} data-priority={priority} title={label}>
      {priority === 'high' ? <PriorityHighIcon /> : <PriorityLowIcon />}
      <span className={styles.visuallyHidden}>{label}</span>
    </span>
  );
}

export function TaskCard({
  dragHandleRef,
  headingLevel,
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
  const Title = headingLevel === 3 ? 'h3' : 'h4';

  return (
    <article
      className={styles.card}
      data-priority={task.priority}
      data-status={task.status}
      aria-label={`Zadanie: ${task.title}`}
    >
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
      </label>

      <Title className={styles.title}>{task.title}</Title>
      <span className={styles.status}>
        {isCompleted ? 'Wykonane' : 'Do zrobienia'}
      </span>

      <div
        ref={dragHandleRef}
        className={styles.dragHandle}
        title="Przeciągnij wskaźnikiem"
        aria-hidden="true"
        role="presentation"
        tabIndex={-1}
        data-pointer-drag-handle
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </div>

      <p className={styles.meta}>
        {splitDuration(formatDuration(task.durationMinutes)).map(
          (part, index) =>
            index === 0 ? (
              <span key={part} className={styles.durationPart}>
                <PriorityMark priority={task.priority} />
                {part}
              </span>
            ) : (
              <Fragment key={part}>
                {' '}
                <span className={styles.durationPart}>{part}</span>
              </Fragment>
            ),
        )}
      </p>

      <div className={styles.actions}>
        <TaskActionsMenu
          taskId={task.id}
          taskTitle={task.title}
          onMove={(trigger) => {
            onMove(task.id, trigger);
          }}
          onEdit={(trigger) => {
            onEdit(task.id, trigger);
          }}
          onDelete={() => {
            onDelete(task);
          }}
        />
      </div>
    </article>
  );
}
