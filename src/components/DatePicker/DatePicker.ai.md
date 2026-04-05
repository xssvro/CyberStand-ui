# DatePicker 组件 - AI 使用指南

## 快速开始

```tsx
import { DatePicker } from 'stand-ui/components/DatePicker';

const [d, setD] = useState('');
<DatePicker value={d} onChange={(v) => setD(v)} placeholder="选择日期" />
```

## 说明

- **自研日历弹层**：通过 `createPortal` 挂到 `document.body`，定位方式与 `Select` 一致（`fixed` + 视口翻转）。
- **值格式**：`yyyy-mm-dd`，与 `<input type="date">` 一致；表单提交依赖隐藏域 `input[type=hidden][name]`。
- **选中态**：面板内选中日使用 **`--su-primary-500` / `--su-on-primary`**（主色实心）。

## Props 完整说明

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | - | 受控值 `yyyy-mm-dd` |
| `defaultValue` | `string` | `''` | 非受控初始值 |
| `onChange` | `(value, e) => void` | - | 选中日期后回调；`e` 为合成 `change` 事件 |
| `placeholder` | `string` | `'选择日期'` | 未选时触发器文案 |
| `min` / `max` | `string` | - | 可选范围，`yyyy-mm-dd` 字符串比较 |
| `name` | `string` | - | 写入隐藏域，供 `FormData` 提交 |
| `disabled` | `boolean` | `false` | 禁用 |
| `required` | `boolean` | `false` | 映射到触发器 `aria-required` |
| `size` | `StandProps['size']` | `'md'` | 与 Input 一致 |
| `color` | `StandProps['color']` | `'default'` | 聚焦环与错误描边（配合 FormField） |
| `radius` | `StandProps['radius']` | `'md'` | 圆角 |
| `placement` | `'bottom-start' \| 'top-start' \| 'auto'` | `'auto'` | 面板相对触发器 |
| `portal` | `boolean` | `true` | 是否 Portal 到 body |
| `panelClassName` | `string` | - | 面板根节点 class |
| `locale` | `string` | `'zh-CN'` | 触发器展示用 `toLocaleDateString` |
| `id` / `aria-*` | - | - | 透传触发器 `button`，供 `label`/`FormField` 关联 |

## 与 FormField

与 `Input` 相同：`FormField` 在 `error` 时注入 `color="error"`；受控校验请配合 `name` + `rules` 时传 `getValue={() => value}`。

## 与 Input `type="date"`

- **`Input type="date"`**：不显示右侧原生日历按钮；仍以原生控件为主，换肤有限。
- **`DatePicker`**：自定义月历 + 主色选中，适合与设计系统完全一致的场景。
