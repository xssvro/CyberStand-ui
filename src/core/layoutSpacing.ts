import type { CSSProperties } from 'react';

export type LayoutSpacing =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl';

/** 与 `vars.css` 中 `--su-space-*` 对齐，供布局组件与文档引用 */
export const LAYOUT_SPACING_PX: Record<LayoutSpacing, string> = {
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
};

const SPACING_CSS: Record<LayoutSpacing, string> = {
  none: '0',
  xs: 'var(--su-space-1)',
  sm: 'var(--su-space-2)',
  md: 'var(--su-space-3)',
  lg: 'var(--su-space-4)',
  xl: 'var(--su-space-6)',
  '2xl': 'var(--su-space-8)',
};

export function resolveSpacing(
  value: LayoutSpacing | number | string | undefined,
  fallback: LayoutSpacing
): string {
  if (value === undefined) return SPACING_CSS[fallback];
  if (typeof value === 'number' && Number.isFinite(value)) return `${value}px`;
  if (typeof value === 'string' && value in SPACING_CSS) {
    return SPACING_CSS[value as LayoutSpacing];
  }
  if (typeof value === 'string') return value;
  return SPACING_CSS[fallback];
}

export function buildGapStyle(
  gap?: LayoutSpacing | number | string,
  rowGap?: LayoutSpacing | number | string,
  columnGap?: LayoutSpacing | number | string
): Pick<CSSProperties, 'gap' | 'rowGap' | 'columnGap'> {
  const out: Pick<CSSProperties, 'gap' | 'rowGap' | 'columnGap'> = {};
  if (rowGap !== undefined || columnGap !== undefined) {
    if (rowGap !== undefined) out.rowGap = resolveSpacing(rowGap, 'md');
    else if (gap !== undefined) out.rowGap = resolveSpacing(gap, 'md');
    if (columnGap !== undefined) out.columnGap = resolveSpacing(columnGap, 'md');
    else if (gap !== undefined) out.columnGap = resolveSpacing(gap, 'md');
  } else if (gap !== undefined) {
    out.gap = resolveSpacing(gap, 'md');
  }
  return out;
}
