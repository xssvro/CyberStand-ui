import React from 'react';
import styles from './FormField.module.css';

export interface LabelProps extends React.HTMLAttributes<HTMLElement> {
  /** 仅 `tag="label"` 时生效 */
  htmlFor?: string;
  /** `span` 用于 CheckboxGroup / RadioGroup 等无单一 `htmlFor` 的场景，配合 `aria-labelledby` */
  tag?: 'label' | 'span';
  /** 显示必填星号（装饰，请配合控件 `required`） */
  required?: boolean;
  /** 禁用态样式 */
  disabled?: boolean;
  children: React.ReactNode;
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const Label = React.forwardRef<HTMLElement, LabelProps>(function Label(
  { tag = 'label', required = false, disabled = false, className = '', children, htmlFor, ...rest },
  ref
) {
  const cls = joinClasses(styles.label, disabled && styles.disabled, className);

  if (tag === 'span') {
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={cls} {...rest}>
        {children}
        {required && (
          <span className={styles.requiredMark} aria-hidden>
            *
          </span>
        )}
      </span>
    );
  }

  return (
    <label ref={ref as React.Ref<HTMLLabelElement>} className={cls} htmlFor={htmlFor} {...rest}>
      {children}
      {required && (
        <span className={styles.requiredMark} aria-hidden>
          *
        </span>
      )}
    </label>
  );
});

Label.displayName = 'Label';
