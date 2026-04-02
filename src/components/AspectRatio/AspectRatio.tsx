import React from 'react';
import styles from './AspectRatio.module.css';

export type AspectRatioObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export interface AspectRatioProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * 宽高比：数字（如 `16/9` 的计算结果、`1`）或 CSS 字符串（如 `"16/9"`、`"4 / 3"`）。
   * @default 16/9
   */
  ratio?: number | string;
  /**
   * 子节点中的 `img` / `video` / `picture img` 的 `object-fit`（非媒体子节点不受影响）。
   * @default cover
   */
  objectFit?: AspectRatioObjectFit;
  children: React.ReactNode;
}

function ratioToCss(ratio: number | string): string {
  if (typeof ratio === 'string') return ratio.trim();
  return String(ratio);
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  function AspectRatio(
    {
      ratio = 16 / 9,
      objectFit = 'cover',
      children,
      className = '',
      style,
      ...rest
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={[styles.root, className].filter(Boolean).join(' ')}
        style={
          {
            '--su-aspect-ratio': ratioToCss(ratio),
            '--su-aspect-object-fit': objectFit,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        <div className={styles.inner}>{children}</div>
      </div>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';
