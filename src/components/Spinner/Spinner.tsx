import React from 'react';
import type { Color } from '../../core/stand';
import styles from './Spinner.module.css';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'inherit';

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  size?: SpinnerSize;
  color?: Color | 'current';
  'aria-label'?: string;
}

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  {
    size = 'md',
    color = 'current',
    className = '',
    'aria-label': ariaLabel = '加载中',
    role = 'status',
    'aria-hidden': ariaHidden,
    ...rest
  },
  ref,
) {
  const colorClass = color === 'current' ? styles.current : styles[color];
  const hidden = ariaHidden === true;

  return (
    <span
      ref={ref}
      role={hidden ? undefined : role}
      aria-label={hidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      className={join(styles.root, styles[size], colorClass, className)}
      {...rest}
    />
  );
});

Spinner.displayName = 'Spinner';
