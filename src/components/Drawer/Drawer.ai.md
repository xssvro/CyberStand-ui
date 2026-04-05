# Drawer 抽屉 - AI 使用指南

侧滑（或自上/下滑入）面板，用于导航、筛选、详情等次要流程；行为与 **Modal** 对齐（Portal、遮罩、滚动锁定、焦点陷阱）。

## 快速开始

```tsx
import { Drawer } from 'stand-ui/components/Drawer';
import { Button } from 'stand-ui/components/Button';

const [open, setOpen] = useState(false);

<>
  <Button type="button" onClick={() => setOpen(true)}>
    打开抽屉
  </Button>
  <Drawer open={open} onOpenChange={setOpen} title="标题" placement="right">
    <p>内容</p>
  </Drawer>
</>;
```

## 行为说明

- **Portal**：默认 `document.body`；`z-index` 为 **`--su-z-drawer`**（与 Modal 同级，后打开者在上层）。
- **遮罩**：与 Modal 相同语义；`mask={false}` 时无底色与模糊，仍保留透明全屏层，可配合 `maskClosable`。
- **键盘**：`Escape` 关闭；`Tab` 在面板内循环。
- **滚动**：与 Modal 共用 **`useOverlayScrollLock`**，锁定 `html` / `body` 及 **`[data-su-scroll-lock]`**（文档站主内容已挂载）。
- **placement**：`left` | `right` | `top` | `bottom`，默认 `right`。左右用 **`width`**，上下用 **`height`**。
- **无障碍**：`role="dialog"`、`aria-modal="true"`；有标题时 `aria-labelledby`，无标题时 `aria-label="抽屉"`。

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `open` | `boolean` | （必填） | 是否展示 |
| `onOpenChange` | `(open: boolean) => void` | - | 受控开关 |
| `onClose` | `() => void` | - | 关闭回调 |
| `title` | `React.ReactNode` | - | 标题 |
| `children` | `React.ReactNode` | - | 主体（可滚动） |
| `footer` | `React.ReactNode` | - | 底栏 |
| `closable` | `boolean` | `true` | 右上角关闭钮 |
| `mask` | `boolean` | `true` | 半透明遮罩与模糊 |
| `maskClosable` | `boolean` | `true` | 点遮罩/透明层关闭 |
| `keyboard` | `boolean` | `true` | Esc 关闭 |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | 滑入边 |
| `width` | `number \| string` | `400`（px） | 左/右抽屉宽度 |
| `height` | `number \| string` | `min(40vh, 320px)` | 上/下抽屉高度 |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'lg'` | 靠外一侧圆角 |
| `className` | `string` | - | 根节点 |
| `panelClassName` | `string` | - | 面板节点 |
| `getContainer` | `HTMLElement \| () => HTMLElement` | `document.body` | 挂载容器 |
| `zIndex` | `number` | - | 覆盖 z-index |
| `afterOpenChange` | `(open: boolean) => void` | - | 状态变化后回调 |

## 与 Modal

| 场景 | 建议 |
|------|------|
| 需强阻断、确认、表单居中 | **Modal** |
| 侧栏菜单、筛选、窄详情 | **Drawer** |
