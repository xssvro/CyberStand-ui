import React from 'react';
import type { StandProps } from '../../core/stand';
import { getRadiusVar } from '../../core/stand';
import styles from './Card.module.css';

export interface CardProps extends Omit<StandProps, 'variant' | 'size' | 'color'> {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
  footer?: React.ReactNode;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  bordered?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      title,
      subtitle,
      extra,
      footer,
      radius = 'md',
      shadow = 'sm',
      bordered = true,
      hoverable = false,
      disabled = false,
      className = '',
      style,
      onClick,
      ...props
    },
    ref,
  ) => {
    const radiusVar = getRadiusVar(radius);

    const classes = [
      styles.card,
      styles[`shadow-${shadow}`],
      bordered && styles.bordered,
      hoverable && styles.hoverable,
      disabled && styles.disabled,
      onClick && styles.clickable,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const hasHeader = title || subtitle || extra;

    return (
      <div
        ref={ref}
        className={classes}
        style={
          {
            '--su-radius': radiusVar,
            ...style,
          } as React.CSSProperties
        }
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {hasHeader && (
          <div className={styles.header}>
            <div className={styles.headerMain}>
              {title && <div className={styles.title}>{title}</div>}
              {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
            </div>
            {extra && <div className={styles.extra}>{extra}</div>}
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    );
  },
);

Card.displayName = 'Card';
