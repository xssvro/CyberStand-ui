import React, { forwardRef, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { Size } from '../../core/stand';
import type { FormLayout } from './FormContext';
import { FormContext } from './FormContext';
import { FormRulesStoreContext } from './FormRulesContext';
import type { FormInstance } from './formStore';
import styles from './Form.module.css';

export type { FormLayout };

export interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'children'> {
  form?: FormInstance;
  layout?: FormLayout;
  size?: Size;
  disabled?: boolean;
  children: React.ReactNode;
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

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
  ref,
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
    [form, ref],
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
    [layout, size, disabled],
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
