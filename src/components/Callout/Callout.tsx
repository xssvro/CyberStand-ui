import React from 'react';
import styles from './Callout.module.css';

export type CalloutIntent = 'default' | 'info' | 'success' | 'warning' | 'error';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** 语义强调色；`default` 为中性说明 */
  intent?: CalloutIntent;
  title?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * 文档/说明向强调块：左侧色条 + 可选小标题。
 * 与 **Alert** 区分：无 `role` 默认可读性提示、无关闭按钮；适合内联说明、注意事项。
 */
export const Callout = React.forwardRef<HTMLElement, CalloutProps>(function Callout(
  { intent = 'default', title, children, className = '', ...rest },
  ref
) {
  return (
    <aside ref={ref} className={join(styles.root, styles[intent], className)} {...rest}>
      {title != null && title !== '' ? <div className={styles.title}>{title}</div> : null}
      <div className={styles.content}>{children}</div>
    </aside>
  );
});

Callout.displayName = 'Callout';
