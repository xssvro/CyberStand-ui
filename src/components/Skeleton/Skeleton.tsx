import React from 'react';
import styles from './Skeleton.module.css';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  variant?: SkeletonVariant;
  /** `variant="text"` 时渲染多行，末行略短 */
  rows?: number;
  width?: number | string;
  height?: number | string;
  /** 为 false 时无扫光动画 */
  active?: boolean;
  /** `variant="rect"` 时略加大圆角 */
  rounded?: boolean;
}

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function sizePx(n: number | string | undefined): string | undefined {
  if (n === undefined) return undefined;
  return typeof n === 'number' ? `${n}px` : n;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  {
    variant = 'text',
    rows = 1,
    width: widthProp,
    height: heightProp,
    active = true,
    rounded = false,
    className = '',
    style,
    ...rest
  },
  ref,
) {
  const defaultAvatar = 40;

  if (variant === 'text' && rows > 1) {
    return (
      <div ref={ref} className={join(styles.paragraph, className)} style={style} {...rest}>
        {Array.from({ length: rows }, (_, i) => {
          const isLast = i === rows - 1;
          return (
            <span
              key={i}
              className={join(styles.block, styles.text, active && styles.active)}
              style={{
                width: isLast ? '68%' : '100%',
                height: sizePx(heightProp),
              }}
            />
          );
        })}
      </div>
    );
  }

  let width: number | string | undefined = widthProp;
  let height: number | string | undefined = heightProp;

  if (variant === 'circle') {
    const side = widthProp ?? heightProp ?? defaultAvatar;
    width = widthProp ?? side;
    height = heightProp ?? side;
  } else if (variant === 'rect') {
    width = widthProp ?? '100%';
    height = heightProp ?? 72;
  } else {
    width = widthProp ?? '100%';
  }

  return (
    <div
      ref={ref}
      className={join(
        styles.block,
        variant === 'text' && styles.text,
        variant === 'circle' && styles.circle,
        variant === 'rect' && styles.rect,
        variant === 'rect' && rounded && styles.rectRounded,
        active && styles.active,
        className,
      )}
      style={{
        width: sizePx(width),
        height: sizePx(height),
        ...style,
      }}
      {...rest}
    />
  );
});

Skeleton.displayName = 'Skeleton';
