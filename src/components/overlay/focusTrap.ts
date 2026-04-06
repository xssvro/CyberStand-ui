import { useEffect, type RefObject } from 'react';

export const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function getFocusable(container: HTMLElement): HTMLElement[] {
  const list = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  return Array.from(list).filter((el) => {
    if (el.getAttribute('aria-hidden') === 'true') return false;
    const style = window.getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none') return false;
    return true;
  });
}

export interface UseFocusTrapOptions {
  /** 为 true 时监听 Tab 循环与可选 Escape */
  active: boolean;
  rootRef: RefObject<HTMLElement | null>;
  /** 传入时在 Escape 上 preventDefault/stopPropagation 并调用 */
  onEscape?: () => void;
}

/**
 * 焦点陷阱：Tab 在 root 内循环；可选 Escape 关闭。
 * 激活时在下一帧将焦点移入第一个可聚焦节点（或 root 自身）。
 */
export function useFocusTrap({ active, rootRef, onEscape }: UseFocusTrapOptions): void {
  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    if (!root) return;

    const previousFocus = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (onEscape && e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onEscape();
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
      const activeEl = document.activeElement as HTMLElement | null;

      if (!e.shiftKey) {
        if (activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      } else {
        if (activeEl === first) {
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
      if (
        previousFocus &&
        typeof previousFocus.focus === 'function' &&
        document.body.contains(previousFocus)
      ) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [active, rootRef, onEscape]);
}
