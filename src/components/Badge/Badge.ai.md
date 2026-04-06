# Badge 组件 - AI 使用指南

数字角标或圆点，用于消息数、状态强调；与 **Tag**（块状标签）区分。

## 快速开始

```tsx
import { Badge } from 'stand-ui/components/Badge';

<Badge count={3}>
  <Button size="sm" variant="ghost" aria-label="通知">铃</Button>
</Badge>
<Badge dot color="error">
  <span>任务</span>
</Badge>
<Badge count={120} max={99} aria-label="未读 99+" />
```

## Props

| Prop         | 类型        | 默认值    | 说明                                                                                    |
| ------------ | ----------- | --------- | --------------------------------------------------------------------------------------- |
| `count`      | `number`    | —         | 展示数字；与 `dot` 同时存在时以 `dot` 为准                                              |
| `dot`        | `boolean`   | `false`   | 仅圆点                                                                                  |
| `max`        | `number`    | `99`      | 超出显示为 `max+`                                                                       |
| `showZero`   | `boolean`   | `false`   | `count` 为 0 时仍显示数字                                                               |
| `color`      | `Color`     | `'error'` | 角标背景语义色                                                                          |
| `children`   | `ReactNode` | —         | 锚点；不传则只渲染角标（`standalone` 布局）                                             |
| `className`  | `string`    | —         | 追加在根节点                                                                            |
| `aria-label` | `string`    | —         | 无 `children` 时建议手动传入；有 `children` 时用于补充读屏（另有 visually hidden 文本） |

其余 `span` 属性可透传。

## 与 Toast

`Badge` 为**持久**界面标记；瞬时全局提示请用 `toast()`。
