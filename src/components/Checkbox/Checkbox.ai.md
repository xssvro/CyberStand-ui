# Checkbox / CheckboxGroup - AI 使用指南

**Checkbox**：自定义复选框 + 可选 **label**。  
**CheckboxGroup**：同一 **`name`** 下多选，**`value: string[]`** 受控；可选 **`horizontal`**、**`invalid`**（FormField 在 **`error`** 时注入）。

样式见 `Checkbox.module.css`；逻辑见 `Checkbox.tsx`、`CheckboxGroup.tsx`。选中态对勾颜色由 **`vars.css` 中 `--su-checkbox-checked-icon` / `--su-checkbox-error-checked-icon`** 按主题切换（例如暗色主色为亮黄时用深色勾，避免白勾不可见）。

---

## 快速开始

```tsx
import { Checkbox, CheckboxGroup } from 'stand-ui/components/Checkbox';
// 或
import { Checkbox, CheckboxGroup } from 'stand-ui/components';
```

```tsx
<Checkbox defaultChecked label="同意条款" />

<CheckboxGroup name="skill" value={['ts']} onValueChange={setSkills}>
  <Checkbox value="ts" label="TypeScript" />
  <Checkbox value="rust" label="Rust" />
</CheckboxGroup>
```

---

## Checkbox Props

| 属性 | 说明 |
|------|------|
| `value` | 在 **CheckboxGroup** 内**必填**，为提交值 |
| `checked` / `defaultChecked` | 单独使用时的受控 / 非受控 |
| `onCheckedChange` | `(checked, e) => void` |
| `label` | 文案 |
| `size` | `sm` \| `md` |
| `color` | `default` \| `error` |
| `name` | 单独使用时原生 `name` |

---

## CheckboxGroup Props

| 属性 | 说明 |
|------|------|
| `name` | 表单字段名 |
| `value` | 已选中的 `value[]` |
| `onValueChange` | `(next: string[]) => void` |
| `invalid` | 为 true 时子 Checkbox 错误描边 |
| `horizontal` | 子项横向排列 |
| `disabled` | 整组禁用 |

---

## 与 FormField

**`error`** 时向 Group 注入 **`invalid`**；标签为 **`span`** + **`aria-labelledby`**，无单一 **`htmlFor`**。

```tsx
<FormField label="通知方式" error="至少选一项">
  <CheckboxGroup name="notify" value={notify} onValueChange={setNotify}>
    <Checkbox value="email" label="邮件" />
    <Checkbox value="sms" label="短信" />
  </CheckboxGroup>
</FormField>
```

---

## 文件位置

`src/components/Checkbox/`
