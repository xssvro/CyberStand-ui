# Callout 组件 - AI 使用指南

**文档 / 说明**向块：左侧色条、可选全大写小标题。无内置 `role="alert"`，适合注意事项、API 说明。需要**可关闭、表单级错误条**时用 **Alert**。

## 与 Alert / Toast

| 组件 | 用途 |
|------|------|
| **Callout** | 文内说明、设计规范、不抢读屏焦点 |
| **Alert** | 页内状态、可关闭、可选 `role="alert"` |
| **Toast** | 全局瞬时反馈、`toast()` |

## 快速开始

```tsx
import { Callout } from 'stand-ui/components/Callout';

<Callout intent="info" title="注意">
  该接口在 v2 中行为有变更。
</Callout>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `intent` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | 左边框与标题色 |
| `title` | `ReactNode` | — | 小号大写标题行 |
| `children` | `ReactNode` | （必填） | 正文 |
| `className` | `string` | — | 根节点（`aside`） |
| `style` | `CSSProperties` | — | 根节点 |

其余 `aside` 属性可透传。
