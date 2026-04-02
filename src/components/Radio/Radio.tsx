import React, { forwardRef, useContext, useId } from 'react';
import { RadioGroupContext } from './RadioGroup';
import styles from './Radio.module.css';

export type RadioSize = 'sm' | 'md';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: React.ReactNode;
  size?: RadioSize;
  color?: 'default' | 'error';
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value: valueProp,
      checked: checkedProp,
      defaultChecked,
      onChange,
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
    const ctx = useContext(RadioGroupContext);
    const uid = useId();
    const id = idProp ?? `su-rd-${uid.replace(/:/g, '')}`;

    const inGroup = ctx != null;
    const disabled = disabledProp ?? ctx?.disabled;
    const name = inGroup ? ctx.name : nameProp;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (inGroup && e.target.checked) {
        ctx.onChange(valueProp);
      }
      onChange?.(e);
    };

    const inputProps =
      inGroup || checkedProp !== undefined
        ? { checked: inGroup ? ctx!.value === valueProp : checkedProp }
        : { defaultChecked };

    const showError = color === 'error' || ctx?.invalid;

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
          type="radio"
          id={id}
          name={name}
          value={valueProp}
          disabled={disabled}
          required={required}
          className={joinClasses(styles.input, showError && styles.error)}
          onChange={handleChange}
          {...rest}
          {...inputProps}
        />
        {label != null && <span className={styles.text}>{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
