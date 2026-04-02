import React, { createContext, forwardRef } from 'react';
import styles from './Radio.module.css';

export interface RadioGroupContextValue {
  name: string;
  value: string;
  disabled?: boolean;
  invalid?: boolean;
  onChange: (value: string) => void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  horizontal?: boolean;
  children: React.ReactNode;
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
    {
      name,
      value,
      onValueChange,
      disabled = false,
      invalid = false,
      horizontal = false,
      children,
      className = '',
      ...rest
    },
    ref
  ) {
    return (
      <RadioGroupContext.Provider value={{ name, value, disabled, invalid, onChange: onValueChange }}>
        <div
          ref={ref}
          role="radiogroup"
          className={joinClasses(styles.group, horizontal && styles.horizontal, className)}
          {...rest}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
