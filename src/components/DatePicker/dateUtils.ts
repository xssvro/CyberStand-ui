/** 本地日历日，格式 yyyy-mm-dd（与 input[type=hidden] / 表单一致） */

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const da = Number(m[3]);
  const dt = new Date(y, mo, da);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo || dt.getDate() !== da) return null;
  return dt;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function addMonths(d: Date, delta: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

/** 是否在 [min, max] 内（含端点）；未传边界则视为无限制 */
export function isDateInRange(iso: string, min?: string, max?: string): boolean {
  if (min && iso < min) return false;
  if (max && iso > max) return false;
  return true;
}

export type CalendarCell = {
  date: Date;
  iso: string;
  inCurrentMonth: boolean;
};

/** 从「当月 1 号所在周的起始日（周日）」起连续 42 格 */
export function buildMonthGrid(visibleMonth: Date): CalendarCell[] {
  const y = visibleMonth.getFullYear();
  const m = visibleMonth.getMonth();
  const first = new Date(y, m, 1);
  const startOffset = first.getDay();
  const gridStart = new Date(y, m, 1 - startOffset);
  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push({
      date: d,
      iso: toISODate(d),
      inCurrentMonth: d.getMonth() === m,
    });
  }
  return cells;
}
