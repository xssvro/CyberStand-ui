import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import type { StandProps } from '../../core/stand';
import { getRadiusVar, getSizeVars } from '../../core/stand';
import { CalendarPanel } from '../DatePicker/CalendarPanel';
import {
  clampDateRangeToBounds,
  formatDateRangeSlash,
  isCompleteDateRange,
  normalizeDateRangeISO,
  parseISODate,
  type DateRangeISO,
  startOfMonth,
} from '../DatePicker/dateUtils';
import { applyPanelPosition, type PanelPlacement } from '../DatePicker/panelPosition';
import styles from '../DatePicker/DatePicker.module.css';

type DateRangePickerHtmlPassthrough = Pick<
  React.HTMLAttributes<HTMLButtonElement>,
  'id' | 'aria-invalid' | 'aria-describedby' | 'aria-labelledby' | 'aria-label' | 'aria-required'
>;

export interface DateRangePickerProps
  extends Omit<StandProps, 'variant' | 'loading'>, DateRangePickerHtmlPassthrough {
  value?: DateRangeISO;
  defaultValue?: DateRangeISO;
  onChange?: (value: DateRangeISO, e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /** 合并写入单一隐藏域，值为 `yyyy-mm-dd/yyyy-mm-dd` */
  name?: string;
  /** 与 `endName` 同时使用时拆成两个隐藏域，优先于 `name` */
  startName?: string;
  endName?: string;
  min?: string;
  max?: string;
  placement?: PanelPlacement;
  portal?: boolean;
  panelClassName?: string;
  locale?: string;
  className?: string;
  style?: React.CSSProperties;
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function createSyntheticChangeEvent(
  value: DateRangeISO,
  name: string | undefined,
): React.ChangeEvent<HTMLInputElement> {
  const slash = formatDateRangeSlash(value);
  const t = { value: slash, name: name ?? '' } as HTMLInputElement;
  return {
    target: t,
    currentTarget: t,
    nativeEvent: {} as unknown as Event,
    bubbles: false,
    cancelable: false,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: false,
    preventDefault: () => {},
    isDefaultPrevented: () => false,
    stopPropagation: () => {},
    isPropagationStopped: () => false,
    persist: () => {},
    timeStamp: Date.now(),
    type: 'change',
  } as React.ChangeEvent<HTMLInputElement>;
}

function CalendarGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x={3} y={4} width={18} height={18} rx={2} />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

const EMPTY_RANGE: DateRangeISO = { start: '', end: '' };

export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      value: valueProp,
      defaultValue = EMPTY_RANGE,
      onChange,
      placeholder = '选择日期范围',
      size = 'md',
      color = 'default',
      radius = 'md',
      disabled = false,
      required = false,
      name,
      startName,
      endName,
      min,
      max,
      placement = 'auto',
      portal = true,
      panelClassName,
      locale = 'zh-CN',
      className = '',
      style,
      id,
      'aria-invalid': ariaInvalid,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      'aria-label': ariaLabel,
      'aria-required': ariaRequired,
    },
    ref,
  ) {
    const baseId = useId().replace(/:/g, '');
    const panelId = `${baseId}-panel`;
    const gridId = `${baseId}-grid`;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = useState<DateRangeISO>(() =>
      normalizeDateRangeISO(defaultValue.start, defaultValue.end),
    );
    const value = isControlled ? valueProp! : uncontrolled;

    const setValue = useCallback(
      (next: DateRangeISO) => {
        const clamped = clampDateRangeToBounds(
          normalizeDateRangeISO(next.start, next.end),
          min,
          max,
        );
        if (!isControlled) setUncontrolled(clamped);
        onChange?.(clamped, createSyntheticChangeEvent(clamped, name));
      },
      [isControlled, onChange, name, min, max],
    );

    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<DateRangeISO>(EMPTY_RANGE);

    const parsedStart = value.start ? parseISODate(value.start) : null;
    const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(parsedStart ?? new Date()));

    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const mergeRef = useCallback(
      (node: HTMLButtonElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref],
    );

    const openPanel = useCallback(() => {
      if (disabled) return;
      const norm = normalizeDateRangeISO(value.start, value.end);
      setDraft(norm);
      setVisibleMonth(startOfMonth(parsedStart ?? new Date()));
      setOpen(true);
    }, [disabled, value.start, value.end, parsedStart]);

    const closePanel = useCallback(() => {
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    }, []);

    const pickDay = useCallback(
      (iso: string) => {
        if (!draft.start || (draft.start && draft.end)) {
          setDraft({ start: iso, end: '' });
          return;
        }
        const next = normalizeDateRangeISO(draft.start, iso);
        const clamped = clampDateRangeToBounds(next, min, max);
        setValue(clamped);
        closePanel();
      },
      [draft.start, draft.end, setValue, min, max, closePanel],
    );

    const displayText = useMemo(() => {
      const norm = normalizeDateRangeISO(value.start, value.end);
      if (!isCompleteDateRange(norm)) return null;
      try {
        const ds = parseISODate(norm.start)!;
        const de = parseISODate(norm.end)!;
        const o = { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const };
        const a = ds.toLocaleDateString(locale, o);
        const b = de.toLocaleDateString(locale, o);
        return `${a} — ${b}`;
      } catch {
        return formatDateRangeSlash(norm);
      }
    }, [value.start, value.end, locale]);

    useLayoutEffect(() => {
      if (!open) return;
      const run = () => {
        const p = panelRef.current;
        const t = triggerRef.current;
        if (p && t) {
          applyPanelPosition(p, t, placement, 288);
          const margin = 8;
          const pw = p.getBoundingClientRect().width || p.offsetWidth;
          const leftRaw = p.style.left;
          const leftNum = leftRaw ? parseFloat(leftRaw) : t.getBoundingClientRect().left;
          const maxLeft = Math.max(margin, window.innerWidth - pw - margin);
          const nextLeft = Math.min(Math.max(margin, leftNum), maxLeft);
          if (Number.isFinite(nextLeft)) p.style.setProperty('left', `${nextLeft}px`);
        }
      };
      run();
      const idRaf = requestAnimationFrame(run);
      const onScrollOrResize = () => run();
      window.addEventListener('scroll', onScrollOrResize, true);
      window.addEventListener('resize', onScrollOrResize);
      return () => {
        cancelAnimationFrame(idRaf);
        window.removeEventListener('scroll', onScrollOrResize, true);
        window.removeEventListener('resize', onScrollOrResize);
      };
    }, [open, placement]);

    useEffect(() => {
      if (!open) return;
      const onDoc = (e: MouseEvent) => {
        const n = e.target as Node;
        if (triggerRef.current?.contains(n)) return;
        if (panelRef.current?.contains(n)) return;
        closePanel();
      };
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }, [open, closePanel]);

    const prevOpenRef = useRef(false);
    useLayoutEffect(() => {
      if (open && !prevOpenRef.current && panelRef.current) {
        const sel =
          panelRef.current.querySelector<HTMLButtonElement>('button[data-range="true"]') ??
          panelRef.current.querySelector<HTMLButtonElement>('button[data-today="true"]');
        sel?.focus({ preventScroll: true });
      }
      prevOpenRef.current = open;
    }, [open]);

    const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      switch (e.key) {
        case 'ArrowDown':
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!open) openPanel();
          break;
        case 'Escape':
          if (open) {
            e.preventDefault();
            closePanel();
          }
          break;
        case 'Tab':
          if (open) closePanel();
          break;
        default:
          break;
      }
    };

    const sizeVars = getSizeVars(size);
    const radiusVar = getRadiusVar(radius);

    const slashValue = formatDateRangeSlash(value);
    const useSplitHidden = Boolean(startName && endName);

    const panel = open ? (
      <div
        ref={panelRef}
        id={panelId}
        className={joinClasses(styles.panel, panelClassName)}
        role="dialog"
        aria-label="选择日期范围"
        onKeyDown={(ev) => {
          if (ev.key === 'Escape') {
            ev.preventDefault();
            closePanel();
          }
        }}
      >
        <CalendarPanel
          daySelection="range"
          rangeStartIso={draft.start}
          rangeEndIso={draft.end}
          visibleMonth={visibleMonth}
          onVisibleMonthChange={setVisibleMonth}
          selectedIso=""
          onSelectDay={pickDay}
          min={min}
          max={max}
          locale={locale}
          gridId={gridId}
        />
      </div>
    ) : null;

    return (
      <div
        className={joinClasses(
          styles.root,
          styles[color],
          disabled && styles.disabled,
          open && styles.open,
          className,
        )}
        style={
          {
            ...sizeVars,
            '--su-radius': radiusVar,
            ...style,
          } as React.CSSProperties
        }
      >
        {useSplitHidden ? (
          <>
            <input
              type="hidden"
              name={startName}
              value={value.start}
              disabled={disabled}
              aria-hidden
            />
            <input type="hidden" name={endName} value={value.end} disabled={disabled} aria-hidden />
          </>
        ) : (
          <input type="hidden" name={name} value={slashValue} disabled={disabled} aria-hidden />
        )}
        <button
          ref={mergeRef}
          type="button"
          className={styles.trigger}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          id={id}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          aria-label={ariaLabel}
          aria-required={ariaRequired ?? required}
          onClick={() => (open ? closePanel() : openPanel())}
          onKeyDown={onTriggerKeyDown}
        >
          <span className={styles.triggerInner}>
            {displayText ? (
              <span className={styles.valueText}>{displayText}</span>
            ) : (
              <span className={styles.placeholder}>{placeholder}</span>
            )}
          </span>
          <CalendarGlyph className={styles.calendarIcon} />
        </button>
        {portal && panel ? createPortal(panel, document.body) : panel}
      </div>
    );
  },
);

DateRangePicker.displayName = 'DateRangePicker';
