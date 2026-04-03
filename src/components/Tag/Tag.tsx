import React from 'react';
import type { Color } from '../../core/stand';
import styles from './Tag.module.css';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export type TagVariant = 'solid' | 'soft' | 'outlined';

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 标签文案 */
  children: React.ReactNode;
  /** 语义色 */
  color?: Color;
  /** 填充 / 柔和底 / 描边 */
  variant?: TagVariant;
  /** 是否显示关闭控制 */
  closable?: boolean;
  /** 点击关闭 */
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

function CloseGlyph() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className={styles.closeSvg}>
      <path
        d="M2 2 L8 8 M8 2 L2 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    children,
    color = 'default',
    variant = 'soft',
    closable = false,
    onClose,
    className = '',
    ...rest
  },
  ref
) {
  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose?.(e);
  };

  const handleCloseKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      onClose?.(e);
    }
  };

  return (
    <span
      ref={ref}
      className={join(styles.root, styles[variant], styles[color], closable && styles.withClose, className)}
      {...rest}
    >
      <span className={styles.label}>{children}</span>
      {closable && (
        <button
          type="button"
          className={styles.closeBtn}
          aria-label="移除标签"
          onClick={handleCloseClick}
          onKeyDown={handleCloseKeyDown}
        >
          <CloseGlyph />
        </button>
      )}
    </span>
  );
});

Tag.displayName = 'Tag';
