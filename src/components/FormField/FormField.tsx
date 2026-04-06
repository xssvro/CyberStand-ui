import React from 'react';
import type { FormRule } from '../Form/formRules';
import { useFormContext } from '../Form/FormContext';
import { useFormRulesStore } from '../Form/FormRulesContext';
import { CheckboxGroup } from '../Checkbox/CheckboxGroup';
import { DatePicker } from '../DatePicker/DatePicker';
import { Input } from '../Input/Input';
import { RadioGroup } from '../Radio/RadioGroup';
import { Select } from '../Select/Select';
import { Switch } from '../Switch/Switch';
import { Textarea } from '../Textarea/Textarea';
import { Label } from './Label';
import styles from './FormField.module.css';

export type FormFieldLayout = 'vertical' | 'horizontal';

export interface FormFieldProps {
  label?: React.ReactNode;
  id?: string;
  description?: React.ReactNode;
  error?: React.ReactNode;
  name?: string;
  rules?: FormRule[];
  getValue?: () => unknown;
  required?: boolean;
  layout?: FormFieldLayout;
  labelWidth?: string | number;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function sanitizeDomId(raw: string): string {
  return raw.replace(/:/g, '');
}

function mergeDescribedBy(
  existing: string | undefined,
  ...ids: Array<string | undefined>
): string | undefined {
  const merged = [existing, ...ids].filter(Boolean).join(' ').trim();
  return merged || undefined;
}

function isColorField(el: React.ReactElement): boolean {
  const t = el.type;
  if (t === Input || t === Textarea || t === Select || t === Switch || t === DatePicker)
    return true;
  if (typeof t === 'function') {
    const n = (t as { displayName?: string }).displayName;
    return (
      n === 'Input' || n === 'Textarea' || n === 'Select' || n === 'Switch' || n === 'DatePicker'
    );
  }
  return false;
}

function isCheckboxGroup(el: React.ReactElement): boolean {
  const t = el.type;
  if (t === CheckboxGroup) return true;
  return typeof t === 'function' && (t as { displayName?: string }).displayName === 'CheckboxGroup';
}

function isRadioGroup(el: React.ReactElement): boolean {
  const t = el.type;
  if (t === RadioGroup) return true;
  return typeof t === 'function' && (t as { displayName?: string }).displayName === 'RadioGroup';
}

function supportsStandSize(el: React.ReactElement): boolean {
  const t = el.type;
  if (t === Input || t === Textarea || t === Select || t === Switch || t === DatePicker)
    return true;
  if (typeof t === 'function') {
    const n = (t as { displayName?: string }).displayName;
    return (
      n === 'Input' || n === 'Textarea' || n === 'Select' || n === 'Switch' || n === 'DatePicker'
    );
  }
  return false;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  {
    label,
    id: idProp,
    description,
    error,
    name,
    rules,
    getValue,
    required = false,
    layout: layoutProp,
    labelWidth,
    disabled: disabledProp = false,
    children,
    className = '',
    style,
  },
  ref,
) {
  const formCtx = useFormContext();
  const rulesStore = useFormRulesStore();
  const layout = layoutProp ?? formCtx?.layout ?? 'vertical';
  const disabled = disabledProp || (formCtx?.disabled ?? false);

  React.useEffect(() => {
    if (!name || !rulesStore) return;
    rulesStore.registerField(name, { rules: rules ?? [], getValue });
    return () => rulesStore.unregisterField(name);
  }, [name, rulesStore, rules, getValue]);

  const uid = React.useId();
  const baseId = idProp ?? `su-field-${sanitizeDomId(uid)}`;
  const groupLabelId = `${baseId}-label`;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;

  const hasDescription = description != null && description !== false;
  const ruleErr = name && rulesStore ? rulesStore.getFieldError(name) : undefined;
  const mergedError = error !== undefined ? error : ruleErr;
  const hasError = mergedError != null && mergedError !== false && mergedError !== '';

  const describedBy = mergeDescribedBy(
    undefined,
    hasDescription ? descriptionId : undefined,
    hasError ? errorId : undefined,
  );

  const child = React.Children.only(children) as React.ReactElement<{
    id?: string;
    color?: string;
    size?: string;
    disabled?: boolean;
    invalid?: boolean;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
    'aria-labelledby'?: string;
  }>;

  const choiceGroup = isCheckboxGroup(child) || isRadioGroup(child);
  const colorField = isColorField(child);

  const controlProps: Record<string, unknown> = {
    id: baseId,
    disabled: disabled ? true : child.props.disabled,
    'aria-invalid': hasError ? true : child.props['aria-invalid'],
    'aria-describedby': mergeDescribedBy(child.props['aria-describedby'], describedBy),
  };

  if (choiceGroup && label != null && label !== false) {
    controlProps['aria-labelledby'] = mergeDescribedBy(
      child.props['aria-labelledby'],
      groupLabelId,
    );
  }

  if (hasError && colorField) {
    controlProps.color = 'error';
  }

  if (hasError && choiceGroup) {
    controlProps.invalid = true;
  }

  if (formCtx && child.props.size === undefined && supportsStandSize(child)) {
    controlProps.size = formCtx.size;
  }

  const controlMerged = React.cloneElement(child, controlProps);

  const labelNode =
    label != null && label !== false ? (
      <Label
        tag={choiceGroup ? 'span' : 'label'}
        id={choiceGroup ? groupLabelId : undefined}
        htmlFor={choiceGroup ? undefined : baseId}
        required={required}
        disabled={disabled}
      >
        {label}
      </Label>
    ) : null;

  const effectiveLayout: FormFieldLayout =
    layout === 'horizontal' && labelNode == null ? 'vertical' : layout;

  const descriptionNode = hasDescription ? (
    <div id={descriptionId} className={styles.description}>
      {description}
    </div>
  ) : null;

  const errorNode = hasError ? (
    <div id={errorId} className={styles.error} role="alert">
      {mergedError}
    </div>
  ) : null;

  const rootStyle = {
    ...style,
    ...(effectiveLayout === 'horizontal' && labelWidth !== undefined
      ? {
          ['--su-form-label-width' as string]:
            typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth,
        }
      : {}),
  } as React.CSSProperties;

  if (effectiveLayout === 'horizontal') {
    return (
      <div
        ref={ref}
        className={joinClasses(
          styles.root,
          styles.horizontal,
          disabled && styles.disabled,
          className,
        )}
        style={rootStyle}
      >
        {labelNode && <div className={styles.labelWrap}>{labelNode}</div>}
        <div className={styles.controlCol}>
          <div className={styles.control}>{controlMerged}</div>
          {descriptionNode}
          {errorNode}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={joinClasses(styles.root, disabled && styles.disabled, className)}
      style={rootStyle}
    >
      {labelNode}
      <div className={styles.control}>{controlMerged}</div>
      {descriptionNode}
      {errorNode}
    </div>
  );
});

FormField.displayName = 'FormField';
