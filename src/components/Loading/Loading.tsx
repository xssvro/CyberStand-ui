import React from 'react';
import { Spinner } from '../Spinner';
import styles from './Loading.module.css';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface LoadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 是否展示加载态 */
  spinning?: boolean;
  /** 遮罩内说明文案 */
  tip?: React.ReactNode;
  /** 全屏固定遮罩（`z-index` 使用 `--su-z-loading`，低于 Toast） */
  fullscreen?: boolean;
  /** 被包裹区域；有子节点时在子树上方盖遮罩 */
  children?: React.ReactNode;
}

export const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(function Loading(
  { spinning = true, tip, fullscreen = false, children, className = '', ...rest },
  ref,
) {
  const overlay = spinning ? (
    <div
      className={join(styles.overlay, fullscreen && styles.fullscreen)}
      aria-live="polite"
      aria-busy
    >
      <div className={styles.inner}>
        <Spinner size="md" color="primary" className={styles.spin} />
        {tip != null && <div className={styles.tip}>{tip}</div>}
      </div>
    </div>
  ) : null;

  if (children === undefined || children === null) {
    return (
      <div
        ref={ref}
        className={join(
          styles.root,
          fullscreen && styles.fullscreenRoot,
          spinning && styles.solo,
          className,
        )}
        {...rest}
      >
        {overlay}
      </div>
    );
  }

  return (
    <div ref={ref} className={join(styles.root, styles.withContent, className)} {...rest}>
      {children}
      {overlay}
    </div>
  );
});

Loading.displayName = 'Loading';
