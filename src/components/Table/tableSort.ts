/** 列排序受控状态：`null` 表示该列当前未作为排序键或未排序 */
export type TableSortOrder = 'asc' | 'desc' | null;

/**
 * 单列点击常见三态循环：无 → 升序 → 降序 → 无。
 * 多列场景下由父组件决定「换列时是否从 asc 开始」，本函数只负责单状态推进。
 */
export function cycleTableSortOrder(prev: TableSortOrder): TableSortOrder {
  if (prev === null) return 'asc';
  if (prev === 'asc') return 'desc';
  return null;
}
