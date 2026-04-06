import React, { useEffect, useMemo, useState } from 'react';
import type { Color } from '../../core/stand';
import styles from './Avatar.module.css';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type AvatarShape = 'circle' | 'rounded';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 头像图片地址；失败或无则展示占位 */
  src?: string;
  /** 图片 `alt`；无图时参与 `aria-label`（与文字缩写组合可读名） */
  alt?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  /** 占位背景语义色（无图或加载失败时） */
  color?: Color;
  /** 文字缩写或自定义节点；纯字符串会生成大写缩写（拉丁约 2 字、中文可取前 2 字） */
  children?: React.ReactNode;
  /** 无文字子节点且未展示图片时的占位图标 */
  icon?: React.ReactNode;
}

const TONE: Record<Color, string> = {
  default: styles.toneDefault,
  primary: styles.tonePrimary,
  secondary: styles.toneSecondary,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  error: styles.toneError,
  info: styles.toneInfo,
};

function initialsFromText(text: string): string {
  const t = text.trim();
  if (!t) return '';
  if (t.length <= 2) return t.toUpperCase();
  const ascii = /^[\x00-\x7F]+$/.test(t);
  return ascii ? t.slice(0, 2).toUpperCase() : t.slice(0, 2);
}

function DefaultUserGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    src,
    alt = '',
    size = 'md',
    shape = 'circle',
    color = 'default',
    children,
    icon,
    className,
    ...rest
  },
  ref,
) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImg = Boolean(src && !failed);

  const ariaLabel = useMemo(() => {
    if (showImg) return undefined;
    if (alt) return alt;
    if (typeof children === 'string' || typeof children === 'number') {
      const ini = initialsFromText(String(children));
      if (ini) return `头像 ${ini}`;
    }
    return '用户头像';
  }, [showImg, alt, children]);

  function renderFallbackBody(): React.ReactNode {
    if (typeof children === 'string' || typeof children === 'number') {
      const ini = initialsFromText(String(children));
      if (ini) {
        return <span className={styles.fallbackText}>{ini}</span>;
      }
      return icon ? (
        <span className={styles.iconFallback}>{icon}</span>
      ) : (
        <span className={styles.iconFallback}>
          <DefaultUserGlyph />
        </span>
      );
    }
    if (children != null && children !== false) {
      return children;
    }
    if (icon) {
      return <span className={styles.iconFallback}>{icon}</span>;
    }
    return (
      <span className={styles.iconFallback}>
        <DefaultUserGlyph />
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={join(
        styles.root,
        size === 'xs' && styles.sizeXs,
        size === 'sm' && styles.sizeSm,
        size === 'md' && styles.sizeMd,
        size === 'lg' && styles.sizeLg,
        size === 'xl' && styles.sizeXl,
        shape === 'circle' && styles.shapeCircle,
        shape === 'rounded' && styles.shapeRounded,
        TONE[color],
        className,
      )}
      role={showImg ? undefined : 'img'}
      aria-label={showImg ? undefined : ariaLabel}
      {...rest}
    >
      {showImg ? (
        <img
          src={src}
          alt={alt || ariaLabel || '头像'}
          className={styles.img}
          onError={() => setFailed(true)}
          draggable={false}
        />
      ) : (
        <span className={styles.fallback}>{renderFallbackBody()}</span>
      )}
    </span>
  );
});

Avatar.displayName = 'Avatar';
