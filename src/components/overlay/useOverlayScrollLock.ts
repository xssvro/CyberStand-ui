import { useEffect, useRef } from 'react';

/** 页面实际滚动容器可挂此属性，打开遮罩层时一并锁定（文档站 `.docs-main` 使用） */
export const OVERLAY_SCROLL_LOCK_SELECTOR = '[data-su-scroll-lock]';

/**
 * 打开时锁定 `html`、`body` 与可选的 `[data-su-scroll-lock]` 滚动，并补偿滚动条占位。
 */
export function useOverlayScrollLock(open: boolean): void {
  const prevHtmlOverflow = useRef<string | null>(null);
  const prevBodyOverflow = useRef<string | null>(null);
  const prevBodyPaddingRight = useRef<string | null>(null);
  const prevScrollRootOverflow = useRef<string | null>(null);
  const prevScrollRootPaddingRight = useRef<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const rootEl = document.querySelector<HTMLElement>(OVERLAY_SCROLL_LOCK_SELECTOR);

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
}
