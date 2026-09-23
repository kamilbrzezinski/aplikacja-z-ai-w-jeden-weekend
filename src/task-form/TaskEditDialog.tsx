import { useEffect, useId, useRef, type RefObject } from 'react';

import type { StoredTask } from '../domain/model';
import { TaskForm, type TaskFormValues } from './TaskForm';
import styles from './TaskEditDialog.module.css';

interface TaskEditDialogProps {
  task: StoredTask | null;
  returnFocusRef: RefObject<HTMLElement | null>;
  onSubmit: (taskId: string, values: TaskFormValues) => void;
  onClose: () => void;
}

export function TaskEditDialog({
  task,
  returnFocusRef,
  onSubmit,
  onClose,
}: TaskEditDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shouldRestoreFocusRef = useRef(false);
  const headingId = useId();
  const taskId = task?.id ?? null;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (taskId && dialog && !dialog.open) {
      shouldRestoreFocusRef.current = true;
      dialog.showModal();
    }

    if (!taskId && shouldRestoreFocusRef.current) {
      shouldRestoreFocusRef.current = false;
      returnFocusRef.current?.focus();
    }
  }, [returnFocusRef, taskId]);

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
        onClose();
      }}
    >
      {task ? (
        <div className={styles.content}>
          <div className={styles.heading}>
            <p className={styles.eyebrow}>Edycja zadania</p>
            <h2 id={headingId}>Popraw szczegóły</h2>
          </div>
          <TaskForm
            key={task.id}
            initialValues={{
              title: task.title,
              priority: task.priority,
              durationMinutes: task.durationMinutes,
            }}
            submitLabel="Zapisz zmiany"
            titleAutoFocus
            onCancel={closeDialog}
            onSubmit={(values) => {
              onSubmit(task.id, values);
              closeDialog();
            }}
          />
        </div>
      ) : null}
    </dialog>
  );
}
