import { move } from '@dnd-kit/helpers';
import {
  DragDropProvider,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { useEffect, useReducer, useRef, useState } from 'react';

import styles from './DndSpike.module.css';
import {
  cloneSpikeColumns,
  createInitialSpikeColumns,
  findSpikeItemPosition,
  spikeColumnIds,
  spikeItemLabels,
  spikeReducer,
  type MoveSpikeItemAction,
  type SpikeColumnId,
  type SpikeColumns,
} from './model';

const SPIKE_ITEM_TYPE = 'spike-item';
const COLUMN_COLLISION_PRIORITY = 1;

const columnLabels: Record<SpikeColumnId, string> = {
  backlog: 'Do zaplanowania',
  monday: 'Poniedziałek',
};

interface DndSpikeProps {
  onCommit?: (action: MoveSpikeItemAction) => void;
}

interface SpikeColumnProps {
  columnId: SpikeColumnId;
  itemIds: string[];
}

interface SortableSpikeItemProps {
  columnId: SpikeColumnId;
  id: string;
  index: number;
}

function isSpikeColumnId(value: unknown): value is SpikeColumnId {
  return spikeColumnIds.includes(value as SpikeColumnId);
}

function SortableSpikeItem({ columnId, id, index }: SortableSpikeItemProps) {
  const { handleRef, isDragging, isDropping, isDropTarget, ref } = useSortable({
    id,
    index,
    group: columnId,
    type: SPIKE_ITEM_TYPE,
    accept: SPIKE_ITEM_TYPE,
  });
  const label = spikeItemLabels[id] ?? id;

  return (
    <li
      ref={ref}
      className={styles.item}
      data-column-id={columnId}
      data-dragging={isDragging || undefined}
      data-dropping={isDropping || undefined}
      data-drop-target={isDropTarget || undefined}
      data-item-id={id}
    >
      <button
        ref={handleRef}
        type="button"
        className={styles.dragHandle}
        aria-label={`Przenieś: ${label}`}
        aria-describedby="dnd-instructions"
      >
        <span aria-hidden="true">⠿</span>
      </button>
      <span className={styles.itemLabel}>{label}</span>
    </li>
  );
}

function SpikeColumn({ columnId, itemIds }: SpikeColumnProps) {
  const { isDropTarget, ref } = useDroppable({
    id: columnId,
    accept: SPIKE_ITEM_TYPE,
    collisionPriority: COLUMN_COLLISION_PRIORITY,
  });

  return (
    <section
      className={styles.column}
      aria-labelledby={`${columnId}-heading`}
      data-testid={`column-${columnId}`}
    >
      <div className={styles.columnHeading}>
        <h2 id={`${columnId}-heading`}>{columnLabels[columnId]}</h2>
        <span aria-label={`Liczba zadań: ${itemIds.length}`}>
          {itemIds.length}
        </span>
      </div>
      <ul
        ref={ref}
        className={styles.list}
        data-drop-target={isDropTarget || undefined}
        data-testid={`dropzone-${columnId}`}
      >
        {itemIds.length === 0 ? (
          <li className={styles.emptyState}>Upuść zadanie</li>
        ) : (
          itemIds.map((id, index) => (
            <SortableSpikeItem
              key={id}
              id={id}
              index={index}
              columnId={columnId}
            />
          ))
        )}
      </ul>
    </section>
  );
}

function positionsMatch(
  first: ReturnType<typeof findSpikeItemPosition>,
  second: ReturnType<typeof findSpikeItemPosition>,
) {
  return first?.columnId === second?.columnId && first?.index === second?.index;
}

export function DndSpike({ onCommit }: DndSpikeProps) {
  const [committedColumns, dispatch] = useReducer(
    spikeReducer,
    undefined,
    createInitialSpikeColumns,
  );
  const [draftColumns, setDraftColumns] =
    useState<SpikeColumns>(committedColumns);
  const snapshotRef = useRef(cloneSpikeColumns(committedColumns));
  const draftRef = useRef(draftColumns);
  const isDraggingRef = useRef(false);

  const updateDraft = (columns: SpikeColumns) => {
    draftRef.current = columns;
    setDraftColumns(columns);
  };

  useEffect(() => {
    if (!isDraggingRef.current) {
      updateDraft(committedColumns);
    }
  }, [committedColumns]);

  const handleDragStart = (event: DragStartEvent) => {
    const sourceId = event.operation.source?.id;

    if (typeof sourceId !== 'string') {
      return;
    }

    isDraggingRef.current = true;
    snapshotRef.current = cloneSpikeColumns(committedColumns);
    updateDraft(cloneSpikeColumns(committedColumns));
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

    if (event.canceled || typeof sourceId !== 'string' || targetId == null) {
      updateDraft(cloneSpikeColumns(snapshot));
      return;
    }

    const finalDraft = move(draftRef.current, event);
    const initialPosition = findSpikeItemPosition(snapshot, sourceId);
    const destination = findSpikeItemPosition(finalDraft, sourceId);

    if (
      !initialPosition ||
      !destination ||
      !isSpikeColumnId(destination.columnId) ||
      positionsMatch(initialPosition, destination)
    ) {
      updateDraft(cloneSpikeColumns(snapshot));
      return;
    }

    const action: MoveSpikeItemAction = {
      type: 'item/moved',
      itemId: sourceId,
      destination,
    };

    dispatch(action);
    onCommit?.(action);
    updateDraft(finalDraft);
  };

  return (
    <main className={styles.shell}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Spike techniczny dnd-kit</p>
        <h1>Przeciąganie między listami</h1>
        <p id="dnd-instructions" className={styles.instructions}>
          Użyj uchwytu. Klawiaturą rozpocznij spacją lub Enterem, poruszaj
          strzałkami, zatwierdź spacją albo anuluj klawiszem Esc.
        </p>
      </header>

      <DragDropProvider
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.board}>
          {spikeColumnIds.map((columnId) => (
            <SpikeColumn
              key={columnId}
              columnId={columnId}
              itemIds={draftColumns[columnId]}
            />
          ))}
        </div>
      </DragDropProvider>
    </main>
  );
}
