import React from 'react';
import styles from './Result.module.css';

export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '403' | '404' | 'neutral';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function IconSuccess({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M18 29 L25 36 L38 22"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function IconError({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 22 L34 34 M34 22 L22 34" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
    </svg>
  );
}

function IconInfo({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M28 24 V38 M28 18 V20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
    </svg>
  );
}

function IconWarning({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      <path
        d="M28 8 L48 44 H8 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="miter"
        fill="none"
      />
      <path d="M28 34 V36 M28 22 V28" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
    </svg>
  );
}

function IconLock({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      <rect x="14" y="24" width="28" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M18 24 V18 C18 12.5 22.5 8 28 8 C33.5 8 38 12.5 38 18 V24"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="28" cy="34" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconNotFound({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity={0.65} />
      <path d="M20 36 L36 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" opacity={0.5} />
      <text
        x="28"
        y="31"
        textAnchor="middle"
        fill="currentColor"
        fontSize="11"
        fontWeight="700"
        letterSpacing="0.2em"
        fontFamily="system-ui, sans-serif"
      >
        404
      </text>
    </svg>
  );
}

function IconNeutral({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      <rect x="12" y="12" width="32" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" opacity={0.55} />
      <path d="M20 22 H36 M20 28 H32 M20 34 H28" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" opacity={0.45} />
    </svg>
  );
}

function defaultIcon(status: ResultStatus, size: number): React.ReactNode {
  switch (status) {
    case 'success':
      return <IconSuccess size={size} />;
    case 'error':
      return <IconError size={size} />;
    case 'info':
      return <IconInfo size={size} />;
    case 'warning':
      return <IconWarning size={size} />;
    case '403':
      return <IconLock size={size} />;
    case '404':
      return <IconNotFound size={size} />;
    case 'neutral':
    default:
      return <IconNeutral size={size} />;
  }
}

function statusClass(status: ResultStatus): string {
  switch (status) {
    case '403':
      return styles.status403;
    case '404':
      return styles.status404;
    default:
      return styles[status];
  }
}

export interface ResultProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  status?: ResultStatus;
  /** 覆盖状态默认图标 */
  icon?: React.ReactNode;
  iconSize?: number;
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  /** 主操作按钮组 */
  extra?: React.ReactNode;
  /** 底部补充说明 */
  children?: React.ReactNode;
}

export const Result = React.forwardRef<HTMLDivElement, ResultProps>(function Result(
  {
    status = 'neutral',
    icon,
    iconSize = 56,
    title,
    subTitle,
    extra,
    children,
    className = '',
    ...rest
  },
  ref
) {
  const titleId = React.useId();
  const iconNode = icon !== undefined ? icon : defaultIcon(status, iconSize);

  return (
    <div
      ref={ref}
      role="status"
      className={join(styles.root, statusClass(status), className)}
      aria-labelledby={titleId}
      {...rest}
    >
      <div className={styles.iconWrap}>{iconNode}</div>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {subTitle != null && subTitle !== '' ? <div className={styles.subTitle}>{subTitle}</div> : null}
      {extra != null ? <div className={styles.extra}>{extra}</div> : null}
      {children != null ? <div className={styles.footer}>{children}</div> : null}
    </div>
  );
});

Result.displayName = 'Result';
