import { toast } from './toast';

/**
 * 与顶层 `toast` 函数等价，便于在组件内解构使用（Sonner / Chakra 系常见写法）
 */
export function useToast(): {
  toast: typeof toast;
  dismiss: typeof toast.dismiss;
} {
  return { toast, dismiss: toast.dismiss };
}
