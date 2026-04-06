import React from 'react';
import styles from './FormField.module.css';

export interface LabelProps extends React.HTMLAttributes<HTMLElement> {
  htmlFor?: string;
  tag?: 'label' | 'span';
  required?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const Label = React.forwardRef<HTMLElement, LabelProps>(function Label(
  { tag = 'label', required = false, disabled = false, className = '', children, htmlFor, ...rest },
  ref,
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
