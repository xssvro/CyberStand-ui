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
  text?: string;
  tooltip?: string;
};

export interface TypographyProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  variant?: TypographyVariant;
  as?: keyof React.JSX.IntrinsicElements;
  color?: TypographyColor;
  textAlign?: TypographyAlign;
  weight?: TypographyWeight;
  truncate?: boolean;
  lineClamp?: number;
  noMargin?: boolean;
  copyable?: boolean | CopyableConfig;
}

const VARIANT_TAG: Record<TypographyVariant, keyof React.JSX.IntrinsicElements> = {
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

const VARIANT_SKIPS_DEFAULT_COLOR: TypographyVariant[] = ['subtitle', 'blockquote', 'code'];

function isBlockTag(tag: keyof React.JSX.IntrinsicElements): boolean {
  return ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'div'].includes(tag as string);
}

function extractPlainText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractPlainText).join('');
  if (React.isValidElement(node)) {
    return extractPlainText((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

const TypographyBase = React.forwardRef<HTMLElement, TypographyProps>(function Typography(
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
  ref,
) {
  const tag = (as ?? VARIANT_TAG[variant]) as keyof React.JSX.IntrinsicElements;

  const showCopy = Boolean(copyable);
  const copyConfig: CopyableConfig | null =
    copyable === true ? null : typeof copyable === 'object' && copyable !== null ? copyable : null;

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

  const skipDefaultColor = color === 'default' && VARIANT_SKIPS_DEFAULT_COLOR.includes(variant);
  const colorClass = !skipDefaultColor && styles[`color-${color}` as keyof typeof styles];

  const variantClass = styles[`variant-${variant}` as keyof typeof styles];
  const alignClass = textAlign && styles[`align-${textAlign}` as keyof typeof styles];
  const weightClass = weight && styles[`weight-${weight}` as keyof typeof styles];

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
    <Tag ref={ref} className={rootClass} style={{ ...lineClampStyle, ...style }} {...rest}>
      {children}
    </Tag>
  );

  if (!showCopy) return inner;

  const wrapClass = isBlockTag(tag) ? styles.copyWrapBlock : styles.copyWrap;

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
});

TypographyBase.displayName = 'Typography';

export interface TypographyLinkProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'color'
> {
  external?: boolean;
  color?: TypographyColor;
}

export const TypographyLink = React.forwardRef<HTMLAnchorElement, TypographyLinkProps>(
  function TypographyLink(
    { external, href, children, className = '', color = 'info', target, rel, ...rest },
    ref,
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
  },
);

TypographyLink.displayName = 'TypographyLink';

// eslint-disable-next-line react-refresh/only-export-components
export const Typography = Object.assign(TypographyBase, {
  Link: TypographyLink,
});
