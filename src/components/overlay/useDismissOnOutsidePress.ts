import { useEffect, useRef, type RefObject } from 'react';

/**
 * 在捕获阶段监听 pointerdown：点击不在 trigger / floating 内则 onDismiss。
 */
export function useDismissOnOutsidePress({
  enabled,
  triggerRef,
  floatingRef,
  onDismiss,
}: {
  enabled: boolean;
  triggerRef: RefObject<Element | null>;
  floatingRef: RefObject<Element | null>;
  onDismiss: () => void;
}): void {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!enabled) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || floatingRef.current?.contains(t)) return;
      onDismissRef.current();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [enabled, triggerRef, floatingRef]);
}
