import React, { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getRadiusVar } from '../../core/stand';
import styles from './Modal.module.css';

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

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIZE_MAX_WIDTH: Record<ModalSize, string> = {
  sm: '400px',
  md: '520px',
  lg: '720px',
  xl: '900px',
  full: 'min(100vw - 32px, 1200px)',
};

export interface ModalProps {
  /** 是否展示 */
  open: boolean;
  /** 打开状态变化（与 `open` 受控配合） */
  onOpenChange?: (open: boolean) => void;
  /** 用户触发关闭时回调（遮罩、关闭钮、Esc）；等价于 `onOpenChange(false)` 时常用 */
  onClose?: () => void;
  /** 标题；有则挂 `aria-labelledby` */
  title?: React.ReactNode;
  /** 主体内容 */
  children?: React.ReactNode;
  /** 底部操作区 */
  footer?: React.ReactNode;
  /** 是否展示右上角关闭按钮 */
  closable?: boolean;
  /** 是否显示半透明遮罩与模糊；`false` 时仅保留透明全屏层（可配合 `maskClosable` 点空白关闭） */
  mask?: boolean;
  /** 点击遮罩（或 `mask={false}` 时的透明层）是否关闭 */
  maskClosable?: boolean;
  /** Esc 是否关闭 */
  keyboard?: boolean;
  /** 是否垂直居中；`false` 时靠上留白 */
  centered?: boolean;
  /** 预设最大宽度 */
  size?: ModalSize;
  /** 覆盖最大宽度（如 `480px`、`80%`） */
  width?: number | string;
  /** 对话框圆角 token */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** 根节点 class（含遮罩与内容外层） */
  className?: string;
  /** 白底面板 class */
  bodyClassName?: string;
  /** 挂载节点，默认 `document.body` */
  getContainer?: HTMLElement | (() => HTMLElement);
  /** 覆盖 z-index（默认 `--su-z-modal`） */
  zIndex?: number;
  /** 打开/关闭过渡结束后通知（当前为同步切换 DOM，与打开状态一致时调用） */
  afterOpenChange?: (open: boolean) => void;
}

function resolveWidth(width: number | string | undefined, size: ModalSize): string {
  if (width === undefined) return SIZE_MAX_WIDTH[size];
  if (typeof width === 'number') return `${width}px`;
  return width;
}

/** 页面实际滚动容器可挂此属性，打开 Modal 时一并锁定（文档站 `.docs-main` 使用） */
export const MODAL_SCROLL_LOCK_SELECTOR = '[data-su-scroll-lock]';

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

export const Modal: React.FC<ModalProps> = ({
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
  centered = true,
  size = 'md',
  width,
  radius = 'lg',
  className = '',
  bodyClassName = '',
  getContainer,
  zIndex: zIndexProp,
  afterOpenChange,
}) => {
  const titleId = useId().replace(/:/g, '');
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevHtmlOverflow = useRef<string | null>(null);
  const prevBodyOverflow = useRef<string | null>(null);
  const prevBodyPaddingRight = useRef<string | null>(null);
  const prevScrollRootOverflow = useRef<string | null>(null);
  const prevScrollRootPaddingRight = useRef<string | null>(null);

  const requestClose = useCallback(() => {
    onOpenChange?.(false);
    onClose?.();
  }, [onOpenChange, onClose]);

  useEffect(() => {
    afterOpenChange?.(open);
  }, [open, afterOpenChange]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const rootEl = document.querySelector<HTMLElement>(MODAL_SCROLL_LOCK_SELECTOR);

    prevHtmlOverflow.current = html.style.overflow;
    prevBodyOverflow.current = body.style.overflow;
    prevBodyPaddingRight.current = body.style.paddingRight;
    if (rootEl) {
      prevScrollRootOverflow.current = rootEl.style.overflow;
      prevScrollRootPaddingRight.current = rootEl.style.paddingRight;
    } else {
      prevScrollRootOverflow.current = null;
      prevScrollRootPaddingRight.current = null;
    }

    const winGutter = window.innerWidth - document.documentElement.clientWidth;
    const computedBodyPr = parseFloat(getComputedStyle(body).paddingRight) || 0;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    if (rootEl) {
      const rootGutter = rootEl.offsetWidth - rootEl.clientWidth;
      const computedRootPr = parseFloat(getComputedStyle(rootEl).paddingRight) || 0;
      rootEl.style.overflow = 'hidden';
      if (rootGutter > 0) {
        rootEl.style.paddingRight = `${computedRootPr + rootGutter}px`;
      }
    }

    if (winGutter > 0) {
      body.style.paddingRight = `${computedBodyPr + winGutter}px`;
    }

    return () => {
      html.style.overflow = prevHtmlOverflow.current ?? '';
      body.style.overflow = prevBodyOverflow.current ?? '';
      body.style.paddingRight = prevBodyPaddingRight.current ?? '';
      if (rootEl) {
        rootEl.style.overflow = prevScrollRootOverflow.current ?? '';
        rootEl.style.paddingRight = prevScrollRootPaddingRight.current ?? '';
      }
      prevHtmlOverflow.current = null;
      prevBodyOverflow.current = null;
      prevBodyPaddingRight.current = null;
      prevScrollRootOverflow.current = null;
      prevScrollRootPaddingRight.current = null;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = dialogRef.current;
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

  const maxW = resolveWidth(width, size);
  const radiusVar = getRadiusVar(radius);
  const zStyle =
    zIndexProp !== undefined
      ? ({ zIndex: zIndexProp } as React.CSSProperties)
      : undefined;

  const hasTitle = title != null && title !== false;
  const showHeader = hasTitle || closable;

  if (!open) return null;

  const node = (
    <div
      className={joinClasses(styles.root, !centered && styles.rootAlignTop, className)}
      style={zStyle}
    >
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
      <div className={styles.center}>
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-label={!hasTitle ? '对话框' : undefined}
          tabIndex={-1}
          className={joinClasses(styles.dialog, bodyClassName)}
          style={
            {
              '--su-modal-max-width': maxW,
              '--su-radius': radiusVar,
            } as React.CSSProperties
          }
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
        </div>
      </div>
    </div>
  );

  return createPortal(node, container);
};

Modal.displayName = 'Modal';
