# Radio / RadioGroup - AI 使用指南

**Radio**：单选圆点；建议在 **RadioGroup** 内使用（共享 **`name`** 与受控 **`value`**）。单独使用时须自行传 **`name`**。

**RadioGroup**：**`role="radiogroup"`**，**`value` + `onValueChange`**；支持 **`horizontal`**、**`invalid`**。

实现见 `Radio.tsx`、`RadioGroup.tsx`、`Radio.module.css`。

---

## 快速开始

```tsx
import { Radio, RadioGroup } from 'stand-ui/components/Radio';
// 或
import { Radio, RadioGroup } from 'stand-ui/components';
```

```tsx
<RadioGroup name="plan" value={plan} onValueChange={setPlan}>
  <Radio value="free" label="免费版" />
  <Radio value="pro" label="专业版" />
</RadioGroup>

<RadioGroup name="tier" value={tier} horizontal onValueChange={setTier}>
  <Radio value="a" label="A" />
  <Radio value="b" label="B" />
</RadioGroup>
```

---

## Radio Props

| 属性                         | 说明                    |
| ---------------------------- | ----------------------- |
| `value`                      | 选项值（**必填**）      |
| `label`                      | 文案                    |
| `size`                       | `sm` \| `md`            |
| `color`                      | `default` \| `error`    |
| `checked` / `defaultChecked` | 仅在**无 Group** 时使用 |
| `name`                       | 无 Group 时须传         |

---

## RadioGroup Props

| 属性            | 说明                  |
| --------------- | --------------------- |
| `name`          | 表单字段名            |
| `value`         | 当前选中项的 `value`  |
| `onValueChange` | `(v: string) => void` |
| `invalid`       | 子 Radio 错误描边     |
| `horizontal`    | 横向排列              |
| `disabled`      | 整组禁用              |

---

## 与 FormField

**`error`** 时注入 **`invalid`**；标签与 **`aria-labelledby`** 行为同 CheckboxGroup。

```tsx
<FormField label="套餐" error="请选择一项">
  <RadioGroup name="pkg" value={pkg} onValueChange={setPkg}>
    <Radio value="basic" label="基础" />
    <Radio value="pro" label="专业" />
  </RadioGroup>
</FormField>
```

---

## 文件位置

`src/components/Radio/`
