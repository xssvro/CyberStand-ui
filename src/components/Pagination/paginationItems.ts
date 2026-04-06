/**
 * 生成分页器页码序列（含省略号），用于避免页数过多时铺满一行。
 * `delta`：当前页左右各保留的页码个数（不含当前页）。
 */
export function buildPaginationItems(
  current: number,
  totalPages: number,
  delta = 2,
): Array<number | 'ellipsis'> {
  if (totalPages <= 0) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const range: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }
  const out: Array<number | 'ellipsis'> = [];
  let prev: number | undefined;
  for (const i of range) {
    if (prev !== undefined) {
      if (i - prev === 2) {
        out.push(prev + 1);
      } else if (i - prev > 1) {
        out.push('ellipsis');
      }
    }
    out.push(i);
    prev = i;
  }
  return out;
}
