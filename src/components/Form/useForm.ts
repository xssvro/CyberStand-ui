import { useMemo } from 'react';
import { FormStore, type FormInstance } from './formStore';

/**
 * 创建与 `<Form form={form}>` 配套的实例；用法接近 Ant Design `Form.useForm()`。
 */
export function useForm(): FormInstance {
  return useMemo(() => new FormStore(), []);
}
