import { createContext, useContext } from 'react';
import type { FormInstance } from './formStore';

export const FormRulesStoreContext = createContext<FormInstance | null>(null);

export function useFormRulesStore(): FormInstance | null {
  return useContext(FormRulesStoreContext);
}
