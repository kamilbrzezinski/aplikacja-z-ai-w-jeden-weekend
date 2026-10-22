import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { DeleteIcon, EditIcon, MoreIcon, MoveIcon } from './icons';
import styles from './TaskActionsMenu.module.css';

interface TaskActionsMenuProps {
  taskId: string;
  taskTitle: string;
  onMove: (trigger: HTMLButtonElement) => void;
  onEdit: (trigger: HTMLButtonElement) => void;
  onDelete: () => void;
}

interface MenuItem {
  key: string;
  label: string;
  accessibleName: string;
  icon: ReactNode;
  tone?: 'danger';
  run: (trigger: HTMLButtonElement) => void;
}

const MENU_GAP = 4;
const ESTIMATED_MENU_HEIGHT = 140;

export function TaskActionsMenu({
  taskId,
  taskTitle,
  onMove,
  onEdit,
  onDelete,
}: TaskActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties>({});
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const items: MenuItem[] = [
    {
      key: 'move',
      label: 'Przenieś do…',
      accessibleName: `Przenieś do…: ${taskTitle}`,
      icon: <MoveIcon size={16} />,
      run: onMove,
    },
    {
      key: 'edit',
      label: 'Edytuj',
      accessibleName: `Edytuj: ${taskTitle}`,
      icon: <EditIcon size={16} />,
      run: onEdit,
    },
    {
      key: 'delete',
      label: 'Usuń',
      accessibleName: `Usuń: ${taskTitle}`,
      icon: <DeleteIcon size={16} />,
      tone: 'danger',
      run: () => {
        onDelete();
      },
    },
  ];

  function focusItem(index: number) {
    itemRefs.current[(index + items.length) % items.length]?.focus();
  }

  function close({ restoreFocus }: { restoreFocus: boolean }) {
    setIsOpen(false);

    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  }

  // Menu leży w portalu z pozycją fixed, bo przewijana plansza tygodnia
  // przycinałaby je wewnątrz kolumny.
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const opensUpward =
      rect.bottom + ESTIMATED_MENU_HEIGHT > window.innerHeight &&
      rect.top > ESTIMATED_MENU_HEIGHT;

    setPosition({
      right: Math.max(window.innerWidth - rect.right, MENU_GAP),
      ...(opensUpward
        ? { bottom: window.innerHeight - rect.top + MENU_GAP }
        : { top: rect.bottom + MENU_GAP }),
    });
    itemRefs.current[0]?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleViewportChange() {
      setIsOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [isOpen]);

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const focusedIndex = itemRefs.current.findIndex(
      (item) => item === document.activeElement,
    );
    const targets: Record<string, number> = {
      ArrowDown: focusedIndex + 1,
      ArrowUp: focusedIndex - 1,
      Home: 0,
      End: items.length - 1,
    };
    const target = targets[event.key];

    if (target !== undefined) {
      event.preventDefault();
      focusItem(target);
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault();
      close({ restoreFocus: true });
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        id={`task-actions-${taskId}`}
        type="button"
        className={styles.trigger}
        aria-label={`Akcje: ${taskTitle}`}
        aria-describedby="move-task-instructions"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => {
          setIsOpen((open) => !open);
        }}
      >
        <MoreIcon />
      </button>
      {isOpen
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              aria-label={`Akcje: ${taskTitle}`}
              className={styles.menu}
              style={position}
              onKeyDown={handleMenuKeyDown}
            >
              {items.map((item, index) => (
                <button
                  key={item.key}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                  type="button"
                  role="menuitem"
                  className={styles.item}
                  data-tone={item.tone}
                  aria-label={item.accessibleName}
                  onClick={() => {
                    const trigger = triggerRef.current;

                    close({ restoreFocus: true });

                    if (trigger) {
                      item.run(trigger);
                    }
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
