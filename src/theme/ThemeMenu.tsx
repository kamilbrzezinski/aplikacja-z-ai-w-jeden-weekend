import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from 'react';

import type { ThemePreference } from './theme';
import { ThemeIcon } from './ThemeIcon';
import styles from './ThemeMenu.module.css';
import {
  getThemePreference,
  setThemePreference,
  subscribeToTheme,
} from './themeStore';

interface ThemeOption {
  preference: ThemePreference;
  label: string;
  description: string;
}

const systemOption: ThemeOption = {
  preference: 'system',
  label: 'Automatyczny',
  description: 'Zgodny z urządzeniem',
};

const options: ThemeOption[] = [
  systemOption,
  { preference: 'light', label: 'Jasny', description: 'Zawsze jasny' },
  { preference: 'dark', label: 'Ciemny', description: 'Zawsze ciemny' },
];

export function ThemeMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const preference = useSyncExternalStore(subscribeToTheme, getThemePreference);
  const current =
    options.find((option) => option.preference === preference) ?? systemOption;

  function focusItem(index: number) {
    itemRefs.current[(index + options.length) % options.length]?.focus();
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      window.requestAnimationFrame(() => {
        focusItem(options.indexOf(current));
      });
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const focusedIndex = itemRefs.current.findIndex(
      (item) => item === document.activeElement,
    );
    const targets: Record<string, number> = {
      ArrowDown: focusedIndex + 1,
      ArrowUp: focusedIndex - 1,
      Home: 0,
      End: options.length - 1,
    };
    const target = targets[event.key];

    if (target !== undefined) {
      event.preventDefault();
      focusItem(target);
    } else if (event.key === 'Tab') {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={`Motyw: ${current.label}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => {
          setIsOpen((open) => !open);
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <ThemeIcon preference={current.preference} />
      </button>
      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Wybierz motyw"
          className={styles.menu}
          onKeyDown={handleMenuKeyDown}
        >
          {options.map((option, index) => {
            const isChecked = option.preference === preference;

            return (
              <button
                key={option.preference}
                ref={(item) => {
                  itemRefs.current[index] = item;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={isChecked}
                className={styles.item}
                onClick={() => {
                  setThemePreference(option.preference);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                <ThemeIcon preference={option.preference} />
                <span className={styles.itemText}>
                  <span className={styles.itemLabel}>{option.label}</span>
                  <span className={styles.itemDescription}>
                    {option.description}
                  </span>
                </span>
                <span className={styles.check} aria-hidden="true">
                  {isChecked ? (
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.25"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
