# Tag 组件 - AI 使用指南

只读或带关闭的标签块，用于筛选条件、属性展示；**角标/计数**请用 **Badge**。

## 快速开始

```tsx
import { Tag } from 'stand-ui/components/Tag';

<Tag>默认</Tag>
<Tag color="primary" variant="outlined">描边</Tag>
<Tag closable onClose={() => {}}>可关闭</Tag>
```

## Props

| Prop        | 类型                              | 默认值      | 说明                         |
| ----------- | --------------------------------- | ----------- | ---------------------------- |
| `children`  | `ReactNode`                       | （必填）    | 标签文案                     |
| `color`     | `Color`                           | `'default'` | 语义色                       |
| `variant`   | `'solid' \| 'soft' \| 'outlined'` | `'soft'`    | 视觉变体                     |
| `closable`  | `boolean`                         | `false`     | 是否显示关闭按钮             |
| `onClose`   | `function`                        | —           | 关闭时触发（需自行更新列表） |
| `className` | `string`                          | —           | 追加类名                     |

其余 `span` 属性可透传。

## 与 Toast

`Tag` 为**界面内**静态标签；全局轻提示请用 `toast()`。
