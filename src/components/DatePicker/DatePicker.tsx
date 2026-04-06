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
import { isDateKeyInRange, parseISODate, startOfMonth } from './dateUtils';
import { CalendarPanel } from './CalendarPanel';
import { applyPanelPosition, type PanelPlacement } from './panelPosition';
import styles from './DatePicker.module.css';

type DatePickerPlacement = PanelPlacement;

type DatePickerHtmlPassthrough = Pick<
  React.HTMLAttributes<HTMLButtonElement>,
  'id' | 'aria-invalid' | 'aria-describedby' | 'aria-labelledby' | 'aria-label' | 'aria-required'
>;

export interface DatePickerProps
  extends Omit<StandProps, 'variant' | 'loading'>, DatePickerHtmlPassthrough {
  /** 选中日期 `yyyy-mm-dd` */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  /** 可选最早日 `yyyy-mm-dd` */
  min?: string;
  /** 可选最晚日 `yyyy-mm-dd` */
  max?: string;
  /** 相对触发器；`auto` 视口不足时翻到上方 */
  placement?: DatePickerPlacement;
  /** 挂到 `document.body`，避免 overflow 裁剪 */
  portal?: boolean;
  panelClassName?: string;
  /** 展示用 `toLocaleDateString` 的 locale，默认 `zh-CN` */
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

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  {
    value: valueProp,
    defaultValue = '',
    onChange,
    placeholder = '选择日期',
    size = 'md',
    color = 'default',
    radius = 'md',
    disabled = false,
    required = false,
    name,
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
  const listboxId = `${baseId}-grid`;

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

  const [open, setOpen] = useState(false);
  const parsedValue = value ? parseISODate(value) : null;
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(parsedValue ?? new Date()));

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

  const displayText = useMemo(() => {
    if (!value) return null;
    const d = parseISODate(value);
    if (!d) return value;
    try {
      return d.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return value;
    }
  }, [value, locale]);

  const openPanel = useCallback(() => {
    if (disabled) return;
    setVisibleMonth(startOfMonth(parsedValue ?? new Date()));
    setOpen(true);
  }, [disabled, parsedValue]);

  const closePanel = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const pickDay = useCallback(
    (iso: string) => {
      if (!isDateKeyInRange(iso, min, max)) return;
      setValue(iso);
      closePanel();
    },
    [min, max, setValue, closePanel],
  );

  useLayoutEffect(() => {
    if (!open) return;
    const run = () => {
      const p = panelRef.current;
      const t = triggerRef.current;
      if (p && t) applyPanelPosition(p, t, placement, 288);
    };
    run();
    const id = requestAnimationFrame(run);
    const onScrollOrResize = () => run();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      cancelAnimationFrame(id);
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
        panelRef.current.querySelector<HTMLButtonElement>('button[data-selected="true"]') ??
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

  const panel = open ? (
    <div
      ref={panelRef}
      id={panelId}
      className={joinClasses(styles.panel, panelClassName)}
      role="dialog"
      aria-label="选择日期"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closePanel();
        }
      }}
    >
      <CalendarPanel
        visibleMonth={visibleMonth}
        onVisibleMonthChange={setVisibleMonth}
        selectedIso={value}
        onSelectDay={pickDay}
        min={min}
        max={max}
        locale={locale}
        gridId={listboxId}
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
      <input type="hidden" name={name} value={value} disabled={disabled} aria-hidden />
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
});

DatePicker.displayName = 'DatePicker';
