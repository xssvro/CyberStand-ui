import React from 'react';
import styles from './Divider.module.css';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';
export type DividerColor = 'default' | 'subtle';
export type DividerTitleAlign = 'start' | 'center' | 'end';

export interface DividerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  children?: React.ReactNode;
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  spacing?: DividerSpacing;
  color?: DividerColor;
  titleAlign?: DividerTitleAlign;
  decorative?: boolean;
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

const SPACING_CLASS: Record<DividerSpacing, string> = {
  none: styles.spacingNone,
  sm: styles.spacingSm,
  md: styles.spacingMd,
  lg: styles.spacingLg,
};

export const Divider = React.forwardRef<HTMLElement, DividerProps>(function Divider(
  {
    children,
    orientation = 'horizontal',
    variant = 'solid',
    spacing = 'md',
    color = 'default',
    titleAlign = 'center',
    decorative = true,
    className = '',
    style,
    ...rest
  },
  ref,
) {
  const isVertical = orientation === 'vertical';
  const hasLabel = Boolean(children) && !isVertical;

  const variantClass = variant !== 'solid' ? styles[variant as 'dashed' | 'dotted'] : '';
  const spacingClass = SPACING_CLASS[spacing];
  const orientClass = isVertical ? styles.vertical : styles.horizontal;
  const colorClass = color === 'subtle' ? styles.colorSubtle : '';

  const a11yProps: React.HTMLAttributes<HTMLElement> = decorative
    ? { 'aria-hidden': true }
    : {
        role: 'separator',
        'aria-orientation': isVertical ? 'vertical' : 'horizontal',
      };

  if (hasLabel) {
    const alignClass =
      titleAlign === 'start'
        ? styles.alignStart
        : titleAlign === 'end'
          ? styles.alignEnd
          : styles.alignCenter;

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={joinClasses(
          styles.withLabel,
          orientClass,
          variantClass,
          spacingClass,
          colorClass,
          alignClass,
          className,
        )}
        style={style}
        {...(decorative
          ? { 'aria-hidden': true }
          : { role: 'separator', 'aria-orientation': 'horizontal' as const })}
        {...rest}
      >
        <span className={styles.line} aria-hidden />
        <span className={styles.text}>{children}</span>
        <span className={styles.line} aria-hidden />
      </div>
    );
  }

  if (isVertical) {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={joinClasses(
          styles.root,
          orientClass,
          variantClass,
          spacingClass,
          colorClass,
          className,
        )}
        style={style}
        {...a11yProps}
        {...rest}
      />
    );
  }

  return (
    <hr
      ref={ref as React.Ref<HTMLHRElement>}
      className={joinClasses(
        styles.root,
        orientClass,
        variantClass,
        spacingClass,
        colorClass,
        className,
      )}
      style={style}
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'separator', 'aria-orientation': 'horizontal' as const })}
      {...rest}
    />
  );
});

Divider.displayName = 'Divider';

export type SeparatorProps = Omit<DividerProps, 'decorative'>;

export const Separator = React.forwardRef<HTMLElement, SeparatorProps>(function Separator(
  { spacing = 'md', ...props },
  ref,
) {
  return <Divider ref={ref} decorative={false} spacing={spacing} {...props} />;
});

Separator.displayName = 'Separator';
