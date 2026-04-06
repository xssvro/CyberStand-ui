# Alert 组件 - AI 使用指南

页面内**持久**提示条，与 **`Toast`**（全局、短时、命令式）区分。默认 **`role="status"`**；仅在需要立即打断读屏的致命错误时使用 **`role="alert"`**。

## 与 Toast

| 场景                                           | 选用                         |
| ---------------------------------------------- | ---------------------------- |
| 保存成功、网络结果等**几秒消失**               | `toast()`                    |
| 表单顶部错误汇总、页面级说明**常驻**至用户处理 | `Alert`                      |
| 需要**遮罩阻断**                               | `Loading` 或模态，而非 Alert |

文档站预览与 **Toast** 类似，用**按钮点击**后再挂载 Alert，便于演示「事件后出现提示」；静态页内也可直接写 `<Alert>` 无需点击。

## 快速开始

```tsx
import { Alert } from 'stand-ui/components/Alert';

<Alert variant="info" title="提示">
  配置将在下次同步时生效。
</Alert>
<Alert variant="error" role="alert" title="提交失败" closable onClose={() => {}}>
  请检查标红字段。
</Alert>
```

## Props

| Prop        | 类型                                          | 默认值     | 说明                         |
| ----------- | --------------------------------------------- | ---------- | ---------------------------- |
| `variant`   | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'`   | 语义色与左边框强调           |
| `title`     | `ReactNode`                                   | —          | 标题行                       |
| `children`  | `ReactNode`                                   | —          | 正文（小一号字色）           |
| `role`      | `'status' \| 'alert'`                         | `'status'` | `alert` 会强提示，勿滥用     |
| `closable`  | `boolean`                                     | `false`    | 显示关闭按钮                 |
| `onClose`   | `() => void`                                  | —          | 点击关闭后触发，组件卸载     |
| `banner`    | `boolean`                                     | `false`    | 通栏：`width 100%`、圆角收平 |
| `className` | `string`                                      | —          | 根节点                       |
| `style`     | `CSSProperties`                               | —          | 根节点                       |

其余 `div` 属性可透传。
