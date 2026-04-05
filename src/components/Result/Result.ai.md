# Result 组件 - AI 使用指南

**整页或大块**结果反馈：成功、错误、403/404 等。默认带状态图标与语义色；操作区用 **`extra`**（常为按钮组）。与 **`Toast`**（短时角落提示）不同，与 **`Empty`**（无数据占位）区分：**Result** 强调**一次操作的结果态**。

## 与 Toast / Empty

| 组件 | 场景 |
|------|------|
| **Result** | 提交后整页结果、403/404 页、流程结束态 |
| **Toast** | 无需占版的轻量反馈 |
| **Empty** | 列表无数据、筛选为空 |

## 快速开始

```tsx
import { Result } from 'stand-ui/components/Result';

<Result
  status="success"
  title="提交成功"
  subTitle="我们已收到你的申请，将在 1～3 个工作日内处理。"
  extra={<Button color="primary">返回首页</Button>}
/>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `status` | `ResultStatus` | `'neutral'` | 内置图标与强调色 |
| `icon` | `ReactNode` | 按 `status` | 完全自定义图标区 |
| `iconSize` | `number` | `56` | 内置 SVG 视口尺寸 |
| `title` | `ReactNode` | （必填） | 主标题（`h2`） |
| `subTitle` | `ReactNode` | — | 副文案 |
| `extra` | `ReactNode` | — | 主按钮区等 |
| `children` | `ReactNode` | — | 底部次要说明（小号字） |
| `className` | `string` | — | 根节点 |
| `style` | `CSSProperties` | — | 根节点 |

`ResultStatus`：`'success' | 'error' | 'info' | 'warning' | '403' | '404' | 'neutral'`。

根节点 `role="status"`；若需强打断读屏可在外层包一层或改用页面级 `role="alert"`（慎用）。

其余 `div` 属性可透传。
