import React, { forwardRef, useCallback, useId, useState } from 'react';
import styles from './Switch.module.css';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'type' | 'role' | 'aria-checked' | 'children' | 'onChange' | 'defaultChecked'
  > {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (
    checked: boolean,
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>
  ) => void;
  /** 为 true 时不可切换，仍可获得焦点（与 disabled 视觉可区分：不整体降透明） */
  readOnly?: boolean;
  size?: SwitchSize;
  color?: 'default' | 'error';
  /** 开关右侧文案（与 FormField 外层标签二选一即可） */
  label?: React.ReactNode;
  /** 原生表单：提交时随开关状态带上 `name` */
  name?: string;
  /** `name` 存在且为开时，隐藏域取值，默认 `on` */
  value?: string;
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    readOnly = false,
    size = 'md',
    color = 'default',
    label,
    name,
    value = 'on',
    className = '',
    id: idProp,
    onClick,
    onKeyDown,
    ...rest
  },
  ref
) {
  const uid = useId();
  const autoId = `su-sw-${uid.replace(/:/g, '')}`;
  const id = idProp ?? autoId;

  const isControlled = checkedProp !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const checked = isControlled ? checkedProp : internal;

  const toggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled || readOnly) return;
      const next = !checked;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next, e);
    },
    [checked, disabled, readOnly, isControlled, onCheckedChange]
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    toggle(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle(e);
    }
  };

  const showError = color === 'error';

  return (
    <div className={joinClasses(styles.root, disabled && styles.disabled, className)}>
      {name != null && (
        <input type="hidden" name={name} value={checked ? value : ''} readOnly aria-hidden />
      )}
      <button
        ref={ref}
        type="button"
        role="switch"
        id={id}
        className={joinClasses(styles.track, size === 'sm' ? styles.sizeSm : styles.sizeMd)}
        aria-checked={checked}
        aria-readonly={readOnly || undefined}
        disabled={disabled}
        data-checked={checked ? 'true' : 'false'}
        data-error={showError ? 'true' : 'false'}
        {...rest}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.thumb} aria-hidden />
      </button>
      {label != null && <span className={styles.text}>{label}</span>}
    </div>
  );
});

Switch.displayName = 'Switch';
