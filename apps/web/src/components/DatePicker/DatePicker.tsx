import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { shiftDays } from "../../lib/format.js";
import {
  WEEKDAY_INITIALS,
  dayLabel,
  monthDays,
  monthLabel,
  monthOf,
  stepMonth,
} from "./month.js";
import styles from "./DatePicker.module.css";

export interface DatePickerLabels {
  dialog: string;
  previousMonth: string;
  nextMonth: string;
}

export interface DatePickerProps {
  /** The selected day, "YYYY-MM-DD". */
  value: string;
  labels: DatePickerLabels;
  onSelect: (iso: string) => void;
  /** Escape only. Dismissing on an outside click belongs to whoever anchors the popover. */
  onClose: () => void;
}

const ARROW_STEPS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

export function DatePicker({ value, labels, onSelect, onClose }: DatePickerProps) {
  const [cursor, setCursor] = useState(() => monthOf(value));
  const [focused, setFocused] = useState(value);
  const focusedRef = useRef<HTMLButtonElement>(null);

  // Roving tabindex: exactly one day is reachable, and focus follows the arrow keys.
  useEffect(() => {
    focusedRef.current?.focus();
  }, [focused]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = ARROW_STEPS[event.key];
    if (step != null) {
      event.preventDefault();
      const next = shiftDays(focused, step);
      setFocused(next);
      setCursor(monthOf(next));
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  }

  return (
    <div className={styles.popover} role="dialog" aria-label={labels.dialog} onKeyDown={onKeyDown}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.step}
          aria-label={labels.previousMonth}
          onClick={() => setCursor(stepMonth(cursor, -1))}
        >
          ‹
        </button>
        <span className={styles.month}>{monthLabel(cursor)}</span>
        <button
          type="button"
          className={styles.step}
          aria-label={labels.nextMonth}
          onClick={() => setCursor(stepMonth(cursor, 1))}
        >
          ›
        </button>
      </div>

      <div className={styles.grid}>
        {WEEKDAY_INITIALS.map((initial) => (
          <span key={initial} className={styles.weekday} aria-hidden="true">
            {initial}
          </span>
        ))}
        {monthDays(cursor).map((iso) => (
          <button
            key={iso}
            type="button"
            ref={iso === focused ? focusedRef : undefined}
            className={styles.day}
            aria-label={dayLabel(iso)}
            aria-pressed={iso === value}
            data-outside={monthOf(iso).month === cursor.month ? undefined : "true"}
            tabIndex={iso === focused ? 0 : -1}
            onClick={() => onSelect(iso)}
          >
            {Number(iso.slice(8, 10))}
          </button>
        ))}
      </div>
    </div>
  );
}
