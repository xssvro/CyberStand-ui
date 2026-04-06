import React from 'react';
import styles from './Empty.module.css';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** 无自定义 `image` 时的内联简笔画（不依赖外链） */
function DefaultIllustration() {
  return (
    <svg width="96" height="80" viewBox="0 0 96 80" fill="none" aria-hidden>
      <rect
        x="12"
        y="16"
        width="72"
        height="52"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity={0.55}
      />
      <path
        d="M32 38 L44 50 L64 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        opacity={0.35}
      />
      <path
        d="M24 12 H72"
        stroke="currentColor"
        strokeWidth="1"
        opacity={0.25}
        strokeLinecap="square"
      />
    </svg>
  );
}

export interface EmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 顶部插图或图标；不传则用内置简笔画 */
  image?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** 操作区（按钮等） */
  children?: React.ReactNode;
}

export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(function Empty(
  { image, title, description, children, className = '', ...rest },
  ref,
) {
  const headingId = React.useId();
  const labelledBy = title != null && title !== '' ? headingId : undefined;

  return (
    <div
      ref={ref}
      role="region"
      className={join(styles.root, className)}
      aria-labelledby={labelledBy}
      {...rest}
    >
      {image !== null ? (
        <div className={styles.imageWrap}>
          {image === undefined ? <DefaultIllustration /> : image}
        </div>
      ) : null}
      {title != null && title !== '' ? (
        <h3 id={headingId} className={styles.title}>
          {title}
        </h3>
      ) : null}
      {description != null && description !== '' ? (
        <div className={styles.description}>{description}</div>
      ) : null}
      {children != null ? <div className={styles.extra}>{children}</div> : null}
    </div>
  );
});

Empty.displayName = 'Empty';
