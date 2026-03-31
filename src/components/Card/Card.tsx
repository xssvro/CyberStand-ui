import React from 'react';
import type { StandProps } from '../../core/stand';
import { getRadiusVar } from '../../core/stand';
import styles from './Card.module.css';

export interface CardProps extends Omit<StandProps, 'variant' | 'size' | 'color'> {
  /** 卡片内容 */
  children: React.ReactNode;
  /** 标题 */
  title?: React.ReactNode;
  /** 副标题 */
  subtitle?: React.ReactNode;
  /** 右上角操作 */
  extra?: React.ReactNode;
  /** 页脚 */
  footer?: React.ReactNode;
  /** 是否显示阴影 */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** 是否有边框 */
  bordered?: boolean;
  /** 是否有悬浮效果 */
  hoverable?: boolean;
  /** 点击事件 */
  onClick?: () => void;
}

/**
 * Card 卡片组件
 * 
 * 通用容器组件，用于展示内容块
 */
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
    ref
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
        style={{
          '--su-radius': radiusVar,
          ...style,
        } as React.CSSProperties}
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
  }
);

Card.displayName = 'Card';
