export type PopperPlacement = 'top' | 'bottom' | 'left' | 'right';

const DEFAULT_GAP = 8;
const DEFAULT_VIEWPORT_PAD = 8;

/**
 * 视口 `fixed` 定位：锚点矩形 + 浮层矩形 + placement，返回 top/left（已夹紧视口）。
 */
export function computePopperPosition(
  placement: PopperPlacement,
  trigger: DOMRect,
  floating: DOMRect,
  gap = DEFAULT_GAP,
  viewportPad = DEFAULT_VIEWPORT_PAD,
): { top: number; left: number } {
  const cx = trigger.left + trigger.width / 2;
  const cy = trigger.top + trigger.height / 2;
  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      left = cx - floating.width / 2;
      top = trigger.top - floating.height - gap;
      break;
    case 'bottom':
      left = cx - floating.width / 2;
      top = trigger.bottom + gap;
      break;
    case 'left':
      left = trigger.left - floating.width - gap;
      top = cy - floating.height / 2;
      break;
    case 'right':
      left = trigger.right + gap;
      top = cy - floating.height / 2;
      break;
    default:
      break;
  }

  const maxL = window.innerWidth - floating.width - viewportPad;
  const maxT = window.innerHeight - floating.height - viewportPad;
  left = Math.round(Math.max(viewportPad, Math.min(left, maxL)));
  top = Math.round(Math.max(viewportPad, Math.min(top, maxT)));
  return { top, left };
}
