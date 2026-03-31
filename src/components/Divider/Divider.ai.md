# Divider / Separator - AI 使用指南

**Divider**：视觉分割，默认 **`decorative={true}`**（`aria-hidden`，适合纯排版留白）。  
**Separator**：语义分割，等价于 **`Divider` + `decorative={false}`**，暴露 **`role="separator"`** 与 **`aria-orientation`**，适合菜单、工具栏等需读屏识别的区隔。

## 导入

```tsx
import { Divider, Separator } from 'stand-ui/components/Divider';
// 或从包入口
import { Divider, Separator } from 'stand-ui/components';
```

## Props（Divider）

| 属性 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 方向；有 `children` 时仅横向有效 |
| `variant` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | 线型 |
| `spacing` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 外边距阶梯 |
| `color` | `'default' \| 'subtle'` | `'default'` | 线色 |
| `titleAlign` | `'start' \| 'center' \| 'end'` | `'center'` | 有 `children` 时文案与线对齐 |
| `decorative` | `boolean` | `true` | `false` 时与 Separator 语义一致 |
| `children` | `ReactNode` | — | 中间文案（仅横向） |
| `className` / `style` | — | — | 扩展样式 |

**Separator** 继承除 `decorative` 外的 props，且固定 **`decorative={false}`**；默认 **`spacing="md"`**。

## 横向与带文案

```tsx
<Divider />
<Divider variant="dashed" />
<Divider variant="dotted" spacing="lg" />
<Divider color="subtle">或</Divider>
<Divider titleAlign="start">左对齐文案</Divider>
```

## 纵向（父级建议 `display: flex; flex-direction: row`）

```tsx
<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', minHeight: 120 }}>
  <span>左栏</span>
  <Divider orientation="vertical" />
  <span>右栏</span>
</div>
```

## 无障碍与选型

- 仅装饰、不需播报：用 **`Divider`**（默认）。
- 需明确「此处为分隔」：用 **`Separator`**，或 **`Divider decorative={false}`**。
- 带 `children` 的横向分割在语义模式下仍为 `role="separator"`，中间文案为可见标签。
