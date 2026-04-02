import React, { forwardRef, useContext, useId } from 'react';
import { CheckboxGroupContext } from './CheckboxGroup';
import styles from './Checkbox.module.css';

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  /** 在 CheckboxGroup 内必填，作为提交值 */
  value?: string;
  onCheckedChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: React.ReactNode;
  size?: CheckboxSize;
  color?: 'default' | 'error';
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      value: valueProp,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      disabled: disabledProp,
      label,
      size = 'md',
      color = 'default',
      className = '',
      id: idProp,
      name: nameProp,
      required,
      ...rest
    },
    ref
  ) => {
    const ctx = useContext(CheckboxGroupContext);
    const uid = useId();
    const id = idProp ?? `su-cb-${uid.replace(/:/g, '')}`;

    const inGroup = ctx != null && valueProp != null;
    const disabled = disabledProp ?? ctx?.disabled;
    const name = inGroup ? ctx.name : nameProp;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (inGroup) {
        ctx.onToggle(valueProp!, e.target.checked);
      }
      onCheckedChange?.(e.target.checked, e);
    };

    const showError = color === 'error' || ctx?.invalid;

    const checkedProps =
      inGroup
        ? { checked: ctx.value.includes(valueProp!) }
        : checkedProp !== undefined
          ? { checked: checkedProp }
          : { defaultChecked };

    return (
      <label
        className={joinClasses(
          styles.root,
          size === 'sm' && styles.sizeSm,
          disabled && styles.disabled,
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name}
          value={valueProp}
          disabled={disabled}
          required={required}
          className={joinClasses(styles.input, showError && styles.error)}
          onChange={handleChange}
          {...checkedProps}
          {...rest}
        />
        {label != null && <span className={styles.text}>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
