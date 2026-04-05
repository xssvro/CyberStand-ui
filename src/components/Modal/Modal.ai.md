# Modal / Dialog 组件 - AI 使用指南

`Modal` 与 `Dialog` 为**同一组件**的两个导出名称，以下以 `Modal` 为例。

## 快速开始

```tsx
import { Modal } from 'stand-ui/components/Modal';
import { Button } from 'stand-ui/components/Button';

const [open, setOpen] = useState(false);

<>
  <Button type="button" onClick={() => setOpen(true)}>
    打开
  </Button>
  <Modal
    open={open}
    onOpenChange={setOpen}
    title="标题"
    footer={
      <>
        <Button variant="ghost" size="sm" type="button" onClick={() => setOpen(false)}>
          取消
        </Button>
        <Button color="primary" size="sm" type="button" onClick={() => setOpen(false)}>
          确定
        </Button>
      </>
    }
  >
    <p>正文内容</p>
  </Modal>
</>;
```

## 行为说明

- **Portal**：默认挂到 `document.body`；`z-index` 使用 **`--su-z-modal`**（高于下拉，低于 Toast）。
- **遮罩**：默认 `mask` 为 `true`，使用 `--su-loading-mask-bg` + 轻微模糊；**`mask={false}`** 为非遮罩模式（无底色与模糊），仍保留**透明全屏层**以阻断背后点击，并继续支持 **`maskClosable`**（点面板外空白关闭）。若需「背后可点穿」需另做非模态方案（当前未提供）。
- **键盘**：`Escape` 关闭（`keyboard`）；`Tab` 在对话框内循环（焦点陷阱）。
- **滚动**：打开时锁定 `html`、`body` 的 `overflow`；若存在带 **`data-su-scroll-lock`** 的节点（文档站主内容 `<main class="docs-main">` 已挂载），会一并锁定并在该节点上做 **`padding-right`** 补偿，避免主列滚动条消失导致跳动。
- **文档站布局**：整页滚动在 **`.docs-main`** 内完成，**不再**使用 `html { scrollbar-gutter: stable }`，避免「不滚动时也占一条宽度」。WebKit 下主列滚动条为**细轨道、默认透明滑块，悬停/聚焦主内容时再显色**（叠加感；Windows 下仍可能占用少量布局宽度，由系统决定）。
- **无障碍**：`role="dialog"`、`aria-modal="true"`；有标题时 `aria-labelledby`，无标题时 `aria-label="对话框"`。

## Props 完整说明

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `open` | `boolean` | （必填） | 是否展示 |
| `onOpenChange` | `(open: boolean) => void` | - | 受控开关 |
| `onClose` | `() => void` | - | 关闭时回调（遮罩、关闭钮、Esc）；常与 `onOpenChange(false)` 一起用 |
| `title` | `React.ReactNode` | - | 标题区；无标题仍可 `closable` |
| `children` | `React.ReactNode` | - | 主体（可滚动） |
| `footer` | `React.ReactNode` | - | 底栏，常放按钮 |
| `closable` | `boolean` | `true` | 右上角关闭按钮 |
| `mask` | `boolean` | `true` | 是否显示半透明遮罩与模糊；`false` 为仅透明全屏层 |
| `maskClosable` | `boolean` | `true` | 点击遮罩或透明层是否关闭 |
| `keyboard` | `boolean` | `true` | `Esc` 关闭 |
| `centered` | `boolean` | `true` | 垂直居中；`false` 时靠上（约 `10vh`） |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | 预设最大宽度 |
| `width` | `number \| string` | - | 覆盖最大宽度（如 `480`、`'80%'`） |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'lg'` | 面板圆角 |
| `className` | `string` | - | 根节点（全屏层） |
| `bodyClassName` | `string` | - | 白色面板节点 |
| `getContainer` | `HTMLElement \| () => HTMLElement` | `document.body` | 挂载容器 |
| `zIndex` | `number` | - | 覆盖整层 z-index |
| `afterOpenChange` | `(open: boolean) => void` | - | 状态变化后同步回调 |

## 与 Toast / Alert

| 场景 | 建议 |
|------|------|
| 需阻断操作、表单、双按钮确认 | **Modal** |
| 全局轻提示、不打断 | **Toast** |
| 页内常驻说明 | **Alert** / **Callout** |

## 样式覆盖

面板使用 `--su-modal-max-width`、`--su-radius`（由 `width`/`size`、`radius` 注入）。遮罩背景随主题使用 **`--su-loading-mask-bg`**。
