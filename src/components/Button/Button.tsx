import React from 'react';
import type { Radius, Size, StandProps } from '../../core/stand';
import { getSizeVars, getRadiusVar } from '../../core/stand';
import { Spinner } from '../Spinner';
import styles from './Button.module.css';

/** 默认 `radius="md"` 时按高度阶梯收紧圆角，避免 xs/sm 上显得过圆 */
function resolveButtonRadius(size: Size, radius: Radius): string {
  if (radius !== 'md') {
    return getRadiusVar(radius);
  }
  const bySize: Record<Size, string> = {
    xs: '3px',
    sm: '3px',
    md: '5px',
    lg: '7px',
    xl: '9px',
  };
  return bySize[size];
}

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
    ref,
  ) => {
    const sizeVars = getSizeVars(size);
    const radiusVar = resolveButtonRadius(size, radius);

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
        aria-busy={loading || undefined}
        onClick={onClick}
        style={
          {
            ...sizeVars,
            '--su-radius': radiusVar,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {loading && (
          <span className={styles.spinnerWrap} aria-hidden>
            <Spinner size="inherit" color="current" aria-hidden />
          </span>
        )}
        {!loading && leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
        <span className={styles.content}>{children}</span>
        {!loading && rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
