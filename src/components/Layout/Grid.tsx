import React from 'react';
import { buildGapStyle, type LayoutSpacing } from '../../core/layoutSpacing';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 列数，或任意 `grid-template-columns` 合法值 */
  columns?: number | string;
  /** 行数，或任意 `grid-template-rows` 合法值 */
  rows?: number | string;
  gap?: LayoutSpacing | number | string;
  rowGap?: LayoutSpacing | number | string;
  columnGap?: LayoutSpacing | number | string;
  alignItems?: React.CSSProperties['alignItems'];
  justifyItems?: React.CSSProperties['justifyItems'];
  alignContent?: React.CSSProperties['alignContent'];
  justifyContent?: React.CSSProperties['justifyContent'];
  autoFlow?: React.CSSProperties['gridAutoFlow'];
  /**
   * 子项最小宽度，生成 `repeat(auto-fill|auto-fit, minmax(..., 1fr))`；
   * 设置后忽略 `columns`。
   */
  minChildWidth?: string | number;
  /**
   * 与 `minChildWidth` 搭配：`fill`（默认）在空位保留轨道；`fit` 用 `auto-fit` 使列拉伸填满容器。
   */
  autoRepeat?: 'fill' | 'fit';
  /** `grid-auto-rows`，如 `minmax(0, auto)`、`minmax(120px, auto)` */
  autoRows?: React.CSSProperties['gridAutoRows'];
}

function columnsToTemplate(columns: number | string): string | undefined {
  if (typeof columns === 'number') {
    if (columns <= 0) return undefined;
    return `repeat(${columns}, minmax(0, 1fr))`;
  }
  return String(columns);
}

function rowsToTemplate(rows: number | string): string | undefined {
  if (typeof rows === 'number') {
    if (rows <= 0) return undefined;
    return `repeat(${rows}, minmax(0, 1fr))`;
  }
  return String(rows);
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(function Grid(
  {
    columns,
    rows,
    gap,
    rowGap,
    columnGap,
    alignItems,
    justifyItems,
    alignContent,
    justifyContent,
    autoFlow,
    minChildWidth,
    autoRepeat = 'fill',
    autoRows,
    className = '',
    style,
    ...rest
  },
  ref
) {
  let gridTemplateColumns: string | undefined;
  if (minChildWidth !== undefined) {
    const w = typeof minChildWidth === 'number' ? `${minChildWidth}px` : minChildWidth;
    const repeatKind = autoRepeat === 'fit' ? 'auto-fit' : 'auto-fill';
    gridTemplateColumns = `repeat(${repeatKind}, minmax(${w}, 1fr))`;
  } else if (columns !== undefined) {
    gridTemplateColumns = columnsToTemplate(columns);
  }

  const gridTemplateRows = rows !== undefined ? rowsToTemplate(rows) : undefined;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns,
        gridTemplateRows,
        alignItems,
        justifyItems,
        alignContent,
        justifyContent,
        gridAutoFlow: autoFlow,
        ...(autoRows !== undefined ? { gridAutoRows: autoRows } : {}),
        ...buildGapStyle(gap, rowGap, columnGap),
        ...style,
      }}
      {...rest}
    />
  );
});

Grid.displayName = 'Grid';
