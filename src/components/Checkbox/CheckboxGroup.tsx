import React, { createContext, forwardRef } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxGroupContextValue {
  name: string;
  value: string[];
  disabled?: boolean;
  /** FormField 等注入：子 Checkbox 错误描边 */
  invalid?: boolean;
  onToggle: (value: string, checked: boolean) => void;
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 表单 name，提交用 */
  name: string;
  value: string[];
  onValueChange: (next: string[]) => void;
  disabled?: boolean;
  invalid?: boolean;
  /** 子项横向排列 */
  horizontal?: boolean;
  children: React.ReactNode;
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup(
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
    const onToggle = (v: string, checked: boolean) => {
      if (checked) {
        if (!value.includes(v)) onValueChange([...value, v]);
      } else {
        onValueChange(value.filter((x) => x !== v));
      }
    };

    return (
      <CheckboxGroupContext.Provider value={{ name, value, disabled, invalid, onToggle }}>
        <div
          ref={ref}
          role="group"
          className={joinClasses(styles.group, horizontal && styles.horizontal, className)}
          {...rest}
        >
          {children}
        </div>
      </CheckboxGroupContext.Provider>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';
