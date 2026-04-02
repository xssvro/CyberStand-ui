import { createContext, useContext } from 'react';
import type { Size } from '../../core/stand';

/** 与 FormField `layout` 一致 */
export type FormLayout = 'vertical' | 'horizontal';

export interface FormContextValue {
  layout: FormLayout;
  size: Size;
  disabled: boolean;
}

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue | null {
  return useContext(FormContext);
}
