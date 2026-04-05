import { useLayoutEffect, useState, type RefObject } from 'react';
import { computePopperPosition, type PopperPlacement } from './popperPosition';

export function usePopperPosition({
  triggerRef,
  floatingRef,
  placement,
  enabled,
}: {
  triggerRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  placement: PopperPlacement;
  enabled: boolean;
}): { top: number; left: number } {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!enabled) return;
    const t = triggerRef.current;
    const f = floatingRef.current;
    if (!t || !f) return;

    const update = () => {
      const tr = triggerRef.current?.getBoundingClientRect();
      const fr = floatingRef.current?.getBoundingClientRect();
      if (!tr || !fr) return;
      setCoords(computePopperPosition(placement, tr, fr));
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
  }, [enabled, placement, triggerRef, floatingRef]);

  return coords;
}
