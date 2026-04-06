# Spinner 组件 - AI 使用指南

旋转加载指示器，与 `Button` `loading`、表格/表单提交态共用同一视觉；默认 `role="status"`，请为仅装饰场景设 `aria-hidden`。

## 快速开始

```tsx
import { Spinner } from 'stand-ui/components/Spinner';

<Spinner />
<Spinner size="sm" color="muted" />
```

## Props

| Prop          | 类型                                        | 默认值                          | 说明                                     |
| ------------- | ------------------------------------------- | ------------------------------- | ---------------------------------------- |
| `size`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'inherit'` | `'md'`                          | `inherit` 时宽高为 `1em`，适合嵌在按钮内 |
| `color`       | `Color \| 'current'`                        | `'current'`                     | `current` 使用 `currentColor`            |
| `className`   | `string`                                    | —                               | 追加类名                                 |
| `style`       | `CSSProperties`                             | —                               | 内联样式                                 |
| `role`        | `string`                                    | `'status'`                      | 可改为 `presentation` 等                 |
| `aria-label`  | `string`                                    | 非 `aria-hidden` 时为「加载中」 | 覆盖读屏文案                             |
| `aria-hidden` | `boolean`                                   | —                               | 为 true 时不设默认 `aria-label`          |

其余 `span` 原生属性可透传。

## 与 Toast

`Spinner` 为**页面内**加载态；全局瞬时通知请用 `toast()`。
