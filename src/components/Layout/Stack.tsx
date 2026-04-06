import React from 'react';
import { Flex, type FlexProps } from './Flex';
import type { LayoutSpacing } from '../../core/layoutSpacing';

export interface StackProps extends Omit<FlexProps, 'direction' | 'align' | 'gap'> {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  align?: FlexProps['align'];
  gap?: LayoutSpacing | number | string;
  /** 占满父级宽度（常用于表单、列表竖排） */
  fullWidth?: boolean;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(function Stack(
  { direction = 'column', align = 'stretch', gap = 'md', fullWidth, style, ...rest },
  ref,
) {
  return (
    <Flex
      ref={ref}
      direction={direction}
      align={align}
      gap={gap}
      style={{
        ...(fullWidth ? { width: '100%', minWidth: 0 } : {}),
        ...style,
      }}
      {...rest}
    />
  );
});

Stack.displayName = 'Stack';
