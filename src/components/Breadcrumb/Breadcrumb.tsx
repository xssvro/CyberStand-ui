import React from 'react';
import styles from './Breadcrumb.module.css';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  /** 覆盖 `aria-label` */
  'aria-label'?: string;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { className, 'aria-label': ariaLabel = '面包屑', children, ...rest },
  ref,
) {
  return (
    <nav ref={ref} aria-label={ariaLabel} className={join(styles.nav, className)} {...rest}>
      <ol className={styles.list}>{children}</ol>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

export interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** 当前页，渲染为 `span` 且 `aria-current="page"` */
  current?: boolean;
}

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem({ className, current, children, ...rest }, ref) {
    return (
      <li ref={ref} className={join(styles.item, className)} {...rest}>
        {current ? (
          <span className={styles.current} aria-current="page">
            {children}
          </span>
        ) : (
          children
        )}
      </li>
    );
  },
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

export type BreadcrumbLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  function BreadcrumbLink({ className, ...rest }, ref) {
    return <a ref={ref} className={join(styles.link, className)} {...rest} />;
  },
);

BreadcrumbLink.displayName = 'BreadcrumbLink';

export interface BreadcrumbSeparatorProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
}

export const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  function BreadcrumbSeparator({ className, children = '/', ...rest }, ref) {
    return (
      <li ref={ref} aria-hidden className={join(styles.sep, className)} {...rest}>
        {children}
      </li>
    );
  },
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
