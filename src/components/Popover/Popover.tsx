import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../overlay/focusTrap';
import type { PopperPlacement } from '../overlay/popperPosition';
import { useDismissOnOutsidePress } from '../overlay/useDismissOnOutsidePress';
import { usePopperPosition } from '../overlay/usePopperPosition';
import styles from './Popover.module.css';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export type { PopperPlacement };

export interface PopoverProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 浮层内容（可交互） */
  content: React.ReactNode;
  /** 触发区域，点击切换开关 */
  children: React.ReactNode;
  placement?: PopperPlacement;
  /** Esc 关闭 */
  keyboard?: boolean;
  className?: string;
  panelClassName?: string;
  getPopupContainer?: () => HTMLElement;
  zIndex?: number;
}

export const Popover: React.FC<PopoverProps> = ({
  open,
  onOpenChange,
  content,
  children,
  placement = 'bottom',
  keyboard = true,
  className,
  panelClassName,
  getPopupContainer,
  zIndex: zIndexProp,
}) => {
  const contentId = useId().replace(/:/g, '');
  const triggerRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  const close = useCallback(() => onOpenChange?.(false), [onOpenChange]);

  const toggle = useCallback(() => {
    onOpenChange?.(!open);
  }, [onOpenChange, open]);

  useLayoutEffect(() => {
    if (!open) return;

    setMounted(true);

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
  }, [open]);

  useLayoutEffect(() => {
    if (open) return;
    if (!mounted) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMounted(false);
      setEntered(false);
      return;
    }

    setEntered(false);
  }, [open, mounted]);

  useEffect(() => {
    if (open || !mounted) return;
    if (entered) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const id = window.setTimeout(() => setMounted(false), 220);
    return () => window.clearTimeout(id);
  }, [open, mounted, entered]);

  const onPanelTransitionEnd = useCallback(
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
    floatingRef: panelRef,
    placement,
    enabled: mounted,
  });

  useDismissOnOutsidePress({
    enabled: open && mounted,
    triggerRef,
    floatingRef: panelRef,
    onDismiss: close,
  });

  useFocusTrap({
    active: mounted && entered,
    rootRef: panelRef,
    onEscape: keyboard ? close : undefined,
  });

  const container = getPopupContainer?.() ?? document.body;
  const zStyle =
    zIndexProp !== undefined ? ({ zIndex: zIndexProp } as React.CSSProperties) : undefined;

  const showPanel = mounted && content != null && content !== false;

  const panelNode = showPanel ? (
    <div
      ref={panelRef}
      id={contentId}
      role="dialog"
      aria-modal={false}
      className={join(styles.panel, entered && styles.panelEnter, panelClassName)}
      style={{ ...coords, ...zStyle }}
      onMouseDown={(e) => e.stopPropagation()}
      onTransitionEnd={onPanelTransitionEnd}
    >
      {content}
    </div>
  ) : null;

  return (
    <>
      <span
        ref={triggerRef}
        className={join(styles.trigger, className)}
        aria-expanded={open}
        aria-controls={mounted ? contentId : undefined}
        aria-haspopup="dialog"
        onClick={toggle}
      >
        {children}
      </span>
      {panelNode ? createPortal(panelNode, container) : null}
    </>
  );
};

Popover.displayName = 'Popover';
