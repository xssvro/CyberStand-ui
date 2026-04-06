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

/** 从 `yyyy-mm-dd` 或 `yyyy-mm-ddTHH:mm` 等串取出日期键 `yyyy-mm-dd` */
export function extractISODateKey(s: string): string | null {
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(s.trim());
  if (!m) return null;
  return parseISODate(m[1]) ? m[1] : null;
}

/**
 * 仅按日期键比较（忽略同一天上的时间），适合 DatePicker 与 `min`/`max` 带 `T` 的写法。
 */
export function isDateKeyInRange(dayIso: string, min?: string, max?: string): boolean {
  const minKey = min ? extractISODateKey(min) : null;
  const maxKey = max ? extractISODateKey(max) : null;
  if (minKey && dayIso < minKey) return false;
  if (maxKey && dayIso > maxKey) return false;
  return true;
}

function localDateTimeToMs(dateIso: string, timeStr: string): number | null {
  const p = parseISOTime(timeStr);
  if (!p) return null;
  const d = parseISODate(dateIso);
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), p.h, p.m, p.sec).getTime();
}

function tryParseBoundaryDateTime(s: string): { date: string; time: string } | null {
  return parseISODateTime(s.trim().replace(' ', 'T'));
}

/** 用于面板提示：`min`/`max` 展示为短文案 */
export function formatBoundaryHint(s: string, locale = 'zh-CN'): string {
  const p = parseISODateTime(s.trim().replace(' ', 'T'));
  if (p) {
    const [Y, M, D] = p.date.split('-').map(Number);
    const [hh, mm, ss] = p.time.split(':').map(Number);
    const d = new Date(Y, M - 1, D, hh, mm, ss || 0);
    return d.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  const d = parseISODate(s.trim());
  if (d) {
    return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return s.trim();
}

/** `min` 边界对应的本地时间戳：纯日期为当日 0:00，带时间为精确时刻 */
export function parseMinBoundaryMs(s: string): number | null {
  const dt = tryParseBoundaryDateTime(s);
  if (dt) return localDateTimeToMs(dt.date, dt.time);
  const d = parseISODate(s.trim());
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
}

/** `max` 边界对应的本地时间戳：纯日期为当日 23:59:59.999，带时间为精确时刻 */
export function parseMaxBoundaryMs(s: string): number | null {
  const dt = tryParseBoundaryDateTime(s);
  if (dt) return localDateTimeToMs(dt.date, dt.time);
  const d = parseISODate(s.trim());
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
}

function dayStartMs(dayIso: string): number | null {
  const d = parseISODate(dayIso);
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
}

function dayEndMs(dayIso: string): number | null {
  const d = parseISODate(dayIso);
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
}

/**
 * 该日是否与 [min,max] 存在任意可取的本地时刻（用于 DateTimePicker 月历格禁用逻辑）。
 */
export function isDayPartiallyInDateTimeRange(dayIso: string, min?: string, max?: string): boolean {
  const d0 = dayStartMs(dayIso);
  const d1 = dayEndMs(dayIso);
  if (d0 == null || d1 == null) return false;
  const lo = min != null ? parseMinBoundaryMs(min) : null;
  const hi = max != null ? parseMaxBoundaryMs(max) : null;
  if (lo != null && lo > d1) return false;
  if (hi != null && hi < d0) return false;
  return true;
}

function valueStringToMs(value: string, withSeconds: boolean): number | null {
  const t = value.trim().replace(' ', 'T');
  let p = parseISODateTime(t);
  if (!p) {
    const m = /^(\d{4}-\d{2}-\d{2})$/.exec(value.trim());
    if (m && parseISODate(m[1])) {
      p = { date: m[1], time: withSeconds ? '00:00:00' : '00:00' };
    }
  }
  if (!p) return null;
  let time = p.time;
  if (time.length === 5 && withSeconds) time = `${time}:00`;
  return localDateTimeToMs(p.date, time);
}

/** 将本地日期时间串钳制在 [min,max]（含端点）；无法解析则原样返回 */
export function clampDateTimeString(
  raw: string,
  min?: string,
  max?: string,
  withSeconds = false,
): string {
  const ms = valueStringToMs(raw, withSeconds);
  if (ms == null) return raw;
  const lo = min != null ? parseMinBoundaryMs(min) : null;
  const hi = max != null ? parseMaxBoundaryMs(max) : null;
  let m = ms;
  if (lo != null) m = Math.max(m, lo);
  if (hi != null) m = Math.min(m, hi);
  if (m === ms) return raw;
  const d = new Date(m);
  const date = toISODate(d);
  const time = formatISOTime(d.getHours(), d.getMinutes(), d.getSeconds(), withSeconds);
  return joinISODateTime(date, time);
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

/** `HH:mm` 或 `HH:mm:ss` */
export function parseISOTime(s: string): { h: number; m: number; sec: number } | null {
  const m = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(s.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  const sec = m[3] !== undefined ? Number(m[3]) : 0;
  if (h < 0 || h > 23 || min < 0 || min > 59 || sec < 0 || sec > 59) return null;
  return { h, m: min, sec };
}

export function formatISOTime(h: number, m: number, sec = 0, withSeconds = false): string {
  return withSeconds
    ? `${pad2(h)}:${pad2(m)}:${pad2(sec)}`
    : `${pad2(h)}:${pad2(m)}`;
}

/** `yyyy-mm-ddTHH:mm` 或带秒、或空格分隔 */
export function parseISODateTime(s: string): { date: string; time: string } | null {
  const t = s.trim();
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}(?::\d{2})?)$/.exec(t);
  if (!m) return null;
  const date = m[1];
  const time = m[2];
  if (!parseISODate(date)) return null;
  if (!parseISOTime(time)) return null;
  return { date, time };
}

export function joinISODateTime(dateIso: string, timeStr: string): string {
  return `${dateIso}T${timeStr}`;
}

/** 起止日期均为 `yyyy-mm-dd`，空串表示未选 */
export type DateRangeISO = { start: string; end: string };

export function normalizeDateRangeISO(start: string, end: string): DateRangeISO {
  const s = start.trim();
  const e = end.trim();
  if (!s && !e) return { start: '', end: '' };
  if (s && !e) return parseISODate(s) ? { start: s, end: '' } : { start: s, end: '' };
  if (!s && e) return parseISODate(e) ? { start: e, end: '' } : { start: e, end: '' };
  if (!parseISODate(s) || !parseISODate(e)) return { start: s, end: e };
  return s <= e ? { start: s, end: e } : { start: e, end: s };
}

export function isCompleteDateRange(r: DateRangeISO): boolean {
  return Boolean(r.start && r.end && parseISODate(r.start) && parseISODate(r.end));
}

/** 单一隐藏域：`yyyy-mm-dd/yyyy-mm-dd` */
export function formatDateRangeSlash(r: DateRangeISO): string {
  if (!r.start && !r.end) return '';
  if (r.start && r.end) return `${r.start}/${r.end}`;
  return r.start || r.end;
}

export function parseDateRangeSlash(raw: string): DateRangeISO {
  const t = raw.trim();
  if (!t) return { start: '', end: '' };
  const i = t.indexOf('/');
  if (i === -1) return normalizeDateRangeISO(t, '');
  return normalizeDateRangeISO(t.slice(0, i), t.slice(i + 1));
}

export function clampDateRangeToBounds(
  r: DateRangeISO,
  min?: string,
  max?: string,
): DateRangeISO {
  if (!isCompleteDateRange(r)) return r;
  let { start, end } = r;
  const minKey = min ? extractISODateKey(min) : null;
  const maxKey = max ? extractISODateKey(max) : null;
  if (minKey) {
    if (start < minKey) start = minKey;
    if (end < minKey) end = minKey;
  }
  if (maxKey) {
    if (end > maxKey) end = maxKey;
    if (start > maxKey) start = maxKey;
  }
  return normalizeDateRangeISO(start, end);
}
