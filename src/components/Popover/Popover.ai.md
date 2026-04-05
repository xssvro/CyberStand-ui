# Popover 气泡卡片 - AI 使用指南

锚点 + **Portal** 的非模态浮层，**可点进内容与操作**；`z-index` 为 **`--su-z-popover`**（高于 Tooltip，低于 Modal）。定位与 **Tooltip** 共用 `computePopperPosition` / `usePopperPosition`。

## 快速开始

```tsx
import { Popover } from 'stand-ui/components/Popover';
import { Button } from 'stand-ui/components/Button';

const [open, setOpen] = useState(false);

<Popover
  open={open}
  onOpenChange={setOpen}
  content={
    <div>
      <p>可放表单、菜单等</p>
      <Button size="sm" type="button" onClick={() => setOpen(false)}>
        关闭
      </Button>
    </div>
  }
>
  <Button type="button" variant="soft" size="sm">
    打开
  </Button>
</Popover>
```

## 行为说明

- **受控**：`open` + `onOpenChange`；点击触发器切换开关。
- **外部点击**：`pointerdown` 捕获阶段，若目标不在触发器与面板内则关闭（`useDismissOnOutsidePress`）。
- **键盘**：`Tab` 在面板内循环（`useFocusTrap`）；**Esc** 关闭（`keyboard` 默认 `true`）。
- **动效**：`opacity` + 微缩放；入场双 `requestAnimationFrame`；退场 `transitionend(opacity)` + 超时后卸 Portal（与 Modal 思路一致）。
- **无障碍**：`role="dialog"`、`aria-modal={false}`；触发器 `aria-expanded`、`aria-controls`。
- **定位**：`placement` 为 `top` / `bottom` / `left` / `right`，滚动与 resize 时更新。

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `open` | `boolean` | （必填） | 是否展开 |
| `onOpenChange` | `(open: boolean) => void` | - | 状态回调 |
| `content` | `React.ReactNode` | （必填） | 浮层内容 |
| `children` | `React.ReactNode` | （必填） | 触发区域 |
| `placement` | `top` / `bottom` / `left` / `right` | `bottom` | 相对锚点 |
| `keyboard` | `boolean` | `true` | Esc 关闭 |
| `className` | `string` | - | 触发器外层 |
| `panelClassName` | `string` | - | 面板 |
| `getPopupContainer` | `() => HTMLElement` | `document.body` | Portal |
| `zIndex` | `number` | - | 覆盖 z-index |

## 与 Tooltip / Modal

| 场景 | 建议 |
|------|------|
| 只读短提示、悬停 | **Tooltip** |
| 菜单、轻表单、过滤 | **Popover** |
| 阻断、确认 | **Modal** |
