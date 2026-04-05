# Empty 组件 - AI 使用指南

列表/区块**无数据**时的占位：插图槽、标题、说明与可选操作区。与 **`Toast`**（瞬时全局提示）无关；空态是**持久布局**，不要用 toast 代替。

## 快速开始

```tsx
import { Empty } from 'stand-ui/components/Empty';
import { IconPackage } from 'stand-ui/icons';

<Empty
  title="暂无数据"
  description="请调整筛选条件或稍后再试。"
  image={<IconPackage size={72} />}
>
  <Button color="primary" size="sm">新建</Button>
</Empty>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `image` | `ReactNode` | 内置简笔画 | 传 `null` 则不显示图区 |
| `title` | `ReactNode` | — | 主标题 |
| `description` | `ReactNode` | — | 辅助说明 |
| `children` | `ReactNode` | — | 底部操作区（按钮等） |
| `className` | `string` | — | 根节点 |
| `style` | `CSSProperties` | — | 根节点 |

根节点为 `role="region"`，有 `title` 时 `aria-labelledby` 指向标题。

其余 `div` 属性可透传。

## 与 Toast

空列表**不要**用 `toast('暂无数据')`；用 **Empty** 或 **Skeleton**（加载中）表达状态。
