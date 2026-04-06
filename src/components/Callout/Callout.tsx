import React from 'react';
import styles from './Callout.module.css';

export type CalloutIntent = 'default' | 'info' | 'success' | 'warning' | 'error';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface CalloutProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'title' | 'children'
> {
  intent?: CalloutIntent;
  title?: React.ReactNode;
  children: React.ReactNode;
}

export const Callout = React.forwardRef<HTMLElement, CalloutProps>(function Callout(
  { intent = 'default', title, children, className = '', ...rest },
  ref,
) {
  return (
    <aside ref={ref} className={join(styles.root, styles[intent], className)} {...rest}>
      {title != null && title !== '' ? <div className={styles.title}>{title}</div> : null}
      <div className={styles.content}>{children}</div>
    </aside>
  );
});

Callout.displayName = 'Callout';
