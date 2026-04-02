import React, { forwardRef } from 'react';
import type { Size, StandProps } from '../../core/stand';
import { getSizeVars, getRadiusVar } from '../../core/stand';
import styles from './Textarea.module.css';

const TEXTAREA_MIN_HEIGHT: Record<Size, string> = {
  xs: '56px',
  sm: '72px',
  md: '88px',
  lg: '104px',
  xl: '120px',
};

type TextareaHtmlPassthrough = Pick<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  | 'id'
  | 'aria-invalid'
  | 'aria-describedby'
  | 'aria-labelledby'
  | 'aria-label'
  | 'aria-required'
  | 'role'
>;

export interface TextareaProps extends Omit<StandProps, 'variant'>, TextareaHtmlPassthrough {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  name?: string;
  /** 未传时为 `off` */
  autoComplete?: string;
  /** vertical | none | both */
  resize?: 'vertical' | 'none' | 'both';
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      value,
      defaultValue,
      placeholder,
      onChange,
      rows = 4,
      size = 'md',
      color = 'default',
      radius = 'md',
      disabled = false,
      readOnly = false,
      required = false,
      autoFocus = false,
      maxLength,
      minLength,
      name,
      autoComplete,
      resize = 'vertical',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const sizeVars = getSizeVars(size);
    const radiusVar = getRadiusVar(radius);

    const classes = joinClasses(
      styles.wrapper,
      styles[color],
      disabled && styles.disabled,
      readOnly && styles.readOnly,
      className
    );

    const resizeClass =
      resize === 'none' ? styles.resizeNone : resize === 'both' ? styles.resizeBoth : '';

    return (
      <div
        className={classes}
        style={
          {
            ...sizeVars,
            '--su-radius': radiusVar,
            '--su-textarea-min-height': TEXTAREA_MIN_HEIGHT[size],
            ...style,
          } as React.CSSProperties
        }
      >
        <textarea
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={rows}
          onChange={(e) => onChange?.(e.target.value, e)}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          name={name}
          autoComplete={autoComplete ?? 'off'}
          className={joinClasses(styles.textarea, resizeClass)}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

