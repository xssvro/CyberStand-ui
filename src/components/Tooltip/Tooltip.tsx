import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PopperPlacement } from '../overlay/popperPosition';
import { usePopperPosition } from '../overlay/usePopperPosition';
import styles from './Tooltip.module.css';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export type TooltipPlacement = PopperPlacement;

export interface TooltipProps {
  title: React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  disabled?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  className?: string;
  overlayClassName?: string;
  getPopupContainer?: () => HTMLElement;
  zIndex?: number;
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
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasTitle = title != null && title !== false && title !== '';

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
    if (!hasTitle) return;
    clearHideTimer();
    clearShowTimer();
    showTimerRef.current = setTimeout(() => {
      showTimerRef.current = null;
      setMounted(true);
      setEntered(false);
      setOpen(true);
    }, mouseEnterDelay);
  }, [clearHideTimer, clearShowTimer, hasTitle, mouseEnterDelay]);

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
    if (!open || !hasTitle) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setEntered(true);
      return;
    }
    setEntered(false);
    let r2 = 0;
    const r1 = window.requestAnimationFrame(() => {
      r2 = window.requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      window.cancelAnimationFrame(r1);
      window.cancelAnimationFrame(r2);
    };
  }, [open, hasTitle]);

  useLayoutEffect(() => {
    if (open || !mounted) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setMounted(false);
      setEntered(false);
      return;
    }
    setEntered(false);
  }, [open, mounted]);

  useEffect(() => {
    if (open || !mounted || entered) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const id = window.setTimeout(() => setMounted(false), 200);
    return () => window.clearTimeout(id);
  }, [open, mounted, entered]);

  const onBubbleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      if (e.propertyName !== 'opacity') return;
      if (open) return;
      setMounted(false);
      setEntered(false);
    },
    [open],
  );

  const coords = usePopperPosition({
    triggerRef,
    floatingRef: tooltipRef,
    placement,
    enabled: !disabled && mounted && hasTitle,
  });

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

  useLayoutEffect(() => {
    if (!disabled) return;
    clearShowTimer();
    clearHideTimer();
    setOpen(false);
    setMounted(false);
    setEntered(false);
  }, [disabled, clearHideTimer, clearShowTimer]);

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

  const tooltipNode =
    mounted && hasTitle ? (
      <div
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        className={join(styles.tooltip, overlayClassName)}
        style={{ ...coords, ...zStyle }}
        data-placement={placement}
        data-entered={entered ? 'true' : 'false'}
        onTransitionEnd={onBubbleTransitionEnd}
      >
        {title}
      </div>
    ) : null;

  return (
    <>
      <span
        ref={setTriggerRef}
        className={join(styles.trigger, className)}
        aria-describedby={open && entered ? tooltipId : undefined}
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
