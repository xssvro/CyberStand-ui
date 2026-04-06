import React from 'react';
import { buildGapStyle, type LayoutSpacing } from '../../core/layoutSpacing';

export type FlexAlign = 'start' | 'end' | 'center' | 'stretch' | 'baseline';
export type FlexJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

const ALIGN: Record<FlexAlign, React.CSSProperties['alignItems']> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch',
  baseline: 'baseline',
};

const JUSTIFY: Record<FlexJustify, React.CSSProperties['justifyContent']> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

function wrapToCss(
  w: boolean | 'nowrap' | 'wrap' | 'wrap-reverse' | undefined,
): React.CSSProperties['flexWrap'] {
  if (w === true || w === 'wrap') return 'wrap';
  if (w === 'wrap-reverse') return 'wrap-reverse';
  return 'nowrap';
}

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  wrap?: boolean | 'nowrap' | 'wrap' | 'wrap-reverse';
  align?: FlexAlign;
  justify?: FlexJustify;
  /** 多行时主轴堆叠（`wrap` 为换行时常用） */
  alignContent?: React.CSSProperties['alignContent'];
  gap?: LayoutSpacing | number | string;
  rowGap?: LayoutSpacing | number | string;
  columnGap?: LayoutSpacing | number | string;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(function Flex(
  {
    inline = false,
    direction = 'row',
    wrap = false,
    align = 'stretch',
    justify = 'start',
    alignContent,
    gap,
    rowGap,
    columnGap,
    className = '',
    style,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: inline ? 'inline-flex' : 'flex',
        flexDirection: direction,
        flexWrap: wrapToCss(wrap),
        alignItems: ALIGN[align],
        justifyContent: JUSTIFY[justify],
        ...(alignContent !== undefined ? { alignContent } : {}),
        ...buildGapStyle(gap, rowGap, columnGap),
        ...style,
      }}
      {...rest}
    />
  );
});

Flex.displayName = 'Flex';
