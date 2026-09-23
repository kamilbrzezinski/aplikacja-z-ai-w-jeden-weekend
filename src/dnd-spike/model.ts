export const spikeColumnIds = ['backlog', 'monday'] as const;

export type SpikeColumnId = (typeof spikeColumnIds)[number];

export type SpikeColumns = Record<SpikeColumnId, string[]>;

export interface SpikeItemPosition {
  columnId: SpikeColumnId;
  index: number;
}

export interface MoveSpikeItemAction {
  type: 'item/moved';
  itemId: string;
  destination: SpikeItemPosition;
}

export type SpikeAction = MoveSpikeItemAction;

export const spikeItemLabels: Record<string, string> = {
  'task-presentation': 'Przygotować prezentację',
  'task-email': 'Odpisać na ważne wiadomości',
  'task-shopping': 'Zaplanować zakupy',
};

export function createInitialSpikeColumns(): SpikeColumns {
  return {
    backlog: ['task-presentation', 'task-email', 'task-shopping'],
    monday: [],
  };
}

export function cloneSpikeColumns(columns: SpikeColumns): SpikeColumns {
  return {
    backlog: [...columns.backlog],
    monday: [...columns.monday],
  };
}

export function findSpikeItemPosition(
  columns: SpikeColumns,
  itemId: string,
): SpikeItemPosition | null {
  for (const columnId of spikeColumnIds) {
    const index = columns[columnId].indexOf(itemId);

    if (index !== -1) {
      return { columnId, index };
    }
  }

  return null;
}

export function moveSpikeItem(
  columns: SpikeColumns,
  itemId: string,
  destination: SpikeItemPosition,
): SpikeColumns {
  const source = findSpikeItemPosition(columns, itemId);

  if (!source) {
    return columns;
  }

  const withoutItem: SpikeColumns = {
    backlog: columns.backlog.filter((id) => id !== itemId),
    monday: columns.monday.filter((id) => id !== itemId),
  };
  const destinationItems = withoutItem[destination.columnId];
  const destinationIndex = Math.max(
    0,
    Math.min(destination.index, destinationItems.length),
  );
  const nextDestinationItems = [...destinationItems];

  nextDestinationItems.splice(destinationIndex, 0, itemId);

  const nextColumns: SpikeColumns = {
    ...withoutItem,
    [destination.columnId]: nextDestinationItems,
  };
  const nextPosition = findSpikeItemPosition(nextColumns, itemId);

  if (
    nextPosition?.columnId === source.columnId &&
    nextPosition.index === source.index
  ) {
    return columns;
  }

  return nextColumns;
}

export function spikeReducer(
  columns: SpikeColumns,
  action: SpikeAction,
): SpikeColumns {
  switch (action.type) {
    case 'item/moved':
      return moveSpikeItem(columns, action.itemId, action.destination);
  }
}
