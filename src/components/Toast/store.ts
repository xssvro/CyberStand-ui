import type { ReactNode } from 'react';

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastRecord {
  id: string;
  type: ToastType;
  title: ReactNode;
  description?: ReactNode;
  /** 毫秒；`Infinity` 表示不自动关闭（如 loading） */
  duration?: number;
  /** 是否显示关闭按钮；仅在为 `true` 时显示 */
  dismissible?: boolean;
  createdAt: number;
}

type Listener = () => void;

let toasts: ToastRecord[] = [];
const listeners = new Set<Listener>();

function genId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToasts(): ToastRecord[] {
  return toasts;
}

function emit(): void {
  listeners.forEach((l) => {
    l();
  });
}

const MAX_TOASTS = 12;

export function addToast(t: Omit<ToastRecord, 'id' | 'createdAt'> & { id?: string }): string {
  const id = t.id ?? genId();
  const record: ToastRecord = {
    ...t,
    id,
    createdAt: Date.now(),
    duration: t.duration ?? 4000,
    dismissible: t.dismissible === true,
  };
  toasts = [...toasts, record].slice(-MAX_TOASTS);
  emit();
  return id;
}

export function removeToast(id: string): void {
  toasts = toasts.filter((x) => x.id !== id);
  emit();
}

export function clearAll(): void {
  toasts = [];
  emit();
}

export function updateToast(
  id: string,
  patch: Partial<Omit<ToastRecord, 'id' | 'createdAt'>>,
): void {
  toasts = toasts.map((x) => (x.id === id ? { ...x, ...patch } : x));
  emit();
}
