# Skeleton 组件 - AI 使用指南

列表、卡片、表单占位块；**组合使用**，不与具体业务卡片写死耦合。

## 快速开始

```tsx
import { Skeleton } from 'stand-ui/components/Skeleton';

<Skeleton variant="text" />
<Skeleton variant="text" rows={3} />
<Skeleton variant="circle" width={40} height={40} />
<Skeleton variant="rect" height={120} rounded />
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `variant` | `'text' \| 'circle' \| 'rect'` | `'text'` | 形状 |
| `rows` | `number` | `1` | 仅 `text`：多行时末行宽度约 68% |
| `width` | `number \| string` | 见下 | `number` 为像素 |
| `height` | `number \| string` | 见下 | `text` 单行高度由样式默认约 `0.85em` |
| `active` | `boolean` | `true` | 扫光动画；`prefers-reduced-motion` 下自动静止 |
| `rounded` | `boolean` | `false` | 仅 `rect`：更大圆角 |
| `className` | `string` | — | 根节点 |
| `style` | `CSSProperties` | — | 根节点 |

**默认尺寸**：`text` 宽 `100%`；`circle` 默认 `40×40`；`rect` 宽 `100%`、高 `72`（px）。

其余 `div` 属性可透传。

## 与 Loading

`Skeleton` 为**结构占位**；需要阻断交互的加载请用 **`Loading`** 遮罩。
