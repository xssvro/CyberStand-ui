import { useMemo } from 'react';
import { FormStore, type FormInstance } from './formStore';

export function useForm(): FormInstance {
  return useMemo(() => new FormStore(), []);
}
