# DateRangePicker 组件 - AI 使用指南

## 快速开始

```tsx
import { DateRangePicker } from 'stand-ui/components';
import type { DateRangeISO } from 'stand-ui/components'; // 自 dateUtils 经入口再导出时可用类型

const [range, setRange] = useState<DateRangeISO>({ start: '', end: '' });
<DateRangePicker value={range} onChange={(v) => setRange(v)} />;
```

## Props

| Prop                                         | 类型                             | 默认值                   | 说明                                                     |
| -------------------------------------------- | -------------------------------- | ------------------------ | -------------------------------------------------------- |
| value                                        | `{ start: string; end: string }` | -                        | 受控；`yyyy-mm-dd`                                       |
| defaultValue                                 | 同上                             | `{ start: '', end: '' }` | 非受控初值                                               |
| onChange                                     | `(value, e) => void`             | -                        | 选满起止并关闭弹层时触发                                 |
| placeholder                                  | `string`                         | `选择日期范围`           |                                                          |
| min / max                                    | `string`                         | -                        | 可选边界，支持 `yyyy-mm-dd` 或带时间前缀（按日期键比较） |
| name                                         | `string`                         | -                        | 单一隐藏域，值为 `start/end`                             |
| startName / endName                          | `string`                         | -                        | 同时传则两个隐藏域，优先于 `name`                        |
| placement / portal / panelClassName / locale | -                                | 同 DatePicker            |                                                          |
| size / color / radius / disabled / required  | -                                | 同 StandProps            |                                                          |

交互：第一次点选起点，第二次点选终点（若早于起点则自动交换）；选满后关闭弹层并提交。未选满时点外部关闭不提交不完整选择。
