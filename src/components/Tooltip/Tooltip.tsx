import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './Tooltip.module.css';

const GAP = 8;
const VIEWPORT_PAD = 8;

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** 提示内容 */
  title: React.ReactNode;
  /** 触发区域（建议单个可聚焦或可选中子节点） */
  children: React.ReactNode;
  /** 相对触发器的方位 */
  placement?: TooltipPlacement;
  /** 为 true 时不展示提示（常用于包一层禁用按钮） */
  disabled?: boolean;
  /** 鼠标进入后延迟显示（ms） */
  mouseEnterDelay?: number;
  /** 鼠标离开后延迟隐藏（ms） */
  mouseLeaveDelay?: number;
  /** 触发器外层 class */
  className?: string;
  /** 气泡 class */
  overlayClassName?: string;
  /** 挂载容器，默认 `document.body` */
  getPopupContainer?: () => HTMLElement;
  /** 覆盖 z-index（默认 `--su-z-tooltip`） */
  zIndex?: number;
}

function computePosition(
  placement: TooltipPlacement,
  trigger: DOMRect,
  tip: DOMRect,
): { top: number; left: number } {
  const cx = trigger.left + trigger.width / 2;
  const cy = trigger.top + trigger.height / 2;
  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      left = cx - tip.width / 2;
      top = trigger.top - tip.height - GAP;
      break;
    case 'bottom':
      left = cx - tip.width / 2;
      top = trigger.bottom + GAP;
      break;
    case 'left':
      left = trigger.left - tip.width - GAP;
      top = cy - tip.height / 2;
      break;
    case 'right':
      left = trigger.right + GAP;
      top = cy - tip.height / 2;
      break;
  }

  const maxL = window.innerWidth - tip.width - VIEWPORT_PAD;
  const maxT = window.innerHeight - tip.height - VIEWPORT_PAD;
  left = Math.round(Math.max(VIEWPORT_PAD, Math.min(left, maxL)));
  top = Math.round(Math.max(VIEWPORT_PAD, Math.min(top, maxT)));
  return { top, left };
}

export const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  {
    title,
    children,
    placement = 'top',
    disabled = false,
    mouseEnterDelay = 100,
    mouseLeaveDelay = 60,
    className,
    overlayClassName,
    getPopupContainer,
    zIndex: zIndexProp,
  },
  ref,
) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearShowTimer = useCallback(() => {
    if (showTimerRef.current != null) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current != null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleShow = useCallback(() => {
    clearHideTimer();
    clearShowTimer();
    showTimerRef.current = setTimeout(() => {
      showTimerRef.current = null;
      setOpen(true);
    }, mouseEnterDelay);
  }, [clearHideTimer, clearShowTimer, mouseEnterDelay]);

  const scheduleHide = useCallback(() => {
    clearShowTimer();
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      hideTimerRef.current = null;
      setOpen(false);
    }, mouseLeaveDelay);
  }, [clearHideTimer, clearShowTimer, mouseLeaveDelay]);

  const hideNow = useCallback(() => {
    clearShowTimer();
    clearHideTimer();
    setOpen(false);
  }, [clearHideTimer, clearShowTimer]);

  useLayoutEffect(() => {
    if (!open || disabled) return;
    const el = triggerRef.current;
    const tip = tooltipRef.current;
    if (!el || !tip) return;

    const update = () => {
      const t = triggerRef.current;
      const bubble = tooltipRef.current;
      if (!t || !bubble) return;
      const tr = t.getBoundingClientRect();
      const br = bubble.getBoundingClientRect();
      setCoords(computePosition(placement, tr, br));
    };

    update();
    const id = window.requestAnimationFrame(() => {
      update();
    });
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, disabled, placement, title]);

  useEffect(() => {
    if (!open || disabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        hideNow();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, disabled, hideNow]);

  useEffect(
    () => () => {
      clearShowTimer();
      clearHideTimer();
    },
    [clearHideTimer, clearShowTimer],
  );

  const setTriggerRef = useCallback(
    (node: HTMLSpanElement | null) => {
      triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
    },
    [ref],
  );

  if (disabled) {
    return (
      <span ref={setTriggerRef} className={join(styles.trigger, className)}>
        {children}
      </span>
    );
  }

  const container = getPopupContainer?.() ?? document.body;
  const zStyle =
    zIndexProp !== undefined ? ({ zIndex: zIndexProp } as React.CSSProperties) : undefined;

  const hasTitle = title != null && title !== false && title !== '';
  const tooltipNode =
    open && hasTitle ? (
      <div
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        className={join(styles.tooltip, overlayClassName)}
        style={{ ...coords, ...zStyle }}
      >
        {title}
      </div>
    ) : null;

  return (
    <>
      <span
        ref={setTriggerRef}
        className={join(styles.trigger, className)}
        aria-describedby={open ? tooltipId : undefined}
        onPointerEnter={scheduleShow}
        onPointerLeave={scheduleHide}
        onFocus={scheduleShow}
        onBlur={scheduleHide}
      >
        {children}
      </span>
      {tooltipNode ? createPortal(tooltipNode, container) : null}
    </>
  );
});

Tooltip.displayName = 'Tooltip';
