import React, { forwardRef } from 'react';
import { Spinner } from '../Spinner';
import type { TableSortOrder } from './tableSort';
import styles from './Table.module.css';

export type { TableSortOrder } from './tableSort';
export { cycleTableSortOrder } from './tableSort';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export type TableSize = 'xs' | 'sm' | 'md' | 'lg';

export type TableShadow = 'none' | 'sm';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  size?: TableSize;
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  layout?: 'auto' | 'fixed';
  stickyHeader?: boolean;
  loading?: boolean;
  shadow?: TableShadow;
  wrapperClassName?: string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    size = 'md',
    striped = false,
    bordered = false,
    hoverable = false,
    layout = 'auto',
    stickyHeader = false,
    loading = false,
    shadow = 'none',
    wrapperClassName,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div className={join(styles.root, shadow === 'sm' && styles.rootShadowSm, wrapperClassName)}>
      {loading ? (
        <div className={styles.loadingOverlay} aria-busy="true" aria-live="polite">
          <Spinner size="md" color="primary" />
        </div>
      ) : null}
      <div className={styles.scrollInner}>
        <table
          ref={ref}
          className={join(
            styles.table,
            size === 'xs' && styles.sizeXs,
            size === 'sm' && styles.sizeSm,
            size === 'md' && styles.sizeMd,
            size === 'lg' && styles.sizeLg,
            striped && styles.striped,
            bordered && styles.cellGrid,
            hoverable && styles.hoverable,
            layout === 'fixed' && styles.layoutFixed,
            layout === 'auto' && styles.layoutAuto,
            stickyHeader && styles.stickyHeader,
            className,
          )}
          {...rest}
        >
          {children}
        </table>
      </div>
    </div>
  );
});

export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ className, ...rest }, ref) {
    return <thead ref={ref} className={join(styles.thead, className)} {...rest} />;
  },
);

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, ...rest },
  ref,
) {
  return <tbody ref={ref} className={join(styles.tbody, className)} {...rest} />;
});

export type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter({ className, ...rest }, ref) {
    return <tfoot ref={ref} className={join(styles.tfoot, className)} {...rest} />;
  },
);

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, ...rest },
  ref,
) {
  return <tr ref={ref} className={join(styles.tr, className)} {...rest} />;
});

export type TableHeadAlign = 'start' | 'center' | 'end';

export interface TableHeadProps extends Omit<
  React.ThHTMLAttributes<HTMLTableCellElement>,
  'align'
> {
  align?: TableHeadAlign;
  numeric?: boolean;
  sortable?: boolean;
  sortOrder?: TableSortOrder;
  onSort?: () => void;
  sortAriaLabel?: string;
  sortDisabled?: boolean;
}

function SortGlyphs({ order }: { order: TableSortOrder }) {
  return (
    <span className={styles.sortGlyphs} aria-hidden>
      <span className={join(styles.sortCaret, order === 'asc' && styles.sortCaretActive)}>▴</span>
      <span className={join(styles.sortCaret, order === 'desc' && styles.sortCaretActive)}>▾</span>
    </span>
  );
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  {
    className,
    align = 'start',
    numeric,
    sortable = false,
    sortOrder = null,
    onSort,
    sortAriaLabel,
    sortDisabled = false,
    children,
    ...rest
  },
  ref,
) {
  const hasSort = Boolean(sortable && onSort);

  const ariaSort: React.AriaAttributes['aria-sort'] | undefined = !hasSort
    ? undefined
    : sortOrder === 'asc'
      ? 'ascending'
      : sortOrder === 'desc'
        ? 'descending'
        : 'none';

  const inner = hasSort ? (
    <button
      type="button"
      className={join(styles.sortBtn, align === 'end' && styles.sortBtnAlignEnd)}
      onClick={onSort}
      disabled={sortDisabled}
      aria-label={sortAriaLabel}
    >
      <span className={styles.sortLabel}>{children}</span>
      <SortGlyphs order={sortOrder} />
    </button>
  ) : (
    children
  );

  return (
    <th
      ref={ref}
      className={join(
        styles.th,
        align === 'center' && styles.alignCenter,
        align === 'end' && styles.alignEnd,
        numeric && styles.numeric,
        hasSort && styles.sortTh,
        className,
      )}
      aria-sort={ariaSort}
      {...rest}
    >
      {inner}
    </th>
  );
});

export type TableCellAlign = 'start' | 'center' | 'end';

export interface TableCellProps extends Omit<
  React.TdHTMLAttributes<HTMLTableCellElement>,
  'align'
> {
  align?: TableCellAlign;
  numeric?: boolean;
  as?: 'td' | 'th';
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, align = 'start', numeric, as: Comp = 'td', ...rest },
  ref,
) {
  return (
    <Comp
      ref={ref}
      className={join(
        Comp === 'th' ? styles.th : styles.td,
        align === 'center' && styles.alignCenter,
        align === 'end' && styles.alignEnd,
        numeric && styles.numeric,
        className,
      )}
      {...rest}
    />
  );
});

export type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement>;

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption({ className, ...rest }, ref) {
    return <caption ref={ref} className={join(styles.caption, className)} {...rest} />;
  },
);

export interface TableEmptyProps extends Omit<
  React.HTMLAttributes<HTMLTableRowElement>,
  'children'
> {
  colSpan: number;
  children?: React.ReactNode;
  description?: React.ReactNode;
}

export const TableEmpty = forwardRef<HTMLTableRowElement, TableEmptyProps>(function TableEmpty(
  { colSpan, children, description = '暂无数据', className, ...rest },
  ref,
) {
  return (
    <TableRow ref={ref} className={join(styles.emptyRow, className)} {...rest}>
      <TableCell colSpan={colSpan} className={styles.emptyCell}>
        {children ?? description}
      </TableCell>
    </TableRow>
  );
});

export type TableToolbarProps = React.HTMLAttributes<HTMLDivElement> & {
  extra?: React.ReactNode;
};

export const TableToolbar = forwardRef<HTMLDivElement, TableToolbarProps>(function TableToolbar(
  { className, children, extra, 'aria-label': ariaLabel = '表格工具栏', ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={join(styles.toolbar, className)}
      role="toolbar"
      aria-label={ariaLabel}
      {...rest}
    >
      <div className={styles.toolbarMain}>{children}</div>
      {extra ? <div className={styles.toolbarExtra}>{extra}</div> : null}
    </div>
  );
});
