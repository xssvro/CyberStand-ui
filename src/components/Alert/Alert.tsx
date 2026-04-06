import React, { useCallback, useState } from 'react';
import styles from './Alert.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function CloseGlyph() {
  return (
    <svg
      className={styles.closeSvg}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'role'> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  /** 正文；可与 `title` 组合 */
  children?: React.ReactNode;
  /** 默认 `status`；需立即打断读屏时用 `alert` */
  role?: 'status' | 'alert';
  closable?: boolean;
  onClose?: () => void;
  /** 通栏占满父宽、去掉水平圆角 */
  banner?: boolean;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant = 'info',
    title,
    children,
    role = 'status',
    closable = false,
    onClose,
    banner = false,
    className = '',
    ...rest
  },
  ref,
) {
  const [dismissed, setDismissed] = useState(false);

  const handleClose = useCallback(() => {
    onClose?.();
    setDismissed(true);
  }, [onClose]);

  if (dismissed) {
    return null;
  }

  return (
    <div
      ref={ref}
      role={role}
      className={join(styles.root, styles[variant], banner && styles.banner, className)}
      {...rest}
    >
      <div className={styles.body}>
        {title != null && title !== '' ? <div className={styles.title}>{title}</div> : null}
        {children != null && children !== '' ? (
          <div className={styles.message}>{children}</div>
        ) : null}
      </div>
      {closable ? (
        <button type="button" className={styles.closeBtn} aria-label="关闭" onClick={handleClose}>
          <CloseGlyph />
        </button>
      ) : null}
    </div>
  );
});

Alert.displayName = 'Alert';
