import { runRules, type FormRule } from './formRules';

export type FormFieldGetter = () => unknown;

export interface FormFieldRegistration {
  rules: FormRule[];
  getValue?: FormFieldGetter;
}

export interface SetFieldErrorPayload {
  errors?: string[];
}

export class FormValidateError extends Error {
  readonly errorFields: { name: string; errors: string[] }[];
  readonly values: Record<string, unknown>;

  constructor(errorFields: { name: string; errors: string[] }[], values: Record<string, unknown>) {
    super('Validation failed');
    this.name = 'FormValidateError';
    this.errorFields = errorFields;
    this.values = values;
  }
}

function formDataGet(name: string, fd: FormData): unknown {
  const all = fd.getAll(name);
  if (all.length === 0) return '';
  if (all.length === 1) {
    const x = all[0];
    return x instanceof File ? x : String(x);
  }
  return all.map((x) => (x instanceof File ? x : String(x)));
}

export function getFieldsValueFromForm(el: HTMLFormElement | null): Record<string, unknown> {
  if (!el) return {};
  const fd = new FormData(el);
  const out: Record<string, unknown> = {};
  const keys = new Set<string>();
  fd.forEach((_v, k) => keys.add(k));
  keys.forEach((key) => {
    out[key] = formDataGet(key, fd);
  });
  return out;
}

export interface FormInstance {
  validateFields: (nameList?: string[]) => Promise<Record<string, unknown>>;
  getFieldsValue: () => Record<string, unknown>;
  resetFields: (nameList?: string[]) => void;
  setFields: (fields: Record<string, SetFieldErrorPayload>) => void;
  getFieldError: (name: string) => string | undefined;
  clearErrors: () => void;
}

type ErrorListener = (errors: Record<string, string>) => void;

export class FormStore implements FormInstance {
  private formEl: HTMLFormElement | null = null;
  private registry = new Map<string, FormFieldRegistration>();
  private errors: Record<string, string> = {};
  private errorListeners = new Set<ErrorListener>();

  subscribeErrors(listener: ErrorListener): () => void {
    this.errorListeners.add(listener);
    listener(this.errors);
    return () => this.errorListeners.delete(listener);
  }

  private notifyErrors(): void {
    const snap = { ...this.errors };
    this.errorListeners.forEach((fn) => fn(snap));
  }

  /** 由 Form 根节点挂载时调用 */
  attach(el: HTMLFormElement | null): void {
    this.formEl = el;
  }

  registerField(name: string, registration: FormFieldRegistration): void {
    this.registry.set(name, registration);
  }

  unregisterField(name: string): void {
    this.registry.delete(name);
    if (this.errors[name] !== undefined) {
      const next = { ...this.errors };
      delete next[name];
      this.errors = next;
      this.notifyErrors();
    }
  }

  getFieldError(name: string): string | undefined {
    return this.errors[name];
  }

  clearErrors(): void {
    this.errors = {};
    this.notifyErrors();
  }

  setFields(fields: Record<string, SetFieldErrorPayload>): void {
    const next = { ...this.errors };
    for (const [name, payload] of Object.entries(fields)) {
      const first = payload.errors?.[0];
      if (first) next[name] = first;
      else delete next[name];
    }
    this.errors = next;
    this.notifyErrors();
  }

  getFieldsValue(): Record<string, unknown> {
    return getFieldsValueFromForm(this.formEl);
  }

  resetFields(nameList?: string[]): void {
    this.formEl?.reset();
    if (!nameList?.length) {
      this.errors = {};
    } else {
      const next = { ...this.errors };
      nameList.forEach((n) => delete next[n]);
      this.errors = next;
    }
    this.notifyErrors();
  }

  async validateFields(nameList?: string[]): Promise<Record<string, unknown>> {
    const el = this.formEl;
    if (!el) {
      throw new FormValidateError([], {});
    }
    const fd = new FormData(el);
    const names =
      nameList === undefined
        ? Array.from(this.registry.keys())
        : nameList.length > 0
          ? nameList
          : [];

    const nextErrors = { ...this.errors };
    const errorFields: { name: string; errors: string[] }[] = [];

    for (const n of names) {
      delete nextErrors[n];
      const reg = this.registry.get(n);
      const rules = reg?.rules ?? [];
      let value: unknown;
      if (reg?.getValue) {
        try {
          value = reg.getValue();
        } catch {
          value = undefined;
        }
      } else {
        value = formDataGet(n, fd);
      }

      const msg = await runRules(value, rules);
      if (msg) {
        nextErrors[n] = msg;
        errorFields.push({ name: n, errors: [msg] });
      }
    }

    this.errors = nextErrors;
    this.notifyErrors();

    const values = this.getFieldsValue();
    if (errorFields.length > 0) {
      throw new FormValidateError(errorFields, values);
    }
    return values;
  }
}
