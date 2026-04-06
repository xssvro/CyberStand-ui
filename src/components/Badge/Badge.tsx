import React from 'react';
import type { Color } from '../../core/stand';
import styles from './Badge.module.css';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 数字；与 `dot` 互斥时优先 `dot` */
  count?: number;
  /** 仅圆点 */
  dot?: boolean;
  /** 超过显示为 max+ */
  max?: number;
  /** 为 0 时仍展示数字角标 */
  showZero?: boolean;
  /** 语义色 */
  color?: Color;
  /** 锚点内容（图标按钮等）；省略时仅展示角标本体 */
  children?: React.ReactNode;
}

function formatCount(count: number, max: number): string {
  if (count > max) {
    return `${max}+`;
  }
  return String(count);
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    count,
    dot = false,
    max = 99,
    showZero = false,
    color = 'error',
    children,
    className = '',
    'aria-label': ariaLabelProp,
    ...rest
  },
  ref,
) {
  const showNumber = !dot && count !== undefined && (showZero || count > 0);
  const showDot = dot;
  const showBubble = showDot || showNumber;

  const ariaLabel =
    ariaLabelProp ??
    (showDot ? '有未读' : showNumber ? `数量 ${formatCount(count!, max)}` : undefined);

  const bubble = showBubble ? (
    <span
      className={join(styles.bubble, showDot && styles.dotBubble, styles[color])}
      aria-hidden={children ? true : undefined}
    >
      {showNumber ? formatCount(count!, max) : null}
    </span>
  ) : null;

  if (children === undefined || children === null) {
    return (
      <span
        ref={ref}
        className={join(styles.standalone, className)}
        aria-label={ariaLabel}
        {...rest}
      >
        {bubble}
      </span>
    );
  }

  return (
    <span ref={ref} className={join(styles.wrap, className)} {...rest}>
      {children}
      {bubble}
      {showBubble && (
        <span className={styles.srOnly} aria-live="polite">
          {ariaLabel}
        </span>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';
