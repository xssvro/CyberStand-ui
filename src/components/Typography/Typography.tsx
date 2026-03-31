import React, { useCallback, useMemo, useState } from 'react';
import styles from './Typography.module.css';

export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle'
  | 'lead'
  | 'bodyLarge'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'overline'
  | 'code'
  | 'blockquote'
  | 'link';

export type TypographyColor =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'emphasis'
  | 'inverse'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type TypographyAlign = 'start' | 'center' | 'end' | 'justify';

export type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export type CopyableConfig = {
  /** 复制内容；不传则仅在 children 为纯文本时使用 */
  text?: string;
  /** 复制按钮 aria-label */
  tooltip?: string;
};

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  /** 排版变体（参考 MUI Typography / Ant Typography） */
  variant?: TypographyVariant;
  /** 渲染元素；不传则按 variant 使用语义标签 */
  as?: keyof React.JSX.IntrinsicElements;
  /** 文本色（语义 token） */
  color?: TypographyColor;
  textAlign?: TypographyAlign;
  /** 字重覆盖 */
  weight?: TypographyWeight;
  /** 单行省略 */
  truncate?: boolean;
  /** 多行省略行数 */
  lineClamp?: number;
  /** 去掉默认 margin（用于嵌套在 Card 标题等场景） */
  noMargin?: boolean;
  /**
   * 是否展示复制按钮（Ant Design Typography.Paragraph 风格）
   * 需提供可复制字符串：`copyable={{ text: '...' }}` 或 `children` 为字符串
   */
  copyable?: boolean | CopyableConfig;
}

const VARIANT_TAG: Record<TypographyVariant, keyof React.JSX.IntrinsicElements> =
  {
    display: 'h1',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle: 'p',
    lead: 'p',
    bodyLarge: 'p',
    body: 'p',
    bodySmall: 'p',
    caption: 'span',
    label: 'label',
    overline: 'span',
    code: 'code',
    blockquote: 'blockquote',
    link: 'span',
  };

/** 变体自带强调色时，不再套 `color-default`，避免盖掉 muted / code 等默认色 */
const VARIANT_SKIPS_DEFAULT_COLOR: TypographyVariant[] = [
  'subtitle',
  'blockquote',
  'code',
];

function isBlockTag(tag: keyof React.JSX.IntrinsicElements): boolean {
  return [
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'div',
  ].includes(tag as string);
}

function extractPlainText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractPlainText).join('');
  if (React.isValidElement(node)) {
    return extractPlainText(
      (node.props as { children?: React.ReactNode }).children
    );
  }
  return '';
}

const TypographyBase = React.forwardRef<HTMLElement, TypographyProps>(
  function Typography(
    {
      variant = 'body',
      as,
      color = 'default',
      textAlign,
      weight,
      truncate = false,
      lineClamp,
      noMargin = false,
      copyable = false,
      className = '',
      style,
      children,
      ...rest
    },
    ref
  ) {
    const tag = (as ?? VARIANT_TAG[variant]) as keyof React.JSX.IntrinsicElements;

    const showCopy = Boolean(copyable);
    const copyConfig: CopyableConfig | null =
      copyable === true
        ? null
        : typeof copyable === 'object' && copyable !== null
          ? copyable
          : null;

    const copyText = useMemo(() => {
      if (!showCopy) return '';
      const fromCfg = copyConfig?.text;
      if (fromCfg) return fromCfg;
      return extractPlainText(children).trim();
    }, [showCopy, copyConfig?.text, children]);

    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(async () => {
      if (!copyText) return;
      try {
        await navigator.clipboard.writeText(copyText);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        /* ignore */
      }
    }, [copyText]);

    const skipDefaultColor =
      color === 'default' && VARIANT_SKIPS_DEFAULT_COLOR.includes(variant);
    const colorClass =
      !skipDefaultColor &&
      styles[`color-${color}` as keyof typeof styles];

    const variantClass = styles[`variant-${variant}` as keyof typeof styles];
    const alignClass =
      textAlign && styles[`align-${textAlign}` as keyof typeof styles];
    const weightClass =
      weight && styles[`weight-${weight}` as keyof typeof styles];

    const lineClampStyle =
      lineClamp != null && lineClamp > 0
        ? ({
            WebkitLineClamp: lineClamp,
          } as React.CSSProperties)
        : undefined;

    const rootClass = [
      styles.root,
      variantClass,
      colorClass,
      alignClass,
      weightClass,
      truncate && styles.truncate,
      lineClamp != null && lineClamp > 0 && styles.lineClamp,
      noMargin && styles.noMargin,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const Tag = tag as React.ElementType;
    const inner = (
      <Tag
        ref={ref}
        className={rootClass}
        style={{ ...lineClampStyle, ...style }}
        {...rest}
      >
        {children}
      </Tag>
    );

    if (!showCopy) return inner;

    const wrapClass = isBlockTag(tag)
      ? styles.copyWrapBlock
      : styles.copyWrap;

    const copyLabel = copyConfig?.tooltip;

    return (
      <span className={wrapClass}>
        {inner}
        <button
          type="button"
          className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`.trim()}
          onClick={handleCopy}
          disabled={!copyText}
          aria-label={copyLabel ?? (copied ? '已复制' : '复制')}
        >
          {copied ? '已复制' : '复制'}
        </button>
      </span>
    );
  }
);

TypographyBase.displayName = 'Typography';

export interface TypographyLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
  /** 外链时自动 target=_blank 与 rel */
  external?: boolean;
  color?: TypographyColor;
}

export const TypographyLink = React.forwardRef<
  HTMLAnchorElement,
  TypographyLinkProps
>(function TypographyLink(
  {
    external,
    href,
    children,
    className = '',
    color = 'info',
    target,
    rel,
    ...rest
  },
  ref
) {
  const rootClass = [
    styles.root,
    styles.variantLink,
    styles[`color-${color}` as keyof typeof styles],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      ref={ref}
      href={href}
      className={rootClass}
      target={external ? '_blank' : target}
      rel={external ? 'noopener noreferrer' : rel}
      {...rest}
    >
      {children}
    </a>
  );
});

TypographyLink.displayName = 'TypographyLink';

/** Ant Design 式：`Typography.Link` */
// eslint-disable-next-line react-refresh/only-export-components -- Object.assign 复合组件，HMR 仍跟踪 TypographyBase
export const Typography = Object.assign(TypographyBase, {
  Link: TypographyLink,
});
