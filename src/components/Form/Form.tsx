import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import type { Size } from '../../core/stand';
import type { FormLayout } from './FormContext';
import { FormContext } from './FormContext';
import { FormRulesStoreContext } from './FormRulesContext';
import type { FormInstance } from './formStore';
import styles from './Form.module.css';

export type { FormLayout };

export interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'children'> {
  /**
   * 由 `useForm()` 创建；挂载后可用 `validateFields` / `getFieldsValue` 等（类似 Ant Design Form）。
   */
  form?: FormInstance;
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

/** 默认 `noValidate`：关闭浏览器原生校验气泡；配合 `form` + `rules` 或 `FormField` 的 `error`。传 `noValidate={false}` 可恢复原生行为。 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  {
    form,
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
  const innerRef = useRef<HTMLFormElement | null>(null);
  const setFormRef = useCallback(
    (node: HTMLFormElement | null) => {
      innerRef.current = node;
      form?.attach(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLFormElement | null>).current = node;
      }
    },
    [form, ref]
  );

  const [, rerender] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    if (!form) return;
    return form.subscribeErrors(() => rerender());
  }, [form]);

  useEffect(() => {
    form?.attach(innerRef.current);
  }, [form]);

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
      <FormRulesStoreContext.Provider value={form ?? null}>
        <form
          ref={setFormRef}
          className={joinClasses(styles.root, className)}
          noValidate={noValidate}
          {...rest}
        >
          {children}
        </form>
      </FormRulesStoreContext.Provider>
    </FormContext.Provider>
  );
});

Form.displayName = 'Form';
