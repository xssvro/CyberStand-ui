# FormField / Label - AI 使用指南

**FormField**：表单项容器——**标签**、**控件槽（单个子节点）**、**说明**、**错误**；串联 **`id` / `htmlFor`**、**`aria-invalid` / `aria-describedby`**。  
**Label**：可单独使用的标签样式；`tag="span"` 时用于选项组标题（无 `htmlFor`），配合 **`aria-labelledby`**。

实现以 `FormField.tsx`、`Label.tsx`、`FormField.module.css` 为准。存在 **`error`** 时：**Input / Textarea / Select / Switch** 注入 **`color="error"`**；**CheckboxGroup / RadioGroup** 注入 **`invalid`**，子项呈现错误描边。选项组场景下标签为 **`span`** + **`id`**，由子组 **`aria-labelledby`** 引用。

---

## 快速开始

```tsx
import { FormField, Label } from 'stand-ui/components/FormField';
// 或
import { FormField, Label } from 'stand-ui/components';
```

```tsx
<FormField label="邮箱" description="用于登录与找回密码" required>
  <Input type="email" placeholder="you@example.com" />
</FormField>

<FormField label="昵称" error="2～16 个字符">
  <Input placeholder="输入昵称" />
</FormField>
```

---

## `FormField` Props

| 属性                  | 类型                       | 默认     | 说明                                                                                                                                                             |
| --------------------- | -------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`               | `ReactNode`                | —        | 标签；无标签时不渲染 `<label>`                                                                                                                                   |
| `id`                  | `string`                   | 自动生成 | 赋给子控件，并与标签 `htmlFor` 一致                                                                                                                              |
| `description`         | `ReactNode`                | —        | 辅助说明，`id` 为 `{id}-description`                                                                                                                             |
| `error`               | `ReactNode`                | —        | 错误文案，**渲染在控件下方**。**若 `error !== undefined`**（含 `null`）则**优先于** **`rules`** 校验结果；未传 `error` 时展示 **`useForm` + `rules`** 产生的错误 |
| `name`                | `string`                   | —        | 与 **`Form form={instance}`** 配套：字段名，须与子控件 **`name`**（或隐藏域）一致，参与 **`validateFields` / `setFields`**                                       |
| `rules`               | **`FormRule[]`**           | —        | 声明式校验（Ant Design `rules` 子集）；需 **`name`** 且父级 **`Form`** 传入 **`form`**，详见 **`Form.ai.md`**                                                    |
| `getValue`            | `() => unknown`            | —        | 纯受控、**`FormData` 取不到**时在校验阶段提供当前值（如自定义 **`CheckboxGroup` 受控值**）                                                                       |
| `required`            | `boolean`                  | `false`  | 标签旁红色 `*`（装饰；请在控件上设真实 `required`）                                                                                                              |
| `layout`              | `vertical` \| `horizontal` | 见下     | 默认 **`vertical`**；若在 **`Form`** 内且未传本属性，则继承 **`Form` 的 `layout`**                                                                               |
| `labelWidth`          | `string` \| `number`       | —        | 仅 `horizontal`；数字视为 px，写入 `--su-form-label-width`（默认约 `7.5rem`）                                                                                    |
| `disabled`            | `boolean`                  | 见下     | 默认 **`false`**；**`Form disabled`** 时为 **`true`**；与子节点 `disabled` 合并，并弱化整项样式                                                                  |
| `children`            | `ReactNode`                | **必填** | **仅一个** React 元素：`Input` / `Textarea` / `Select` / `Switch` / `CheckboxGroup` / `RadioGroup` 等                                                            |
| `className` / `style` | —                          | —        | 根容器                                                                                                                                                           |

---

## 与子控件的约定

- 子节点须为 **单个元素**（`React.Children.only`）。
- **`error`** 时：**Input / Textarea / Select** 注入 **`color="error"`**；**CheckboxGroup / RadioGroup** 注入 **`invalid`**。
- **CheckboxGroup / RadioGroup**：标签渲染为 **`Label tag="span"`**，`id` 为 `{fieldId}-label`，子组 **`aria-labelledby`** 指向该 id；**无 `htmlFor`**。

---

## `Label` Props

继承 **`HTMLAttributes<HTMLElement>`**，另：

| 属性       | 类型              | 说明                                                    |
| ---------- | ----------------- | ------------------------------------------------------- |
| `tag`      | `label` \| `span` | 默认 `label`；`span` 时不使用 `htmlFor`，用于选项组标题 |
| `htmlFor`  | `string`          | 仅 `tag="label"` 时生效                                 |
| `required` | `boolean`         | 显示星号                                                |
| `disabled` | `boolean`         | 禁用态样式                                              |

```tsx
<Label htmlFor="email" required>
  邮箱
</Label>
<Input id="email" />
```

---

## 与 `Form` 上下文

包在 **`Form`** 内时：

- **`layout` / `disabled`**：字段未传则使用 **`Form`** 上的值；字段显式传入优先。
- **`size`**：**`Input` / `Textarea` / `Select` / `Switch`** 若未设 **`size`**，会注入 **`Form` 的 `size`**；子控件已设 **`size`** 时不覆盖。

```tsx
import { Form } from 'stand-ui/components/Form';

<Form layout="horizontal" size="sm" disabled={submitting}>
  <FormField label="名称" labelWidth={88}>
    <Input name="name" />
  </FormField>
</Form>;
```

---

## 横向布局

```tsx
<FormField label="用户名" layout="horizontal" labelWidth={100} required>
  <Input placeholder="唯一标识" />
</FormField>
```

---

## 可访问性

- 有 **`error`** 时子控件 **`aria-invalid={true}`**；**`aria-describedby`** 会合并说明与错误 **`id`**。
- 必填语义以原生控件 **`required`** 为准；标签上的 `*` 为 **`aria-hidden`** 装饰。

---

## 文件位置

| 内容 | 路径                        |
| ---- | --------------------------- |
| 组件 | `src/components/FormField/` |
