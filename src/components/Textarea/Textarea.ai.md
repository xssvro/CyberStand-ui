# Textarea 多行输入 - AI 使用指南

与 **Input** 共用 **Stand** 语义：**`size` / `color` / `radius` / `disabled` / `readOnly`**；外框 token、聚焦环与 **error** 描边与 Input 一致。`onChange` 签名为 **`(value: string, e)`**。

实现以 `Textarea.tsx`、`Textarea.module.css` 为准。

---

## 快速开始

```tsx
import { Textarea } from 'stand-ui/components/Textarea';
// 或
import { Textarea } from 'stand-ui/components';
```

```tsx
<Textarea placeholder="请输入" rows={4} />
<Textarea resize="none" rows={2} />
```

---

## Props

| 属性 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `rows` | `number` | `4` | 行数 |
| `resize` | `vertical` \| `none` \| `both` | `vertical` | 拖拽调整 |
| `value` / `defaultValue` / `placeholder` | — | — | 同原生 |
| `onChange` | `(value, e) => void` | — | |
| `size` / `color` / `radius` | 同 Stand | `md` / `default` / `md` | |
| `disabled` / `readOnly` / `required` | `boolean` | — | |
| `maxLength` / `minLength` / `name` | — | — | 透传 `textarea` |
| `autoComplete` | `string` | **`off`** | 未传时默认关闭自动填充 |

无障碍相关 **`id` / `aria-*`** 透传至原生 **`textarea`**。

---

## 与 FormField

存在 **`error`** 时，FormField 会注入 **`color="error"`**，展示非聚焦错误描边。

```tsx
<FormField label="备注" description="选填">
  <Textarea rows={3} placeholder="补充说明" />
</FormField>
```

---

## 文件位置

`src/components/Textarea/`
