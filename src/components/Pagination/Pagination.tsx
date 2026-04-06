import React, { useCallback, useId, useMemo, useState } from 'react';
import { Select } from '../Select';
import { buildPaginationItems } from './paginationItems';
import styles from './Pagination.module.css';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export type PaginationSize = 'sm' | 'md' | 'lg';

export type PaginationAlign = 'start' | 'center' | 'end';

export interface PaginationProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'onChange' | 'defaultValue'
> {
  disabled?: boolean;
  total: number;
  current?: number;
  defaultCurrent?: number;
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  onChange?: (page: number, pageSize: number) => void;
  hideOnSinglePage?: boolean;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (range: [number, number], total: number) => React.ReactNode;
  simple?: boolean;
  size?: PaginationSize;
  align?: PaginationAlign;
  siblingDelta?: number;
  navAriaLabel?: string;
  prevAriaLabel?: string;
  nextAriaLabel?: string;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

function getRange(page: number, pageSize: number, total: number): [number, number] {
  if (total <= 0) return [0, 0];
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return [start, end];
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    total,
    current: currentProp,
    defaultCurrent = 1,
    pageSize: pageSizeProp,
    defaultPageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
    onChange,
    disabled = false,
    hideOnSinglePage = false,
    showSizeChanger = false,
    showQuickJumper = false,
    showTotal,
    simple = false,
    size = 'md',
    align = 'start',
    siblingDelta = 2,
    navAriaLabel = '分页',
    prevAriaLabel = '上一页',
    nextAriaLabel = '下一页',
    className,
    style,
    ...rest
  },
  ref,
) {
  const isPageControlled = currentProp !== undefined;
  const isSizeControlled = pageSizeProp !== undefined;
  const [innerPage, setInnerPage] = useState(defaultCurrent);
  const [innerSize, setInnerSize] = useState(defaultPageSize);

  const pageSize = isSizeControlled ? pageSizeProp! : innerSize;
  const totalPages = Math.ceil(total / pageSize) || 0;

  const rawPage = isPageControlled ? currentProp! : innerPage;
  const page = totalPages > 0 ? clamp(rawPage, 1, totalPages) : 1;

  const setPage = useCallback(
    (p: number) => {
      const tp = Math.ceil(total / pageSize) || 0;
      const next = tp > 0 ? clamp(p, 1, tp) : 1;
      if (!isPageControlled) setInnerPage(next);
      onChange?.(next, pageSize);
    },
    [isPageControlled, onChange, pageSize, total],
  );

  const emitPageSize = useCallback(
    (ps: number) => {
      const nextSize = clamp(ps, 1, Number.MAX_SAFE_INTEGER);
      if (!isSizeControlled) setInnerSize(nextSize);
      const tp = Math.ceil(total / nextSize) || 0;
      const nextPage = tp > 0 ? clamp(1, 1, tp) : 1;
      if (!isPageControlled) setInnerPage(nextPage);
      onChange?.(nextPage, nextSize);
    },
    [isPageControlled, isSizeControlled, onChange, total],
  );

  const items = useMemo(
    () => (totalPages > 0 ? buildPaginationItems(page, totalPages, siblingDelta) : []),
    [page, totalPages, siblingDelta],
  );

  const [jumpDraft, setJumpDraft] = useState('');
  const sizeLabelId = useId();

  const onJump = useCallback(() => {
    const n = parseInt(jumpDraft, 10);
    if (Number.isNaN(n) || totalPages <= 0) return;
    setPage(clamp(n, 1, totalPages));
    setJumpDraft('');
  }, [jumpDraft, setPage, totalPages]);

  const range = getRange(page, pageSize, total);
  const sizeOptions = useMemo(
    () => pageSizeOptions.map((n) => ({ value: String(n), label: `${n} 条/页` })),
    [pageSizeOptions],
  );

  if (hideOnSinglePage && total > 0 && totalPages <= 1) {
    return null;
  }

  const prevDisabled = disabled || page <= 1 || totalPages <= 0;
  const nextDisabled = disabled || totalPages <= 0 || page >= totalPages;

  const navClass = join(
    styles.root,
    size === 'sm' && styles.sizeSm,
    size === 'md' && styles.sizeMd,
    size === 'lg' && styles.sizeLg,
    align === 'start' && styles.alignStart,
    align === 'center' && styles.alignCenter,
    align === 'end' && styles.alignEnd,
    className,
  );

  return (
    <nav
      ref={ref as React.Ref<HTMLElement>}
      className={navClass}
      style={style}
      aria-label={navAriaLabel}
      {...rest}
    >
      {showTotal ? <div className={styles.total}>{showTotal(range, total)}</div> : null}

      {simple ? (
        <ul className={styles.list}>
          <li className={styles.item}>
            <button
              type="button"
              className={styles.btn}
              disabled={prevDisabled}
              aria-label={prevAriaLabel}
              onClick={() => setPage(page - 1)}
            >
              ‹
            </button>
          </li>
          <li className={styles.item}>
            <span className={styles.simpleLabel}>
              {totalPages > 0 ? `${page} / ${totalPages}` : '0 / 0'}
            </span>
          </li>
          <li className={styles.item}>
            <button
              type="button"
              className={styles.btn}
              disabled={nextDisabled}
              aria-label={nextAriaLabel}
              onClick={() => setPage(page + 1)}
            >
              ›
            </button>
          </li>
        </ul>
      ) : (
        <ul className={styles.list}>
          <li className={styles.item}>
            <button
              type="button"
              className={styles.btn}
              disabled={prevDisabled}
              aria-label={prevAriaLabel}
              onClick={() => setPage(page - 1)}
            >
              上一页
            </button>
          </li>
          {items.map((it, idx) =>
            it === 'ellipsis' ? (
              <li key={`e-${idx}`} className={styles.item} aria-hidden>
                <span className={styles.ellipsis}>···</span>
              </li>
            ) : (
              <li key={it} className={styles.item}>
                <button
                  type="button"
                  className={join(styles.btn, it === page && styles.btnActive)}
                  disabled={disabled}
                  aria-label={`第 ${it} 页`}
                  aria-current={it === page ? 'page' : undefined}
                  onClick={() => setPage(it)}
                >
                  {it}
                </button>
              </li>
            ),
          )}
          <li className={styles.item}>
            <button
              type="button"
              className={styles.btn}
              disabled={nextDisabled}
              aria-label={nextAriaLabel}
              onClick={() => setPage(page + 1)}
            >
              下一页
            </button>
          </li>
        </ul>
      )}

      {showSizeChanger ? (
        <div className={styles.sizeChanger}>
          <span className={styles.sizeChangerLabel} id={sizeLabelId}>
            每页
          </span>
          <Select
            size={size === 'lg' ? 'md' : size === 'sm' ? 'sm' : 'md'}
            value={String(pageSize)}
            options={sizeOptions}
            disabled={disabled}
            aria-labelledby={sizeLabelId}
            onChange={(v) => emitPageSize(Number(v))}
            className="min-w-[5.5rem]"
          />
        </div>
      ) : null}

      {showQuickJumper && totalPages > 0 ? (
        <div className={styles.jumper}>
          <span>跳至</span>
          <input
            type="text"
            inputMode="numeric"
            className={styles.jumperInput}
            disabled={disabled}
            value={jumpDraft}
            placeholder={String(page)}
            aria-label="跳转到页码"
            onChange={(e) => setJumpDraft(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onJump();
            }}
          />
          <span>页</span>
        </div>
      ) : null}
    </nav>
  );
});

Pagination.displayName = 'Pagination';
