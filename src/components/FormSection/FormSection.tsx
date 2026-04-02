import React, { forwardRef, useId } from 'react';
import styles from './FormSection.module.css';

export interface FormSectionProps
  extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'title' | 'children'> {
  /** 分组标题：`fieldset` 时为 `legend`，`div` 时为标题节点 */
  title: React.ReactNode;
  /** 标题下辅助说明 */
  description?: React.ReactNode;
  /** `fieldset`：原生分组与 `disabled`；`div`：`role="group"` + `aria-labelledby` */
  as?: 'fieldset' | 'div';
  children: React.ReactNode;
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const FormSection = forwardRef<HTMLElement, FormSectionProps>(function FormSection(
  {
    title,
    description,
    as = 'fieldset',
    disabled = false,
    children,
    className = '',
    style,
    ...rest
  },
  ref
) {
  const uid = useId().replace(/:/g, '');
  const titleId = `su-fs-title-${uid}`;

  if (as === 'div') {
    return (
      <section
        ref={ref as React.Ref<HTMLElement>}
        className={joinClasses(styles.root, styles.asDiv, disabled && styles.disabled, className)}
        style={style}
        role="group"
        aria-labelledby={titleId}
        aria-disabled={disabled || undefined}
        {...(rest as React.HTMLAttributes<HTMLElement>)}
      >
        <div id={titleId} className={styles.title}>
          {title}
        </div>
        {description != null && description !== false ? (
          <p className={styles.description}>{description}</p>
        ) : null}
        <div className={styles.body}>{children}</div>
      </section>
    );
  }

  return (
    <fieldset
      ref={ref as React.Ref<HTMLFieldSetElement>}
      disabled={disabled}
      className={joinClasses(styles.root, styles.asFieldset, className)}
      style={style}
      {...rest}
    >
      <legend className={styles.legend}>{title}</legend>
      {description != null && description !== false ? (
        <p className={styles.description}>{description}</p>
      ) : null}
      <div className={styles.body}>{children}</div>
    </fieldset>
  );
});

FormSection.displayName = 'FormSection';
