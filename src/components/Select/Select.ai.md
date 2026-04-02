# Select 选择器 - AI 使用指南

基于 **自定义 Listbox**（非原生 `<select>` 下拉层）：下拉内容可完全样式化，支持 **`renderValue` / `renderOption`**、**`Select.Option`** 子组件、**Portal** 与 **`placement`**。表单提交通过 **隐藏 `input[name]`** 携带当前值；`onChange` 仍提供与旧版兼容的合成 **`ChangeEvent` 形态**（`target.value`）。

实现以 `Select.tsx`、`Select.module.css` 为准。

---

## 快速开始

```tsx
import { Select } from 'stand-ui/components/Select';
// 或
import { Select } from 'stand-ui/components';
```

### `options` 数组

```tsx
<Select
  placeholder="请选择"
  options={[
    { value: 'a', label: '选项 A' },
    { value: 'b', label: '选项 B' },
  ]}
/>
```

### 组合式 `Select.Option`（推荐复杂文案 / 结构）

```tsx
<Select placeholder="请选择">
  <Select.Option value="x" label="选项 X" />
  <Select.Option value="y">自定义节点</Select.Option>
</Select>
```

仍支持将 **原生 `<option value="...">`** 作为子节点（会忽略 `value` 为空的项）。

---

## 下拉客制化

| 能力 | 说明 |
|------|------|
| `renderValue` | 自定义触发器展示：`{ value, label, placeholder, open }` |
| `renderOption` | 自定义每一项：`{ option, index, selected, active, disabled }` |
| `contentClassName` | 下拉列表根节点 class |
| `itemClassName` | 每一项容器 class（与 `renderOption` 可同时使用） |
| `listMaxHeight` | 列表最大高度（数字视为 px，或 CSS 如 `240px`） |
| `placement` | `bottom-start` \| `top-start` \| `auto`（空间不足时自动翻转到上方） |
| `portal` | 是否挂到 `document.body`（默认 `true`，避免 `overflow` 裁剪） |
| `empty` | 无选项时的列表区内容 |
| `options[].meta` | 任意附加数据，在 `renderOption` 的 `option.meta` 中读取 |

---

## Props（摘要）

| 属性 | 说明 |
|------|------|
| `value` / `defaultValue` | 受控 / 非受控 |
| `onChange` | `(value, e) => void`，`e.target.value` 可用 |
| `placeholder` | 未选或值不匹配任何项时显示 |
| `name` / `required` / `autoComplete` | 写在隐藏域上，便于原生表单校验 |
| `disabled` | 禁用触发器 |
| `size` / `color` / `radius` | 同 Stand（与 Input 一致） |

无障碍：触发器为 **`button type="button"`**，`aria-haspopup="listbox"`、`aria-expanded`、`aria-controls`、`aria-activedescendant`（打开时）；选项为 **`role="option"`**。

---

## 与 FormField

存在 **`error`** 时注入 **`color="error"`**（触发器错误描边）。

```tsx
<FormField label="地区" error="请选择">
  <Select placeholder="请选择" options={[{ value: 'sh', label: '上海' }]} />
</FormField>
```

---

## 文件位置

`src/components/Select/`
