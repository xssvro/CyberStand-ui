import React, { forwardRef } from 'react';
import type { Size, StandProps } from '../../core/stand';
import { getSizeVars, getRadiusVar } from '../../core/stand';
import styles from './Input.module.css';

/** 前缀与输入文字之间间距（略大于贴边，避免图标与占位挤在一起） */
const INPUT_AFFIX_GAP: Record<Size, string> = {
  xs: '3px',
  sm: '4px',
  md: '6px',
  lg: '6px',
  xl: '8px',
};

/** 与 getSizeVars 一致：纵向 / 横向 padding 变量 */
const INPUT_PAD_Y: Record<Size, string> = {
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
};

const INPUT_PAD_X: Record<Size, string> = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '20px',
  xl: '24px',
};

export interface InputProps extends Omit<StandProps, 'variant'> {
  /** 输入框值 */
  value?: string;
  /** 默认值 */
  defaultValue?: string;
  /** 占位符 */
  placeholder?: string;
  /** 值变化回调 */
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 输入类型 */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
  /** 前置内容 */
  prefix?: React.ReactNode;
  /** 后置内容 */
  suffix?: React.ReactNode;
  /** 是否只读 */
  readOnly?: boolean;
  /** 是否必填 */
  required?: boolean;
  /** 自动聚焦 */
  autoFocus?: boolean;
  /** 最大长度 */
  maxLength?: number;
  /** 最小长度 */
  minLength?: number;
  /** 名称 */
  name?: string;
  /** 自动完成 */
  autoComplete?: string;
  /** 输入模式 */
  pattern?: string;
}

/**
 * Input 输入框组件
 * 
 * 基础文本输入组件，支持多种类型和前后置内容
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      defaultValue,
      placeholder,
      onChange,
      type = 'text',
      size = 'md',
      color = 'default',
      radius = 'md',
      disabled = false,
      readOnly = false,
      required = false,
      autoFocus = false,
      prefix,
      suffix,
      maxLength,
      minLength,
      name,
      autoComplete,
      pattern,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const sizeVars = getSizeVars(size);
    const radiusVar = getRadiusVar(radius);

    const classes = [
      styles.inputWrapper,
      styles[color],
      disabled && styles.disabled,
      readOnly && styles.readOnly,
      prefix && styles.hasPrefix,
      prefix && suffix && styles.hasSuffix,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value, e);
    };

    return (
      <div
        className={classes}
        style={{
          ...sizeVars,
          '--su-radius': radiusVar,
          '--su-input-affix-gap': INPUT_AFFIX_GAP[size],
          '--su-input-pad-y': INPUT_PAD_Y[size],
          '--su-input-pad-x': INPUT_PAD_X[size],
          ...style,
        } as React.CSSProperties}
      >
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          ref={ref}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          name={name}
          autoComplete={autoComplete}
          pattern={pattern}
          className={styles.input}
          {...props}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
