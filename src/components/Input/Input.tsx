import React, { forwardRef } from 'react';
import type { StandProps } from '../../core/stand';
import { getSizeVars, getRadiusVar } from '../../core/stand';
import styles from './Input.module.css';

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
