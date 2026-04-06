import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { getToasts, removeToast, subscribe } from './store';
import type { ToastRecord } from './store';
import styles from './Toast.module.css';

export type ToasterPosition =
  | 'top-right'
  | 'top-center'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left';

export interface ToasterProps {
  /** 出现位置，默认顶部水平居中、略靠上 */
  position?: ToasterPosition;
  className?: string;
}

/** 与 CSS `--toast-exit-duration` 一致：淡出 + 高度折叠后再卸载 DOM */
const EXIT_MS = 300;

function isAutoCloseDuration(d: number | undefined): d is number {
  return d !== undefined && d !== Infinity && d < 86400000;
}

function isBottomPosition(p: ToasterPosition): boolean {
  return p.startsWith('bottom');
}

function ToastItem({ toast: t, position }: { toast: ToastRecord; position: ToasterPosition }) {
  const [exiting, setExiting] = useState(false);
  const liRef = useRef<HTMLLIElement>(null);
  const removedRef = useRef(false);

  const requestDismiss = useCallback(() => {
    setExiting(true);
  }, []);

  useEffect(() => {
    if (!isAutoCloseDuration(t.duration)) return undefined;
    const timer = window.setTimeout(requestDismiss, t.duration);
    return () => window.clearTimeout(timer);
  }, [t.id, t.duration, t.createdAt, t.type, requestDismiss]);

  useEffect(() => {
    if (!exiting) return undefined;
    const finish = () => {
      if (removedRef.current) return;
      removedRef.current = true;
      removeToast(t.id);
    };
    const timer = window.setTimeout(finish, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [exiting, t.id]);

  const live = t.type === 'error' ? 'assertive' : 'polite';
  const hasDescription = t.description != null && t.description !== '';

  return (
    <li
      ref={liRef}
      className={`${styles.toast} ${exiting ? styles.toastLeaving : ''}`.trim()}
      data-type={t.type}
      data-has-description={hasDescription ? 'true' : 'false'}
      data-exit-dir={isBottomPosition(position) ? 'up' : 'down'}
      role="status"
      aria-live={live}
    >
      <span className={styles.accent} aria-hidden />
      <div className={styles.body}>
        <div className={styles.titleRow}>
          {t.type === 'loading' && <span className={styles.spinner} aria-hidden />}
          <div className={styles.title}>{t.title}</div>
        </div>
        {hasDescription && <div className={styles.description}>{t.description}</div>}
      </div>
      {t.dismissible && (
        <button
          type="button"
          className={styles.close}
          aria-label="关闭通知"
          onClick={requestDismiss}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M3 3 L11 11 M11 3 L3 11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </button>
      )}
    </li>
  );
}

const emptyToasts: ToastRecord[] = [];

export const Toaster: React.FC<ToasterProps> = ({ position = 'top-center', className = '' }) => {
  const list = useSyncExternalStore(subscribe, getToasts, () => emptyToasts);

  const node = (
    <ul
      className={`${styles.region} ${className}`.trim()}
      data-position={position}
      aria-label="通知"
    >
      {list.map((t) => (
        <ToastItem key={t.id} toast={t} position={position} />
      ))}
    </ul>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(node, document.body);
};

Toaster.displayName = 'Toaster';
