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
  /** 单元格与表头字号、内边距档位；`xs` 接近 Element 紧凑表 */
  size?: TableSize;
  /** 斑马纹（仅 tbody 隔行底色） */
  striped?: boolean;
  /** `table` 外框 + 单元格网格（`border-collapse: collapse`，合并单元格边框正确） */
  bordered?: boolean;
  /** 行悬停高亮（仅 tbody） */
  hoverable?: boolean;
  /** `fixed` 时列宽由首行决定，适合与明确列宽或省略号配合 */
  layout?: 'auto' | 'fixed';
  /** 表头 `position: sticky; top: 0`，需在纵向可滚动容器内才明显 */
  stickyHeader?: boolean;
  /** 加载态：半透明遮罩 + 中央 Spinner，并拦截点击（类似 Ant Table `loading`） */
  loading?: boolean;
  /** 外容器浅阴影，常与 `bordered` 同用 */
  shadow?: TableShadow;
  /** 加到最外层圆角容器（与 `shadow` 同层），便于控制外边距等 */
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
    <div
      className={join(styles.root, shadow === 'sm' && styles.rootShadowSm, wrapperClassName)}
    >
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

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader(
  { className, ...rest },
  ref,
) {
  return <thead ref={ref} className={join(styles.thead, className)} {...rest} />;
});

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, ...rest },
  ref,
) {
  return <tbody ref={ref} className={join(styles.tbody, className)} {...rest} />;
});

export type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(function TableFooter(
  { className, ...rest },
  ref,
) {
  return <tfoot ref={ref} className={join(styles.tfoot, className)} {...rest} />;
});

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, ...rest },
  ref,
) {
  return <tr ref={ref} className={join(styles.tr, className)} {...rest} />;
});

export type TableHeadAlign = 'start' | 'center' | 'end';

export interface TableHeadProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: TableHeadAlign;
  /** 等宽数字（tabular-nums），适合金额、数量列 */
  numeric?: boolean;
  /** 可排序列：内部为 `<button>`，并在 `th` 上写 `aria-sort` */
  sortable?: boolean;
  /** 受控排序方向；`null` 表示未按该列排或未激活 */
  sortOrder?: TableSortOrder;
  /** 点击排序按钮；多列场景下由父组件切换「当前排序列」并配合 `cycleTableSortOrder` */
  onSort?: () => void;
  /** 排序按钮 `aria-label` */
  sortAriaLabel?: string;
  /** 禁用排序交互 */
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

export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: TableCellAlign;
  numeric?: boolean;
  /** 行表头或角单元格时使用 `th`，请配合 `scope` */
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

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(function TableCaption(
  { className, ...rest },
  ref,
) {
  return <caption ref={ref} className={join(styles.caption, className)} {...rest} />;
});

export interface TableEmptyProps extends Omit<React.HTMLAttributes<HTMLTableRowElement>, 'children'> {
  /** 合并列数，须与列数一致 */
  colSpan: number;
  children?: React.ReactNode;
  /** 未传 `children` 时展示的占位文案 */
  description?: React.ReactNode;
}

/** 空数据占位行（单行 `td` + `colSpan`），用法类似 Ant `locale.emptyText` */
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
  /** 右侧操作区（新建、导出等） */
  extra?: React.ReactNode;
};

/** 表格外筛选/工具条容器，放在 `Table` 之上，与 `Stack` 组合 */
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
