import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../overlay/focusTrap';
import { useOverlayScrollLock } from '../overlay/useOverlayScrollLock';
import styles from './Drawer.module.css';

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  closable?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  /** 从哪一侧滑入；左右用 `width`，上下用 `height` */
  placement?: DrawerPlacement;
  /** 左右抽屉宽度 */
  width?: number | string;
  /** 上下抽屉高度 */
  height?: number | string;
  className?: string;
  panelClassName?: string;
  getContainer?: HTMLElement | (() => HTMLElement);
  zIndex?: number;
  afterOpenChange?: (open: boolean) => void;
}

function resolveLinearSize(value: number | string | undefined, fallback: string): string {
  if (value === undefined) return fallback;
  if (typeof value === 'number') return `${value}px`;
  return value;
}

function CloseIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  onClose,
  title,
  children,
  footer,
  closable = true,
  mask = true,
  maskClosable = true,
  keyboard = true,
  placement = 'right',
  width,
  height,
  className,
  panelClassName,
  getContainer,
  zIndex: zIndexProp,
  afterOpenChange,
}) => {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [panelEntered, setPanelEntered] = useState(false);

  const requestClose = useCallback(() => {
    onOpenChange?.(false);
    onClose?.();
  }, [onOpenChange, onClose]);

  useEffect(() => {
    afterOpenChange?.(open);
  }, [open, afterOpenChange]);

  useOverlayScrollLock(open || mounted);

  useLayoutEffect(() => {
    if (!open) return;

    setMounted(true);

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPanelEntered(true);
      return;
    }

    setPanelEntered(false);
    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        setPanelEntered(true);
      });
    });
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (open) return;
    if (!mounted) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMounted(false);
      setPanelEntered(false);
      return;
    }

    setPanelEntered(false);
  }, [open, mounted]);

  useEffect(() => {
    if (open || !mounted) return;
    if (panelEntered) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const id = window.setTimeout(() => {
      setMounted(false);
    }, 400);
    return () => window.clearTimeout(id);
  }, [open, mounted, panelEntered]);

  const onPanelTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLElement>) => {
      if (e.target !== e.currentTarget) return;
      if (e.propertyName !== 'transform' && e.propertyName !== '-webkit-transform') return;
      if (open) return;
      setMounted(false);
    },
    [open],
  );

  useFocusTrap({
    active: open && panelEntered,
    rootRef: panelRef,
    onEscape: keyboard ? requestClose : undefined,
  });

  const container =
    typeof getContainer === 'function' ? getContainer() : getContainer ?? document.body;

  const zStyle =
    zIndexProp !== undefined ? ({ zIndex: zIndexProp } as React.CSSProperties) : undefined;

  const hasTitle = title != null && title !== false;
  const showHeader = hasTitle || closable;

  const shellClass =
    placement === 'left'
      ? styles.shellLeft
      : placement === 'top'
        ? styles.shellTop
        : placement === 'bottom'
          ? styles.shellBottom
          : styles.shellRight;

  const wStr = resolveLinearSize(width, '400px');
  const hStr = resolveLinearSize(height, 'min(40vh, 320px)');

  const panelVars =
    placement === 'left' || placement === 'right'
      ? ({ '--su-drawer-width': wStr } as React.CSSProperties)
      : ({ '--su-drawer-height': hStr } as React.CSSProperties);

  const panelClass =
    placement === 'left'
      ? joinClasses(styles.panel, styles.panelLeft, panelEntered && styles.panelLeftOpen)
      : placement === 'top'
        ? joinClasses(styles.panel, styles.panelTop, panelEntered && styles.panelTopOpen)
        : placement === 'bottom'
          ? joinClasses(styles.panel, styles.panelBottom, panelEntered && styles.panelBottomOpen)
          : joinClasses(styles.panel, styles.panelRight, panelEntered && styles.panelRightOpen);

  if (!open && !mounted) return null;

  const node = (
    <div className={joinClasses(styles.root, className)} style={zStyle}>
      <div
        className={joinClasses(styles.backdrop, !mask && styles.backdropPlain)}
        aria-hidden
        onMouseDown={(e) => {
          if (!maskClosable || !open) return;
          if (e.target === e.currentTarget) {
            requestClose();
          }
        }}
      />
      <div className={joinClasses(styles.shell, shellClass)}>
        <aside
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-label={!hasTitle ? '抽屉' : undefined}
          tabIndex={-1}
          className={joinClasses(panelClass, panelClassName)}
          style={panelVars}
          onMouseDown={(e) => e.stopPropagation()}
          onTransitionEnd={onPanelTransitionEnd}
        >
          {showHeader ? (
            <div
              className={joinClasses(styles.header, !hasTitle && closable && styles.headerCloseOnly)}
            >
              {hasTitle ? (
                typeof title === 'string' || typeof title === 'number' ? (
                  <h2 id={titleId} className={styles.title}>
                    {title}
                  </h2>
                ) : (
                  <div id={titleId} className={styles.title}>
                    {title}
                  </div>
                )
              ) : null}
              {closable ? (
                <button
                  type="button"
                  className={styles.closeBtn}
                  aria-label="关闭"
                  onClick={requestClose}
                >
                  <CloseIcon />
                </button>
              ) : null}
            </div>
          ) : null}

          {children != null && children !== false ? (
            <div className={styles.body}>{children}</div>
          ) : null}

          {footer != null && footer !== false ? <div className={styles.footer}>{footer}</div> : null}
        </aside>
      </div>
    </div>
  );

  return createPortal(node, container);
};

Drawer.displayName = 'Drawer';
