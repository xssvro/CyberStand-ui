import React from 'react';
import type { StandProps } from '../../core/stand';
import { getSizeVars, getRadiusVar } from '../../core/stand';
import styles from './Button.module.css';

export interface ButtonProps extends StandProps {
  /** 按钮内容 */
  children: React.ReactNode;
  /** 点击事件 */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset';
  /** 是否块级显示 */
  block?: boolean;
  /** 图标（左侧） */
  leftIcon?: React.ReactNode;
  /** 图标（右侧） */
  rightIcon?: React.ReactNode;
}

/**
 * Button 按钮组件
 * 
 * 用于触发操作或事件的基础组件
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      size = 'md',
      color = 'primary',
      variant = 'solid',
      radius = 'md',
      disabled = false,
      loading = false,
      block = false,
      leftIcon,
      rightIcon,
      className = '',
      style,
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const sizeVars = getSizeVars(size);
    const radiusVar = getRadiusVar(radius);
    
    const classes = [
      styles.button,
      styles[variant],
      styles[color],
      block && styles.block,
      loading && styles.loading,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        onClick={onClick}
        style={{
          ...sizeVars,
          '--su-radius': radiusVar,
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        {loading && <span className={styles.spinner} />}
        {!loading && leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
        <span className={styles.content}>{children}</span>
        {!loading && rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
