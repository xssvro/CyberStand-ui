# Switch 开关 - AI 使用指南

**`role="switch"`** 的按钮实现，支持键盘 **Space / Enter** 切换；可选 **`name` + 隐藏域** 参与原生表单提交。与 **FormField** 组合时由 FormField 注入 **`color="error"`**（错误描边 + 语义色轨）。

实现见 `Switch.tsx`、`Switch.module.css`。

---

## 快速开始

```tsx
import { Switch } from 'stand-ui/components/Switch';
// 或
import { Switch } from 'stand-ui/components';
```

```tsx
<Switch defaultChecked onCheckedChange={(v) => console.log(v)} />
<Switch label="启用通知" />
```

---

## Props

| 属性 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `checked` / `defaultChecked` | `boolean` | 非受控默认 `false` | 受控 / 非受控 |
| `onCheckedChange` | `(checked, e) => void` | — | |
| `disabled` | `boolean` | `false` | 禁用 |
| `readOnly` | `boolean` | `false` | 不可切换，仍可聚焦；`aria-readonly` |
| `size` | `sm` \| `md` | `md` | |
| `color` | `default` \| `error` | `default` | FormField 有 `error` 时注入 `error` |
| `label` | `ReactNode` | — | 轨右侧文案 |
| `name` | `string` | — | 存在时渲染隐藏 `input[name]`，`checked` 时值为 `value` |
| `value` | `string` | `on` | 开态时隐藏域取值 |
| `id` | `string` | 内部生成 | 与 FormField `Label` 的 `htmlFor` 对齐 |

其余 **`button`** 可透传属性（如 `aria-*`、`className` 等）；根节点为 **`div`**，自定义宽度可写在根 `className`。

---

## 与 FormField

```tsx
<FormField label="推送通知" description="关闭后不再收到消息">
  <Switch defaultChecked />
</FormField>

<FormField label="公开资料" error="请先同意条款">
  <Switch />
</FormField>
```

---

## 文件位置

`src/components/Switch/`
