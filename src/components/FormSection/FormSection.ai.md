# FormSection 表单分组 - AI 使用指南

用于把多个表单项归为一组，带**标题**与可选**说明**。

- **`as="fieldset"`（默认）**：语义 **`fieldset` + `legend`**，整组 **`disabled`** 会禁用内部控件。
- **`as="div"`**：**`section` + `role="group"`**，`aria-labelledby` 指向标题；**`disabled`** 通过 `aria-disabled` 与样式模拟（非真正禁用子 input，需自行控制子项 `disabled`）。

实现见 `FormSection.tsx`、`FormSection.module.css`。

---

## 快速开始

```tsx
import { FormSection } from 'stand-ui/components/FormSection';
// 或
import { FormSection } from 'stand-ui/components';
```

```tsx
<FormSection title="账号信息" description="用于登录与安全验证">
  <FormField label="邮箱">
    <Input type="email" />
  </FormField>
  <FormField label="手机">
    <Input type="tel" />
  </FormField>
</FormSection>
```

---

## Props

| 属性                  | 类型                | 默认       | 说明                                                           |
| --------------------- | ------------------- | ---------- | -------------------------------------------------------------- |
| `title`               | `ReactNode`         | **必填**   | 分组标题                                                       |
| `description`         | `ReactNode`         | —          | 说明文案                                                       |
| `as`                  | `fieldset` \| `div` | `fieldset` | 语义与禁用行为见上文                                           |
| `disabled`            | `boolean`           | `false`    | `fieldset`：原生禁用子控件；`div`：整组 `aria-disabled` + 样式 |
| `children`            | `ReactNode`         | **必填**   | 多为 `FormField` 列表                                          |
| `className` / `style` | —                   | —          | 根容器                                                         |

`as="fieldset"` 时其余属性按 **`fieldset`** 透传（如 `name`、`form` 等）。

---

## 文件位置

`src/components/FormSection/`
