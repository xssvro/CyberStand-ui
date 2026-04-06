# Progress 组件 - AI 使用指南

水平进度条，`role="progressbar"`；确定进度时提供 `aria-valuenow` / `min` / `max`，不确定时用 `aria-valuetext`。

## 快速开始

```tsx
import { Progress } from 'stand-ui/components/Progress';

<Progress value={45} />
<Progress indeterminate />
<Progress value={72} showLabel striped color="success" />
```

## Props

| Prop            | 类型                   | 默认值      | 说明                                             |
| --------------- | ---------------------- | ----------- | ------------------------------------------------ |
| `value`         | `number`               | `0`         | 0–100，超出会钳制                                |
| `indeterminate` | `boolean`              | `false`     | 为 true 时不展示具体百分比（无 `aria-valuenow`） |
| `size`          | `'sm' \| 'md' \| 'lg'` | `'md'`      | 轨道高度                                         |
| `color`         | `Color`                | `'primary'` | 填充条语义色                                     |
| `striped`       | `boolean`              | `false`     | 斜条纹（仅确定态；不确定态不叠加）               |
| `showLabel`     | `boolean`              | `false`     | 右侧百分比；不确定时不显示                       |
| `aria-label`    | `string`               | —           | 读屏名称                                         |
| `className`     | `string`               | —           | 根节点                                           |
| `style`         | `CSSProperties`        | —           | 根节点                                           |

其余 `div` 属性可透传。

## 与 Toast

`Progress` 表示**长时间任务**进度；瞬时结果提示请用 `toast()`。
