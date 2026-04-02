import React, { forwardRef, useMemo } from 'react';
import type { Size } from '../../core/stand';
import type { FormLayout } from './FormContext';
import { FormContext } from './FormContext';
import styles from './Form.module.css';

export type { FormLayout };

export interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'children'> {
  /** 子级 FormField 默认布局；单字段仍可用 `layout` 覆盖 */
  layout?: FormLayout;
  /** 子级控件默认尺寸（Input / Textarea / Select / Switch 等未自设 `size` 时生效） */
  size?: Size;
  /** 整表禁用：合并到各 FormField / 控件 */
  disabled?: boolean;
  children: React.ReactNode;
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** 默认 `noValidate`：关闭浏览器原生校验气泡；必填请用 `FormField` 的 `error` 或提交前自行校验。传 `noValidate={false}` 可恢复原生行为。 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  {
    layout = 'vertical',
    size = 'md',
    disabled = false,
    children,
    className = '',
    noValidate = true,
    ...rest
  },
  ref
) {
  const value = useMemo(
    () => ({
      layout,
      size,
      disabled,
    }),
    [layout, size, disabled]
  );

  return (
    <FormContext.Provider value={value}>
      <form
        ref={ref}
        className={joinClasses(styles.root, className)}
        noValidate={noValidate}
        {...rest}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
});

Form.displayName = 'Form';
