import React, { useEffect, useMemo, useState } from 'react';
import type { Color } from '../../core/stand';
import { IconUserHud } from '../../icons';
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

/** 与 Avatar 尺寸匹配的 HUD 图标像素（略小于外框，留白呼吸） */
const HUD_ICON_PX: Record<AvatarSize, number> = {
  xs: 13,
  sm: 16,
  md: 20,
  lg: 25,
  xl: 32,
};

function initialsFromText(text: string): string {
  const t = text.trim();
  if (!t) return '';
  if (t.length <= 2) return t.toUpperCase();
  const ascii = Array.from(t).every((ch) => (ch.codePointAt(0) ?? 0) < 0x80);
  return ascii ? t.slice(0, 2).toUpperCase() : t.slice(0, 2);
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

  const hudSize = HUD_ICON_PX[size];

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
          <IconUserHud size={hudSize} />
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
        <IconUserHud size={hudSize} />
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={join(
        styles.root,
        showImg && styles.withImage,
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
