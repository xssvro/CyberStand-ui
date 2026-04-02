/* eslint-disable react-refresh/only-export-components -- Select.Option 占位 + forwardRef 主组件同文件 */
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
import { getSizeVars, getRadiusVar } from '../../core/stand';
import styles from './Select.module.css';

const CHEVRON_SVG = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>'
);
const CHEVRON_BG = `url("data:image/svg+xml,${CHEVRON_SVG}")`;

type SelectHtmlPassthrough = Pick<
  React.HTMLAttributes<HTMLButtonElement>,
  | 'id'
  | 'aria-invalid'
  | 'aria-describedby'
  | 'aria-labelledby'
  | 'aria-label'
  | 'aria-required'
  | 'role'
>;

export type SelectOptionData = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  /** 供 `renderOption` 使用的任意附加数据（仅 `options` 数组传入时保留） */
  meta?: unknown;
};

export type SelectRenderValueContext = {
  value: string | undefined;
  label: React.ReactNode | undefined;
  placeholder?: string;
  open: boolean;
};

export type SelectRenderOptionContext = {
  option: SelectOptionData;
  index: number;
  selected: boolean;
  active: boolean;
  disabled: boolean;
};

export interface SelectOptionProps {
  value: string;
  disabled?: boolean;
  /** 与 children 二选一；用于纯文本项 */
  label?: React.ReactNode;
  children?: React.ReactNode;
}

function SelectOptionSlot(props: SelectOptionProps): null {
  void props;
  return null;
}
SelectOptionSlot.displayName = 'Select.Option';

type SelectPlacement = 'bottom-start' | 'top-start' | 'auto';

export interface SelectProps extends Omit<StandProps, 'variant'>, SelectHtmlPassthrough {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  autoComplete?: string;
  placeholder?: string;
  /** 与 `children`（`Select.Option` 或原生 `<option>`）二选一 */
  options?: SelectOptionData[];
  children?: React.ReactNode;
  /** 下拉相对触发器：`auto` 在空间不足时翻到上方 */
  placement?: SelectPlacement;
  /** 列表区域最大高度（px 或 CSS 长度） */
  listMaxHeight?: number | string;
  /** 是否挂到 `document.body`（默认 true，避免 overflow 裁剪） */
  portal?: boolean;
  /** 下拉根节点额外 className */
  contentClassName?: string;
  /** 列表项额外 className（每项都会带上，可与 renderOption 联用） */
  itemClassName?: string;
  /** 自定义触发器展示内容 */
  renderValue?: (ctx: SelectRenderValueContext) => React.ReactNode;
  /** 自定义每一项；默认渲染 option.label */
  renderOption?: (ctx: SelectRenderOptionContext) => React.ReactNode;
  /** 无选项时的列表区内容 */
  empty?: React.ReactNode;
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function isSelectOptionElement(el: React.ReactElement): boolean {
  const t = el.type;
  if (t === SelectOptionSlot) return true;
  if (typeof t === 'function' && (t as { displayName?: string }).displayName === 'Select.Option') {
    return true;
  }
  return false;
}

function isNativeOptionElement(el: React.ReactElement): el is React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>> {
  return typeof el.type === 'string' && el.type === 'option';
}

function normalizeOptions(
  options: SelectProps['options'],
  children: React.ReactNode
): SelectOptionData[] {
  if (options != null && options.length > 0) {
    return options.map((o) => ({
      value: o.value,
      label: o.label,
      disabled: o.disabled,
      meta: o.meta,
    }));
  }
  const out: SelectOptionData[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (isSelectOptionElement(child)) {
      const p = child.props as SelectOptionProps;
      out.push({
        value: p.value,
        label: p.label ?? p.children,
        disabled: p.disabled,
      });
      return;
    }
    if (isNativeOptionElement(child)) {
      const p = child.props;
      if (p.value == null || p.value === '') return;
      out.push({
        value: String(p.value),
        label: p.children,
        disabled: p.disabled,
      });
    }
  });
  return out;
}

function createSyntheticChangeEvent(
  value: string,
  name: string | undefined
): React.ChangeEvent<HTMLSelectElement> {
  const t = { value, name: name ?? '' } as HTMLSelectElement;
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
  } as React.ChangeEvent<HTMLSelectElement>;
}

function nextEnabledIndex(opts: SelectOptionData[], from: number, delta: 1 | -1): number {
  const n = opts.length;
  if (n === 0) return -1;
  let i = from;
  for (let step = 0; step < n; step++) {
    i = (i + delta + n) % n;
    if (!opts[i]?.disabled) return i;
  }
  return from;
}

function firstEnabledIndex(opts: SelectOptionData[]): number {
  const i = opts.findIndex((o) => !o.disabled);
  return i >= 0 ? i : 0;
}

function parseMaxHeightPx(listMaxHeight: number | string | undefined, fallback: number): number {
  if (listMaxHeight === undefined) return fallback;
  if (typeof listMaxHeight === 'number') return listMaxHeight;
  const m = /^(\d+(?:\.\d+)?)px$/.exec(listMaxHeight.trim());
  if (m) return parseFloat(m[1]);
  return fallback;
}

/** 直接写 DOM，避免 setState 滞后一帧导致滚动时面板「跟不上」 */
function applyDropdownPosition(
  listEl: HTMLElement,
  triggerEl: HTMLElement,
  placement: SelectPlacement,
  listMaxHeight: number | string | undefined
): void {
  const rect = triggerEl.getBoundingClientRect();
  const prefMax = parseMaxHeightPx(listMaxHeight, 320);
  const gap = 6;
  const margin = 8;
  const below = window.innerHeight - rect.bottom - margin;
  const above = rect.top - margin;

  let openUp =
    placement === 'top-start' ||
    (placement === 'auto' && below < Math.min(120, prefMax * 0.4) && above > below);
  if (placement === 'bottom-start') openUp = false;

  const maxH = Math.min(prefMax, openUp ? above - gap : below - gap);
  const width = Math.max(rect.width, 120);
  const zRaw = getComputedStyle(document.documentElement).getPropertyValue('--su-z-dropdown').trim();
  const zIndex = zRaw || '1000';

  listEl.style.setProperty('position', 'fixed');
  listEl.style.setProperty('left', `${rect.left}px`);
  listEl.style.setProperty('width', `${width}px`);
  listEl.style.setProperty('max-height', `${Math.max(80, maxH)}px`);
  listEl.style.setProperty('z-index', zIndex);

  if (openUp) {
    listEl.style.setProperty('top', 'auto');
    listEl.style.setProperty('bottom', `${window.innerHeight - rect.top + gap}px`);
  } else {
    listEl.style.setProperty('bottom', 'auto');
    listEl.style.setProperty('top', `${rect.bottom + gap}px`);
  }
}

/** 仅在列表容器内滚动，禁止 scrollIntoView 带动整页滚动 */
function scrollActiveOptionIntoList(listEl: HTMLElement | null, optionId: string): void {
  if (!listEl) return;
  const optionEl = document.getElementById(optionId);
  if (!optionEl || !listEl.contains(optionEl)) return;
  const listTop = listEl.scrollTop;
  const listH = listEl.clientHeight;
  const optOffsetTop = (optionEl as HTMLElement).offsetTop;
  const optH = (optionEl as HTMLElement).offsetHeight;
  if (optOffsetTop < listTop) {
    listEl.scrollTop = optOffsetTop;
  } else if (optOffsetTop + optH > listTop + listH) {
    listEl.scrollTop = optOffsetTop + optH - listH;
  }
}

const SelectInner = forwardRef<HTMLButtonElement, SelectProps>(function SelectInner(
  {
    value: valueProp,
    defaultValue,
    onChange,
    size = 'md',
    color = 'default',
    radius = 'md',
    disabled = false,
    required = false,
    name,
    autoComplete,
    placeholder,
    options,
    children,
    placement = 'auto',
    listMaxHeight,
    portal = true,
    contentClassName,
    itemClassName,
    renderValue,
    renderOption,
    empty,
    className = '',
    style,
    ...ariaProps
  },
  ref
) {
  const listId = useId().replace(/:/g, '');
  const opts = useMemo(() => normalizeOptions(options, children), [options, children]);

  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const value = isControlled ? valueProp! : uncontrolledValue;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolledValue(next);
      onChange?.(next, createSyntheticChangeEvent(next, name));
    },
    [isControlled, onChange, name]
  );

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedIndex = useMemo(() => opts.findIndex((o) => o.value === value), [opts, value]);
  const selectedOption = selectedIndex >= 0 ? opts[selectedIndex] : undefined;
  const displayLabel = selectedOption?.label;
  const showPlaceholder = value === '' || selectedIndex < 0;

  const mergeRef = useCallback(
    (node: HTMLButtonElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    },
    [ref]
  );

  const openAt = useCallback(() => {
    if (disabled || opts.length === 0) return;
    const start =
      selectedIndex >= 0 && !opts[selectedIndex]?.disabled
        ? selectedIndex
        : firstEnabledIndex(opts);
    setActiveIndex(start);
    setOpen(true);
  }, [disabled, opts, selectedIndex]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const commit = useCallback(
    (index: number) => {
      const o = opts[index];
      if (!o || o.disabled) return;
      setValue(o.value);
      close();
    },
    [opts, setValue, close]
  );

  useLayoutEffect(() => {
    if (!open) return;

    const positionNow = () => {
      const list = listRef.current;
      const trig = triggerRef.current;
      if (list && trig) {
        applyDropdownPosition(list, trig, placement, listMaxHeight);
      }
    };

    positionNow();
    const rafSync = requestAnimationFrame(positionNow);

    /** 同步更新位置，避免 rAF 晚一帧导致滚动时面板与触发器错位 */
    const onScrollOrResize = () => {
      positionNow();
    };

    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      cancelAnimationFrame(rafSync);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open, placement, listMaxHeight]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (listRef.current?.contains(t)) return;
      close();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, close]);

  useLayoutEffect(() => {
    if (!open || opts.length === 0) return;
    scrollActiveOptionIntoList(listRef.current, `${listId}-opt-${activeIndex}`);
  }, [open, activeIndex, listId, opts.length]);

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) openAt();
        else setActiveIndex((i) => nextEnabledIndex(opts, i, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) openAt();
        else setActiveIndex((i) => nextEnabledIndex(opts, i, -1));
        break;
      case 'Home':
        if (open) {
          e.preventDefault();
          setActiveIndex(nextEnabledIndex(opts, 0, 1));
        }
        break;
      case 'End':
        if (open) {
          e.preventDefault();
          setActiveIndex(nextEnabledIndex(opts, opts.length - 1, -1));
        }
        break;
      case 'Enter':
      case ' ':
        if (open) {
          e.preventDefault();
          commit(activeIndex);
        } else {
          e.preventDefault();
          openAt();
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          close();
        }
        break;
      case 'Tab':
        if (open) close();
        break;
      default:
        break;
    }
  };

  const sizeVars = getSizeVars(size);
  const radiusVar = getRadiusVar(radius);

  const wrapperClass = joinClasses(
    styles.wrapper,
    styles[color],
    disabled && styles.disabled,
    open && styles.open,
    className
  );

  const triggerContent = renderValue ? (
    renderValue({
      value: value || undefined,
      label: displayLabel,
      placeholder,
      open,
    })
  ) : showPlaceholder ? (
    <span className={styles.placeholder}>{placeholder ?? '请选择'}</span>
  ) : (
    <span className={styles.valueText}>{displayLabel}</span>
  );

  const listbox = (
    <div
      ref={listRef}
      id={listId}
      role="listbox"
      className={joinClasses(styles.listbox, contentClassName)}
      style={{ ['--su-radius' as string]: radiusVar } as React.CSSProperties}
    >
      {opts.length === 0 ? (
        <div className={styles.empty}>{empty ?? '暂无选项'}</div>
      ) : (
        opts.map((opt, index) => {
          const selected = opt.value === value;
          const active = index === activeIndex;
          const optId = `${listId}-opt-${index}`;
          const row = renderOption
            ? renderOption({
                option: opt,
                index,
                selected,
                active,
                disabled: !!opt.disabled,
              })
            : opt.label;

          return (
            <div
              key={`${index}-${opt.value}`}
              id={optId}
              role="option"
              aria-selected={selected}
              aria-disabled={opt.disabled || undefined}
              data-disabled={opt.disabled ? '' : undefined}
              className={joinClasses(
                styles.option,
                selected && styles.optionSelected,
                active && !opt.disabled && styles.optionActive,
                opt.disabled && styles.optionDisabled,
                itemClassName
              )}
              onMouseEnter={() => {
                if (!opt.disabled) setActiveIndex(index);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                if (!opt.disabled) commit(index);
              }}
            >
              {row}
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div
      className={wrapperClass}
      style={
        {
          ...sizeVars,
          '--su-radius': radiusVar,
          '--su-select-chevron': CHEVRON_BG,
          ...style,
        } as React.CSSProperties
      }
    >
      {name != null && (
        <input
          type="hidden"
          name={name}
          value={value}
          required={required}
          autoComplete={autoComplete}
          aria-hidden
        />
      )}
      <button
        ref={mergeRef}
        type="button"
        disabled={disabled}
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && opts.length > 0 ? `${listId}-opt-${activeIndex}` : undefined}
        aria-required={required || undefined}
        onMouseDown={(e) => {
          if (disabled) return;
          // 避免浏览器因 focus 把触发器滚进视口，进而带动整页滚动
          e.preventDefault();
        }}
        onClick={() => {
          triggerRef.current?.focus({ preventScroll: true });
          if (open) close();
          else openAt();
        }}
        onKeyDown={onTriggerKeyDown}
        {...ariaProps}
      >
        <span className={styles.triggerInner}>{triggerContent}</span>
        <span className={styles.chevron} aria-hidden />
      </button>
      {open && (portal ? createPortal(listbox, document.body) : listbox)}
    </div>
  );
});

SelectInner.displayName = 'Select';

export const Select = Object.assign(SelectInner, {
  Option: SelectOptionSlot,
}) as typeof SelectInner & { Option: typeof SelectOptionSlot };
