import React, { forwardRef } from 'react';
import type { Size, StandProps } from '../../core/stand';
import { getSizeVars, getRadiusVar } from '../../core/stand';
import styles from './Input.module.css';

const INPUT_AFFIX_GAP: Record<Size, string> = {
  xs: '2px',
  sm: '3px',
  md: '5px',
  lg: '5px',
  xl: '6px',
};

const INPUT_PAD_Y: Record<Size, string> = {
  xs: '3px',
  sm: '5px',
  md: '7px',
  lg: '10px',
  xl: '12px',
};

const INPUT_PAD_X: Record<Size, string> = {
  xs: '7px',
  sm: '10px',
  md: '12px',
  lg: '16px',
  xl: '20px',
};

type InputHtmlPassthrough = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  | 'id'
  | 'aria-invalid'
  | 'aria-describedby'
  | 'aria-labelledby'
  | 'aria-label'
  | 'aria-required'
  | 'aria-controls'
  | 'aria-activedescendant'
  | 'role'
  | 'onKeyDown'
  | 'min'
  | 'max'
  | 'step'
>;

export interface InputProps extends Omit<StandProps, 'variant'>, InputHtmlPassthrough {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'datetime-local'
    | 'time'
    | 'month'
    | 'week';
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  name?: string;
  autoComplete?: string;
  pattern?: string;
}

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
    ref,
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
        style={
          {
            ...sizeVars,
            '--su-radius': radiusVar,
            '--su-input-affix-gap': INPUT_AFFIX_GAP[size],
            '--su-input-pad-y': INPUT_PAD_Y[size],
            '--su-input-pad-x': INPUT_PAD_X[size],
            ...style,
          } as React.CSSProperties
        }
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
          autoComplete={autoComplete ?? 'off'}
          pattern={pattern}
          className={styles.input}
          {...props}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
