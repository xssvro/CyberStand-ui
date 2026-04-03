import { createContext, useContext } from 'react';
import type { FormStore } from './formStore';

export const FormRulesStoreContext = createContext<FormStore | null>(null);

export function useFormRulesStore(): FormStore | null {
  return useContext(FormRulesStoreContext);
}
