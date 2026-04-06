# Loading 组件 - AI 使用指南

区块或全屏加载：半透明遮罩 + 中央 **`Spinner`**。全屏层使用 **`--su-z-loading`**，低于 **`Toast`**（`--su-z-toast`），全局通知仍可盖在上层。

## 快速开始

```tsx
import { Loading } from 'stand-ui/components/Loading';

<Loading spinning tip="保存中…">
  <Card>被遮罩的内容</Card>
</Loading>

<Loading spinning fullscreen tip="请稍候…" />
```

## Props

| Prop         | 类型            | 默认值  | 说明                                               |
| ------------ | --------------- | ------- | -------------------------------------------------- |
| `spinning`   | `boolean`       | `true`  | 为 false 时仅渲染 `children`（若有）               |
| `tip`        | `ReactNode`     | —       | 遮罩内说明文案                                     |
| `fullscreen` | `boolean`       | `false` | 为 true 时遮罩 `position: fixed` 铺满视口          |
| `children`   | `ReactNode`     | —       | 有子节点时在子树上方盖遮罩；无子节点时为独立占位块 |
| `className`  | `string`        | —       | 追加在根 `div`                                     |
| `style`      | `CSSProperties` | —       | 根节点样式                                         |

其余 `div` 原生属性可透传。

## 与 Toast

`Loading` 为**阻塞式**页面内加载；瞬时全局提示请用 `toast()`。
