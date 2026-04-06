import React from 'react';
import { Flex, type FlexAlign } from './Flex';
import type { LayoutSpacing } from '../../core/layoutSpacing';

export interface SpaceProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  direction?: 'horizontal' | 'vertical';
  size?: LayoutSpacing | number | string;
  wrap?: boolean;
  align?: FlexAlign;
  block?: boolean;
  split?: React.ReactNode;
  children: React.ReactNode;
}

export const Space = React.forwardRef<HTMLDivElement, SpaceProps>(function Space(
  {
    direction = 'horizontal',
    size = 'sm',
    wrap = false,
    align,
    block = false,
    split,
    children,
    className = '',
    style,
    ...rest
  },
  ref,
) {
  const flexDirection = direction === 'horizontal' ? 'row' : 'column';
  const defaultAlign: FlexAlign = direction === 'horizontal' ? 'center' : 'stretch';

  const nodes = React.Children.toArray(children);

  const content =
    split !== undefined && nodes.length > 0
      ? nodes.flatMap((child, index) => {
          if (index === 0) {
            return [<React.Fragment key={`c-${index}`}>{child}</React.Fragment>];
          }
          return [
            <React.Fragment key={`s-${index}`}>{split}</React.Fragment>,
            <React.Fragment key={`c-${index}`}>{child}</React.Fragment>,
          ];
        })
      : children;

  return (
    <Flex
      ref={ref}
      direction={flexDirection}
      wrap={wrap}
      align={align ?? defaultAlign}
      gap={size}
      className={className}
      style={{
        ...(block && direction === 'horizontal' ? { width: '100%', minWidth: 0 } : {}),
        ...style,
      }}
      {...rest}
    >
      {content}
    </Flex>
  );
});

Space.displayName = 'Space';
