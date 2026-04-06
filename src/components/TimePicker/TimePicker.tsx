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
import { formatISOTime, parseISOTime } from '../DatePicker/dateUtils';
import { applyPanelPosition, type PanelPlacement } from '../DatePicker/panelPosition';
import datePickerStyles from '../DatePicker/DatePicker.module.css';
import { TimeSpinner } from './TimeSpinner';
import styles from './TimePicker.module.css';

type TimePickerHtmlPassthrough = Pick<
  React.HTMLAttributes<HTMLButtonElement>,
  'id' | 'aria-invalid' | 'aria-describedby' | 'aria-labelledby' | 'aria-label' | 'aria-required'
>;

export interface TimePickerProps
  extends Omit<StandProps, 'variant' | 'loading'>, TimePickerHtmlPassthrough {
  /** `HH:mm` 或 `HH:mm:ss`（与 `withSeconds` 一致） */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  withSeconds?: boolean;
  minuteStep?: number;
  placement?: PanelPlacement;
  portal?: boolean;
  panelClassName?: string;
  /** 展示用语，默认 `zh-CN` */
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

function ClockGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx={12} cy={12} r={9} />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export const TimePicker = forwardRef<HTMLButtonElement, TimePickerProps>(function TimePicker(
  {
    value: valueProp,
    defaultValue = '',
    onChange,
    placeholder = '选择时间',
    size = 'md',
    color = 'default',
    radius = 'md',
    disabled = false,
    required = false,
    name,
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
    const p = parseISOTime(value);
    if (!p) return value;
    try {
      const d = new Date();
      d.setHours(p.h, p.m, p.sec, 0);
      return d.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: withSeconds ? '2-digit' : undefined,
      });
    } catch {
      return value;
    }
  }, [value, locale, withSeconds]);

  const spinnerValue = value || formatISOTime(0, 0, 0, withSeconds);

  const openPanel = useCallback(() => {
    if (disabled) return;
    setOpen(true);
  }, [disabled]);

  const closePanel = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    const run = () => {
      const p = panelRef.current;
      const t = triggerRef.current;
      if (p && t) {
        const panelMinW = withSeconds ? 138 : 108;
        applyPanelPosition(p, t, placement, panelMinW, { matchTriggerWidth: false });
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
  }, [open, placement, withSeconds]);

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
      className={joinClasses(datePickerStyles.panel, styles.timePanel, panelClassName)}
      role="dialog"
      aria-label="选择时间"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closePanel();
        }
      }}
    >
      <TimeSpinner
        value={spinnerValue}
        onChange={setValue}
        withSeconds={withSeconds}
        minuteStep={minuteStep}
        onPickComplete={closePanel}
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
        <ClockGlyph className={styles.clockIcon} />
      </button>
      {portal && panel ? createPortal(panel, document.body) : panel}
    </div>
  );
});

TimePicker.displayName = 'TimePicker';
