import React, { memo, useMemo } from 'react';
import {
  addMonths,
  buildMonthGrid,
  isDateKeyInRange,
  isDayPartiallyInDateTimeRange,
  pad2,
  toISODate,
} from './dateUtils';
import styles from './DatePicker.module.css';

const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface CalendarPanelProps {
  visibleMonth: Date;
  onVisibleMonthChange: (d: Date) => void;
  /** 当前选中日 `yyyy-mm-dd`，空字符串表示未选 */
  selectedIso: string;
  onSelectDay: (iso: string) => void;
  min?: string;
  max?: string;
  locale?: string;
  /** 供 `aria-labelledby` 等引用 */
  gridId?: string;
  /** 更小字号与格子，用于日期时间并排面板 */
  compact?: boolean;
  /**
   * `dateKey`：仅比较 `yyyy-mm-dd`（DatePicker；`min`/`max` 可带时间）。
   * `datetimeDay`：该日是否与 [min,max] 在时间上仍有交集（DateTimePicker）。
   */
  rangeMode?: 'dateKey' | 'datetimeDay';
}

const CalendarPanelInner: React.FC<CalendarPanelProps> = ({
  visibleMonth,
  onVisibleMonthChange,
  selectedIso,
  onSelectDay,
  min,
  max,
  locale = 'zh-CN',
  gridId,
  compact = false,
  rangeMode = 'dateKey',
}) => {
  const todayIso = useMemo(() => toISODate(new Date()), []);

  const monthTitle = useMemo(() => {
    try {
      return visibleMonth.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
    } catch {
      return `${visibleMonth.getFullYear()}-${pad2(visibleMonth.getMonth() + 1)}`;
    }
  }, [visibleMonth, locale]);

  const cells = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);

  const prevMonth = addMonths(visibleMonth, -1);
  const lastPrev = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
  const prevNavDisabled = min ? toISODate(lastPrev) < min : false;

  const nextMonthFirst = addMonths(visibleMonth, 1);
  const nextNavDisabled = max ? toISODate(nextMonthFirst) > max : false;

  const body = (
    <>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navBtn}
          aria-label="上一月"
          disabled={prevNavDisabled}
          onClick={() => onVisibleMonthChange(addMonths(visibleMonth, -1))}
        >
          ‹
        </button>
        <div className={styles.monthLabel}>{monthTitle}</div>
        <button
          type="button"
          className={styles.navBtn}
          aria-label="下一月"
          disabled={nextNavDisabled}
          onClick={() => onVisibleMonthChange(addMonths(visibleMonth, 1))}
        >
          ›
        </button>
      </div>
      <div className={styles.weekdays} aria-hidden>
        {WEEK_LABELS.map((w) => (
          <div key={w} className={styles.weekday}>
            {w}
          </div>
        ))}
      </div>
      <div id={gridId} className={styles.grid}>
        {cells.map((cell) => {
          const selectable =
            rangeMode === 'datetimeDay'
              ? isDayPartiallyInDateTimeRange(cell.iso, min, max)
              : isDateKeyInRange(cell.iso, min, max);
          const selected = selectedIso === cell.iso;
          const isToday = cell.iso === todayIso;
          return (
            <button
              key={cell.iso}
              type="button"
              data-selected={selected ? 'true' : undefined}
              data-today={isToday && !selected ? 'true' : undefined}
              disabled={!selectable}
              aria-pressed={selected}
              aria-current={isToday ? 'date' : undefined}
              className={joinClasses(
                styles.dayBtn,
                !cell.inCurrentMonth && styles.dayOutside,
                isToday && styles.dayToday,
                selected && styles.daySelected,
                !selectable && styles.dayDisabled,
              )}
              onClick={() => selectable && onSelectDay(cell.iso)}
            >
              {cell.date.getDate()}
            </button>
          );
        })}
      </div>
    </>
  );

  return compact ? <div className={styles.calendarCompact}>{body}</div> : body;
};

export const CalendarPanel = memo(CalendarPanelInner);
CalendarPanel.displayName = 'CalendarPanel';
