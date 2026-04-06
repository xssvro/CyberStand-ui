import type { ReactNode } from 'react';
import { addToast, clearAll, removeToast, updateToast } from './store';
import type { ToastType } from './store';

export interface ToastOptions {
  /** 副文案 */
  description?: ReactNode;
  /** 自动关闭毫秒；不传用默认值；`Infinity` 不自动关 */
  duration?: number;
  /** 是否显示关闭按钮，默认不显示 */
  dismissible?: boolean;
  /** 固定 id，便于 `toast.dismiss(id)` 或 `toast.promise` 更新同一条 */
  id?: string;
}

function push(type: ToastType, title: ReactNode, options?: ToastOptions): string {
  const duration =
    options?.duration ?? (type === 'error' ? 6000 : type === 'loading' ? Infinity : 4000);
  return addToast({
    type,
    title,
    description: options?.description,
    duration,
    dismissible: options?.dismissible,
    id: options?.id,
  });
}

export const toast = Object.assign(
  (title: ReactNode, options?: ToastOptions) => push('default', title, options),
  {
    success: (title: ReactNode, options?: ToastOptions) => push('success', title, options),

    error: (title: ReactNode, options?: ToastOptions) =>
      push('error', title, {
        ...options,
        duration: options?.duration ?? 6000,
      }),

    warning: (title: ReactNode, options?: ToastOptions) => push('warning', title, options),

    info: (title: ReactNode, options?: ToastOptions) => push('info', title, options),

    /** 需手动 `toast.dismiss(id)` 或配合 `toast.promise` 结束 */
    loading: (title: ReactNode, options?: ToastOptions) =>
      push('loading', title, {
        ...options,
        duration: options?.duration ?? Infinity,
      }),

    dismiss: (id?: string) => {
      if (id === undefined) clearAll();
      else removeToast(id);
    },

    promise: async <T>(
      promise: Promise<T>,
      msgs: {
        loading: ReactNode;
        success: ReactNode | ((data: T) => ReactNode);
        error: ReactNode | ((err: unknown) => ReactNode);
      },
      options?: ToastOptions,
    ): Promise<T> => {
      const id = addToast({
        type: 'loading',
        title: msgs.loading,
        duration: Infinity,
        dismissible: options?.dismissible,
        id: options?.id,
        description: options?.description,
      });
      try {
        const data = await promise;
        updateToast(id, {
          type: 'success',
          title: typeof msgs.success === 'function' ? msgs.success(data) : msgs.success,
          duration: options?.duration ?? 4000,
        });
        return data;
      } catch (err) {
        updateToast(id, {
          type: 'error',
          title: typeof msgs.error === 'function' ? msgs.error(err) : msgs.error,
          duration: options?.duration ?? 6000,
        });
        throw err;
      }
    },
  },
);
