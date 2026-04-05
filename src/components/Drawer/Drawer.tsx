import React, { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getRadiusVar } from '../../core/stand';
import { useOverlayScrollLock } from '../overlay/useOverlayScrollLock';
import styles from './Drawer.module.css';

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  const list = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  return Array.from(list).filter((el) => {
    if (el.getAttribute('aria-hidden') === 'true') return false;
    const style = window.getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none') return false;
    return true;
  });
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
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
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
  radius = 'lg',
  className,
  panelClassName,
  getContainer,
  zIndex: zIndexProp,
  afterOpenChange,
}) => {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);

  const requestClose = useCallback(() => {
    onOpenChange?.(false);
    onClose?.();
  }, [onOpenChange, onClose]);

  useEffect(() => {
    afterOpenChange?.(open);
  }, [open, afterOpenChange]);

  useOverlayScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const root = panelRef.current;
    if (!root) return;

    const previousFocus = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (keyboard && e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        requestClose();
        return;
      }
      if (e.key !== 'Tab' || !root) return;

      const list = getFocusable(root);
      if (list.length === 0) {
        e.preventDefault();
        root.focus();
        return;
      }

      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!e.shiftKey) {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      } else {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    const id = window.requestAnimationFrame(() => {
      const list = getFocusable(root);
      const toFocus = list[0] ?? root;
      toFocus.focus({ preventScroll: true });
    });

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      window.cancelAnimationFrame(id);
      if (previousFocus && typeof previousFocus.focus === 'function' && document.body.contains(previousFocus)) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [open, keyboard, requestClose]);

  const container =
    typeof getContainer === 'function' ? getContainer() : getContainer ?? document.body;

  const radiusVar = getRadiusVar(radius);
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
      ? ({
          '--su-drawer-radius': radiusVar,
          '--su-drawer-width': wStr,
        } as React.CSSProperties)
      : ({
          '--su-drawer-radius': radiusVar,
          '--su-drawer-height': hStr,
        } as React.CSSProperties);

  const radiusStyle = ((): React.CSSProperties => {
    const r = radiusVar;
    switch (placement) {
      case 'right':
        return {
          borderTopLeftRadius: r,
          borderBottomLeftRadius: r,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        };
      case 'left':
        return {
          borderTopRightRadius: r,
          borderBottomRightRadius: r,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        };
      case 'top':
        return {
          borderBottomLeftRadius: r,
          borderBottomRightRadius: r,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        };
      case 'bottom':
      default:
        return {
          borderTopLeftRadius: r,
          borderTopRightRadius: r,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        };
    }
  })();

  const panelClass =
    placement === 'left'
      ? joinClasses(styles.panel, styles.panelLeft, open && styles.panelLeftOpen)
      : placement === 'top'
        ? joinClasses(styles.panel, styles.panelTop, open && styles.panelTopOpen)
        : placement === 'bottom'
          ? joinClasses(styles.panel, styles.panelBottom, open && styles.panelBottomOpen)
          : joinClasses(styles.panel, styles.panelRight, open && styles.panelRightOpen);

  if (!open) return null;

  const node = (
    <div className={joinClasses(styles.root, className)} style={zStyle}>
      <div
        className={joinClasses(styles.backdrop, !mask && styles.backdropPlain)}
        aria-hidden
        onMouseDown={(e) => {
          if (!maskClosable) return;
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
          style={{ ...panelVars, ...radiusStyle }}
          onMouseDown={(e) => e.stopPropagation()}
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
