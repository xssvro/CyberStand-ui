export type PanelPlacement = 'bottom-start' | 'top-start' | 'auto';

export type ApplyPanelPositionOptions = {
  /**
   * `true`（默认）：宽度 = max(触发器宽, minWidthPx)。
   * `false`：不拉满触发器，按内容收缩，仅保证 min-width（适合窄时间列）。
   */
  matchTriggerWidth?: boolean;
  /** 仅 `matchTriggerWidth: false` 时写入 `max-width`，默认 `min(calc(100vw - 16px), 320px)` */
  maxWidth?: string;
};

export function applyPanelPosition(
  panelEl: HTMLElement,
  triggerEl: HTMLElement,
  placement: PanelPlacement,
  minWidthPx = 288,
  options?: ApplyPanelPositionOptions,
): void {
  const matchTriggerWidth = options?.matchTriggerWidth ?? true;
  const maxWidthWhenShrink = options?.maxWidth ?? 'min(calc(100vw - 16px), 320px)';
  const rect = triggerEl.getBoundingClientRect();
  const gap = 6;
  const margin = 8;
  const panelH = panelEl.offsetHeight || 320;
  const below = window.innerHeight - rect.bottom - margin;
  const above = rect.top - margin;
  let openUp =
    placement === 'top-start' || (placement === 'auto' && below < panelH && above > below);
  if (placement === 'bottom-start') openUp = false;

  const zRaw = getComputedStyle(document.documentElement)
    .getPropertyValue('--su-z-dropdown')
    .trim();
  const zIndex = zRaw || '1000';

  panelEl.style.setProperty('position', 'fixed');
  panelEl.style.setProperty('left', `${rect.left}px`);
  panelEl.style.setProperty('z-index', zIndex);

  if (matchTriggerWidth) {
    const width = Math.max(rect.width, minWidthPx);
    panelEl.style.setProperty('width', `${width}px`);
  } else {
    panelEl.style.removeProperty('width');
    panelEl.style.setProperty('min-width', `${minWidthPx}px`);
    panelEl.style.setProperty('max-width', maxWidthWhenShrink);
    panelEl.style.setProperty('width', 'max-content');
  }

  if (openUp) {
    panelEl.style.setProperty('top', 'auto');
    panelEl.style.setProperty('bottom', `${window.innerHeight - rect.top + gap}px`);
  } else {
    panelEl.style.setProperty('bottom', 'auto');
    panelEl.style.setProperty('top', `${rect.bottom + gap}px`);
  }
}
