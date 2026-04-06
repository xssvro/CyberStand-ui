import { toast } from './toast';

export function useToast(): {
  toast: typeof toast;
  dismiss: typeof toast.dismiss;
} {
  return { toast, dismiss: toast.dismiss };
}
