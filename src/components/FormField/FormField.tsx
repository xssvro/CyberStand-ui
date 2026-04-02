import React from 'react';
import { useFormContext } from '../Form/FormContext';
import { CheckboxGroup } from '../Checkbox/CheckboxGroup';
import { Input } from '../Input/Input';
import { RadioGroup } from '../Radio/RadioGroup';
import { Select } from '../Select/Select';
import { Switch } from '../Switch/Switch';
import { Textarea } from '../Textarea/Textarea';
import { Label } from './Label';
import styles from './FormField.module.css';

export type FormFieldLayout = 'vertical' | 'horizontal';

export interface FormFieldProps {
  /** 标签文案 */
  label?: React.ReactNode;
  /** 控件或组根节点 `id`；未传则内部生成 */
  id?: string;
  /** 辅助说明（非错误） */
  description?: React.ReactNode;
  /** 错误文案：`aria-invalid`；Input/Textarea/Select/Switch → `color="error"`；CheckboxGroup/RadioGroup → `invalid` */
  error?: React.ReactNode;
  /** 标签旁必填星号 */
  required?: boolean;
  /** 标签与控件布局 */
  layout?: FormFieldLayout;
  /** `layout="horizontal"` 时标签列宽度 */
  labelWidth?: string | number;
  /** 整项禁用样式；会合并到子控件 `disabled` */
  disabled?: boolean;
  /** 单个子节点：Input / Textarea / Select / Switch / CheckboxGroup / RadioGroup */
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
  if (t === Input || t === Textarea || t === Select || t === Switch) return true;
  if (typeof t === 'function') {
    const n = (t as { displayName?: string }).displayName;
    return n === 'Input' || n === 'Textarea' || n === 'Select' || n === 'Switch';
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

/** 支持 `size` 且可由 Form 上下文注入的单控件 */
function supportsStandSize(el: React.ReactElement): boolean {
  const t = el.type;
  if (t === Input || t === Textarea || t === Select || t === Switch) return true;
  if (typeof t === 'function') {
    const n = (t as { displayName?: string }).displayName;
    return n === 'Input' || n === 'Textarea' || n === 'Select' || n === 'Switch';
  }
  return false;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField(
    {
      label,
      id: idProp,
      description,
      error,
      required = false,
      layout: layoutProp,
      labelWidth,
      disabled: disabledProp = false,
      children,
      className = '',
      style,
    },
    ref
  ) {
    const formCtx = useFormContext();
    const layout = layoutProp ?? formCtx?.layout ?? 'vertical';
    const disabled = disabledProp || (formCtx?.disabled ?? false);

    const uid = React.useId();
    const baseId = idProp ?? `su-field-${sanitizeDomId(uid)}`;
    const groupLabelId = `${baseId}-label`;
    const descriptionId = `${baseId}-description`;
    const errorId = `${baseId}-error`;

    const hasDescription = description != null && description !== false;
    const hasError = error != null && error !== false;

    const describedBy = mergeDescribedBy(
      undefined,
      hasDescription ? descriptionId : undefined,
      hasError ? errorId : undefined
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
        groupLabelId
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
        {error}
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
          className={joinClasses(styles.root, styles.horizontal, disabled && styles.disabled, className)}
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
  }
);

FormField.displayName = 'FormField';
