# Form - AI 使用指南

**Form**：原生 **`<form>`** + **`FormContext`**，为子树提供默认 **`layout` / `size` / `disabled`**。**`FormField`** 会读取上下文：未在字段上写的属性继承表单级配置；字段上显式传入的优先级更高。

**不绑定** react-hook-form / Zod；校验与提交逻辑在 **`onSubmit`** 或受控 state 中自行处理。需要 RHF 时把 **`Form`** 当普通 **`form`** 使用即可（`handleSubmit` 包一层）。

实现以 `Form.tsx`、`FormContext.tsx`、`Form.module.css` 为准。

---

## 快速开始

```tsx
import { Form } from 'stand-ui/components/Form';
// 或
import { Form } from 'stand-ui/components';
```

```tsx
<Form
  onSubmit={(e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    // ...
  }}
>
  <FormField label="名称" required>
    <Input name="title" required />
  </FormField>
  <Button type="submit" color="primary">
    保存
  </Button>
</Form>
```

根节点使用 **`display: flex; flex-direction: column; gap`**，子级 **`FormField`** 之间纵向留白；提交区常用 **`Stack direction="row" justify="end"`** 与表单项并列在 **`Form`** 内。

---

## Props

继承 **`React.FormHTMLAttributes<HTMLFormElement>`**（如 **`onSubmit`**、**`className`**、**`noValidate`**），另：

| 属性 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `layout` | `vertical` \| `horizontal` | `vertical` | 子级 **`FormField`** 默认布局；单字段可用 **`layout`** 覆盖 |
| `size` | `Size`（与 `stand.ts` 一致） | `md` | 子级 **`Input` / `Textarea` / `Select` / `Switch`** 在未自设 **`size`** 时注入 |
| `disabled` | `boolean` | `false` | 与子项 **`disabled`** 合并（字段 **`disabled={true}`** 仍为禁用） |

---

## `useFormContext`

在 **`Form`** 外为 **`null`**；在 **`Form`** 内为当前值。自定义表单项若需与表单 **`size`** 对齐可自行读取：

```tsx
import { useFormContext } from 'stand-ui/components/Form';

function MyControl() {
  const ctx = useFormContext();
  const size = ctx?.size ?? 'md';
  // ...
}
```

---

## 与 `FormSection`

**`FormSection`** 负责分组语义（**`fieldset` / `legend`**）；**`Form`** 负责整表与上下文。可嵌套：**`Form` > `FormSection` > `FormField`**。

---

## CSS 变量

| 变量 | 说明 |
|------|------|
| `--su-form-gap` | 根容器子项间距，默认回退 **`--su-space-4`** |
