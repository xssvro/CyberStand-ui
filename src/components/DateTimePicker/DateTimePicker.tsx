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
  clampDateTimeString,
  formatBoundaryHint,
  joinISODateTime,
  parseISODate,
  parseISODateTime,
  startOfMonth,
  toISODate,
} from '../DatePicker/dateUtils';
import { applyPanelPosition, type PanelPlacement } from '../DatePicker/panelPosition';
import { Button } from '../Button';
import datePickerStyles from '../DatePicker/DatePicker.module.css';
import { TimeSpinner } from '../TimePicker/TimeSpinner';
import styles from './DateTimePicker.module.css';
import rootStyles from '../TimePicker/TimePicker.module.css';

type DateTimePickerHtmlPassthrough = Pick<
  React.HTMLAttributes<HTMLButtonElement>,
  'id' | 'aria-invalid' | 'aria-describedby' | 'aria-labelledby' | 'aria-label' | 'aria-required'
>;

export interface DateTimePickerProps
  extends Omit<StandProps, 'variant' | 'loading'>, DateTimePickerHtmlPassthrough {
  /** `yyyy-mm-ddTHH:mm` 或带秒，与 `withSeconds` 一致 */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  min?: string;
  max?: string;
  withSeconds?: boolean;
  minuteStep?: number;
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
  value: string,
  name: string | undefined,
): React.ChangeEvent<HTMLInputElement> {
  const t = { value, name: name ?? '' } as HTMLInputElement;
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

function parseParts(v: string): { date: string; time: string } {
  const p = parseISODateTime(v);
  if (p) return p;
  const dOnly = v.trim().match(/^(\d{4}-\d{2}-\d{2})$/);
  if (dOnly && parseISODate(dOnly[1])) return { date: dOnly[1], time: '00:00' };
  return { date: '', time: '00:00' };
}

function DateTimeGlyph({ className }: { className?: string }) {
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
      <path d="M12 14v3l2 1" />
    </svg>
  );
}

export const DateTimePicker = forwardRef<HTMLButtonElement, DateTimePickerProps>(
  function DateTimePicker(
    {
      value: valueProp,
      defaultValue = '',
      onChange,
      placeholder = '选择日期时间',
      size = 'md',
      color = 'default',
      radius = 'md',
      disabled = false,
      required = false,
      name,
      min,
      max,
      withSeconds = false,
      minuteStep = 1,
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
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const value = isControlled ? valueProp! : uncontrolled;

    const setValue = useCallback(
      (next: string) => {
        if (!isControlled) setUncontrolled(next);
        onChange?.(next, createSyntheticChangeEvent(next, name));
      },
      [isControlled, onChange, name],
    );

    const commitValue = useCallback(
      (next: string) => {
        setValue(clampDateTimeString(next, min, max, withSeconds));
      },
      [setValue, min, max, withSeconds],
    );

    const { date: datePart } = useMemo(() => parseParts(value), [value]);

    const parsedDate = datePart ? parseISODate(datePart) : null;
    const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(parsedDate ?? new Date()));

    const [open, setOpen] = useState(false);
    const [draftTime, setDraftTime] = useState(() => (withSeconds ? '00:00:00' : '00:00'));
    const draftTimeRef = useRef(draftTime);
    useEffect(() => {
      draftTimeRef.current = draftTime;
    }, [draftTime]);
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
      const p = parseParts(value);
      let t = p.time || (withSeconds ? '00:00:00' : '00:00');
      if (t.length === 5 && withSeconds) t = `${t}:00`;
      setDraftTime(t);
      setVisibleMonth(startOfMonth(parsedDate ?? new Date()));
      setOpen(true);
    }, [disabled, parsedDate, value, withSeconds]);

    const closePanel = useCallback(() => {
      if (open) {
        const p = parseParts(value);
        const d = p.date || toISODate(new Date());
        commitValue(joinISODateTime(d, draftTimeRef.current));
      }
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    }, [open, value, commitValue]);

    useEffect(() => {
      if (!open) return;
      const p = parseParts(value);
      let t = p.time || (withSeconds ? '00:00:00' : '00:00');
      if (t.length === 5 && withSeconds) t = `${t}:00`;
      setDraftTime(t);
    }, [open, value, withSeconds]);

    const pickDay = useCallback(
      (iso: string) => {
        commitValue(joinISODateTime(iso, draftTimeRef.current));
      },
      [commitValue],
    );

    const displayText = useMemo(() => {
      if (!value) return null;
      const p = parseISODateTime(value);
      if (!p) return value;
      try {
        const [Y, M, D] = p.date.split('-').map(Number);
        const [hh, mm, ss] = p.time.split(':').map(Number);
        const dt = new Date(Y, M - 1, D, hh, mm, ss || 0);
        return dt.toLocaleString(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: withSeconds ? '2-digit' : undefined,
        });
      } catch {
        return value;
      }
    }, [value, locale, withSeconds]);

    const timeSpinnerValue = useMemo(() => {
      const t = draftTime;
      if (!t) return withSeconds ? '00:00:00' : '00:00';
      return t.length === 5 && withSeconds ? `${t}:00` : t;
    }, [draftTime, withSeconds]);

    const boundHintText = useMemo(() => {
      if (!min && !max) return null;
      if (min && max) {
        return `${formatBoundaryHint(min, locale)} — ${formatBoundaryHint(max, locale)}`;
      }
      if (min) return `不早于 ${formatBoundaryHint(min, locale)}`;
      return `不晚于 ${formatBoundaryHint(max!, locale)}`;
    }, [min, max, locale]);

    useLayoutEffect(() => {
      if (!open) return;
      const run = () => {
        const p = panelRef.current;
        const t = triggerRef.current;
        if (p && t) {
          applyPanelPosition(p, t, placement, 280, {
            matchTriggerWidth: false,
            maxWidth: 'min(calc(100vw - 16px), 404px)',
          });
          const margin = 8;
          const pw = p.getBoundingClientRect().width || p.offsetWidth;
          const leftRaw = p.style.left;
          const leftNum = leftRaw ? parseFloat(leftRaw) : t.getBoundingClientRect().left;
          const maxLeft = Math.max(margin, window.innerWidth - pw - margin);
          const nextLeft = Math.min(Math.max(margin, leftNum), maxLeft);
          if (Number.isFinite(nextLeft)) {
            p.style.setProperty('left', `${nextLeft}px`);
          }
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

    const panel = open ? (
      <div
        ref={panelRef}
        id={panelId}
        className={joinClasses(datePickerStyles.panel, styles.datetimePanel, panelClassName)}
        role="dialog"
        aria-label="选择日期与时间"
        onKeyDown={(ev) => {
          if (ev.key === 'Escape') {
            ev.preventDefault();
            closePanel();
          }
        }}
      >
        <div className={styles.datetimeMain}>
          {boundHintText ? (
            <div className={styles.boundHint} role="note">
              <span className={styles.boundHintLabel}>可选范围</span>
              <span className={styles.boundHintValue}>{boundHintText}</span>
            </div>
          ) : null}
          <div className={styles.datetimeBody}>
            <div className={styles.datetimeCalendar}>
              <CalendarPanel
                compact
                rangeMode="datetimeDay"
                visibleMonth={visibleMonth}
                onVisibleMonthChange={setVisibleMonth}
                selectedIso={datePart}
                onSelectDay={pickDay}
                min={min}
                max={max}
                locale={locale}
                gridId={gridId}
              />
            </div>
            <div className={styles.datetimeTime}>
              <div className={styles.timeLabel}>时间</div>
              <div className={styles.datetimeSpinnerWrap}>
                <TimeSpinner
                  value={timeSpinnerValue}
                  onChange={setDraftTime}
                  withSeconds={withSeconds}
                  minuteStep={minuteStep}
                  className={joinClasses(
                    rootStyles.spinnerBoardFill,
                    rootStyles.spinnerBoardInPanel,
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.panelFooter}>
          <Button
            type="button"
            size="sm"
            variant="solid"
            color={color}
            className={styles.footerAction}
            onClick={closePanel}
          >
            确定
          </Button>
        </div>
      </div>
    ) : null;

    return (
      <div
        className={joinClasses(
          rootStyles.root,
          rootStyles[color],
          disabled && rootStyles.disabled,
          open && rootStyles.open,
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
        <input type="hidden" name={name} value={value} disabled={disabled} aria-hidden />
        <button
          ref={mergeRef}
          type="button"
          className={rootStyles.trigger}
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
          <span className={rootStyles.triggerInner}>
            {displayText ? (
              <span className={rootStyles.valueText}>{displayText}</span>
            ) : (
              <span className={rootStyles.placeholder}>{placeholder}</span>
            )}
          </span>
          <DateTimeGlyph className={rootStyles.clockIcon} />
        </button>
        {portal && panel ? createPortal(panel, document.body) : panel}
      </div>
    );
  },
);

DateTimePicker.displayName = 'DateTimePicker';
