# Tooltip 文字提示 - AI 使用指南

悬停或键盘聚焦时展示的轻量说明，**Portal** 到 `body`（或 `getPopupContainer`），`z-index` 为 **`--su-z-tooltip`**。

## 快速开始

```tsx
import { Tooltip } from 'stand-ui/components/Tooltip';
import { Button } from 'stand-ui/components/Button';

<Tooltip title="保存到云端">
  <Button size="sm">保存</Button>
</Tooltip>
```

## 行为说明

- **触发**：触发器外层为 `span`（`inline-flex`），在 **`pointerenter` / `pointerleave`** 与 **`focus` / `blur`**（冒泡）上调度显示/隐藏；默认 **进入延迟 100ms**、**离开延迟 60ms**，减少闪烁并略缓冲移出时的间隙。
- **动效**：`opacity` + 按 `placement` 的微位移（约 6px）过渡约 **0.14s**；入场用双 `requestAnimationFrame` 保证有过起始帧；退场在 `opacity` 的 `transitionend`（及超时兜底）后再卸载 Portal。`prefers-reduced-motion: reduce` 时无过渡、退场立即卸浮层。
- **无障碍**：显示时为触发器设置 **`aria-describedby`** 指向气泡 `id`；气泡为 **`role="tooltip"`**。请保证触发区内有可聚焦控件时由该控件获得焦点（焦点事件会冒泡到外层）。
- **键盘**：打开时 **`Escape`** 关闭（捕获阶段，避免与内部组件冲突）。
- **禁用**：`disabled` 为 `true` 时不展示提示、不挂事件，仅渲染包裹层。**原生禁用控件**默认不冒泡指针事件，悬停 Tooltip 时请在子按钮上加 **`style={{ pointerEvents: 'none' }}`**（或等价 class），由外层触发器 `span` 接收悬停。
- **定位**：`placement` 为 `top` | `bottom` | `left` | `right`，按视口 **`fixed`** 定位并做边距夹紧；**滚动/缩放**时跟随更新。
- **样式**：浅色 / 暗色主题 Tooltip 均为**深色近黑底 + 浅色字**（`--su-tooltip-bg` / `--su-tooltip-fg`，见 `vars.css`）；暗色下背景略更深（`#0a0b0f`）以便浮在页面冷灰底上仍像「黑条」。

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `React.ReactNode` | （必填） | 提示内容；空字符串不渲染气泡 |
| `children` | `React.ReactNode` | （必填） | 触发区域 |
| `placement` | `top` / `bottom` / `left` / `right` | `top` | 相对触发器优先方位 |
| `disabled` | `boolean` | `false` | 为 true 时不显示 |
| `mouseEnterDelay` | `number` | `100` | 显示前延迟（ms） |
| `mouseLeaveDelay` | `number` | `60` | 隐藏前延迟（ms） |
| `className` | `string` | - | 触发器外层 |
| `overlayClassName` | `string` | - | 气泡节点 |
| `getPopupContainer` | `() => HTMLElement` | `document.body` | Portal 容器 |
| `zIndex` | `number` | - | 覆盖整层 z-index |

## 与 Popover / Modal

| 场景 | 建议 |
|------|------|
| 一词一句说明、图标按钮释义 | **Tooltip** |
| 可交互浮层（菜单、表单） | **Popover**（若已有）或 **Dropdown** |
| 阻断操作 | **Modal** |

## 样式覆盖

气泡使用 `Tooltip.module.css` 中 `.tooltip`，可通过 **`overlayClassName`** 或全局覆盖 **`--su-tooltip-bg` / `--su-tooltip-fg`**。
