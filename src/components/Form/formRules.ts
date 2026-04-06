export interface FormRule {
  required?: boolean;
  message?: string;
  whitespace?: boolean;
  len?: number;
  min?: number;
  max?: number;
  pattern?: RegExp | string;
  type?: 'string' | 'number' | 'email' | 'url';
  validator?: (
    rule: FormRule,
    value: unknown,
  ) => void | string | undefined | Promise<void | string | undefined>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const URL_RE = /^https?:\/\/.+/i;

function normalizeScalar(value: unknown): string {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map(String).join(',');
  return String(value);
}

function toNumber(value: unknown): number | null {
  if (value == null || value === '') return null;
  const n = Number(typeof value === 'string' ? value.trim() : value);
  return Number.isFinite(n) ? n : null;
}

export async function runRules(
  value: unknown,
  rules: FormRule[] | undefined,
): Promise<string | undefined> {
  if (!rules?.length) return undefined;

  for (const rule of rules) {
    const msg = await applyRule(rule, value);
    if (msg) return msg;
  }
  return undefined;
}

async function applyRule(rule: FormRule, value: unknown): Promise<string | undefined> {
  let v = value;

  if (rule.whitespace && typeof v === 'string') {
    v = v.trim();
  }

  if (rule.required) {
    const empty =
      v == null ||
      v === '' ||
      (Array.isArray(v) && v.length === 0) ||
      (typeof v === 'string' && rule.whitespace && v.trim() === '');
    if (empty) {
      return rule.message ?? '此项为必填';
    }
  }

  if (rule.len != null) {
    const n = Array.isArray(v) ? v.length : normalizeScalar(v).length;
    if (n !== rule.len) {
      return rule.message ?? `长度须为 ${rule.len} 个字符`;
    }
  }

  if (rule.min != null || rule.max != null) {
    if (rule.type === 'number' || (typeof v === 'number' && !Number.isNaN(v))) {
      const num = typeof v === 'number' ? v : toNumber(v);
      if (num == null) {
        return rule.message ?? '请输入有效数字';
      }
      if (rule.min != null && num < rule.min) {
        return rule.message ?? `不能小于 ${rule.min}`;
      }
      if (rule.max != null && num > rule.max) {
        return rule.message ?? `不能大于 ${rule.max}`;
      }
    } else {
      const s = normalizeScalar(v);
      const len = Array.isArray(v) ? v.length : s.length;
      if (rule.min != null && len < rule.min) {
        return rule.message ?? `至少 ${rule.min} 个字符`;
      }
      if (rule.max != null && len > rule.max) {
        return rule.message ?? `至多 ${rule.max} 个字符`;
      }
    }
  }

  if (rule.type === 'email') {
    const s = normalizeScalar(v);
    if (s && !EMAIL_RE.test(s)) {
      return rule.message ?? '邮箱格式不正确';
    }
  }

  if (rule.type === 'url') {
    const s = normalizeScalar(v);
    if (s && !URL_RE.test(s)) {
      return rule.message ?? 'URL 格式不正确';
    }
  }

  if (rule.pattern != null) {
    const s = normalizeScalar(v);
    if (s) {
      const re = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern;
      if (!re.test(s)) {
        return rule.message ?? '格式不正确';
      }
    }
  }

  if (rule.validator) {
    const out = await rule.validator(rule, v);
    if (typeof out === 'string' && out.length > 0) return out;
  }

  return undefined;
}
