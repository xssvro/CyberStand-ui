# Form - AI 使用指南

**Form** 是整表入口：原生 **`<form>`** + **`FormContext`**，向子树提供默认 **`layout` / `size` / `disabled`**。**`FormField`** 会读上下文；字段上显式写的属性优先。

可选 **`useForm()` + `form` + `rules`**：内置一套**类似 Ant Design `Form.Item` `rules`** 的声明式校验（**`validateFields` / `getFieldsValue` / `setFields` / `resetFields`**），无需安装 RHF。亦可继续用手写 **`error`** 或 **react-hook-form + Zod**。

实现以 `Form.tsx`、`formStore.ts`、`formRules.ts`、`FormContext.tsx` 为准。

---

## 组件定位：什么时候用 Form？

| 场景 | 建议 |
|------|------|
| 需要 **Enter 提交**、**FormData**、**原生 reset**、无障碍表单语义 | 用 **`Form`** |
| 仅布局、无提交语义 | 用 **`Stack`** / **`Card`** 即可 |
| 分组标题 + `fieldset`/`legend` | **`Form` 内嵌 `FormSection`** |
| 单列标签在上、多列表单 | **`Form` + 默认 `layout="vertical"`** |
| 标签在左对齐 | **`Form layout="horizontal"`**，字段上可设 **`labelWidth`** |

---

## 推荐页面结构（从外到内）

典型一棵树如下（可按业务删减）：

```
Form                    ← 整表：onSubmit、noValidate、layout/size/disabled
├── FormSection（可选）  ← 业务分组：title / description / fieldset
│   └── FormField        ← 单字段：label、description、error、required
│         └── Input | Textarea | Select | Switch | CheckboxGroup …
├── FormSection …
└── Stack（提交区）      ← type="submit" / 次要按钮 type="button"
```

- **表单项之间**的纵向间距由 **`Form`** 根节点的 **`gap`**（**`--su-form-gap`**）控制；**`FormSection`** 内部还有自己的 **`body` 间距**。
- **提交按钮**放在 **`Form` 内**、与 **`FormField` 同级**，并包在 **`Stack direction="row" justify="end"`** 里，避免和字段挤在同一列语义里。

---

## 快速开始

```tsx
import {
  Button,
  Form,
  FormField,
  Input,
  Stack,
} from 'stand-ui/components';

<Form
  className="max-w-lg w-full"
  onSubmit={(e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '').trim();
    // fetch、toast、路由跳转等
  }}
>
  <FormField label="名称" description="对内展示名" required>
    <Input name="name" placeholder="例如：北极星项目" />
  </FormField>
  <Stack direction="row" gap="sm" justify="end">
    <Button type="button" variant="ghost" size="sm">
      取消
    </Button>
    <Button type="submit" color="primary" size="sm">
      保存
    </Button>
  </Stack>
</Form>
```

---

## Props（继承原生 form）

除下表外，还支持 **`method`**、**`action`**、**`encType`**、**`target`** 等 **`React.FormHTMLAttributes<HTMLFormElement>`**。

| 属性 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `noValidate` | `boolean` | **`true`** | 关闭浏览器原生校验**气泡**。必填/格式错误请用 **`FormField` 的 `error`**、**`rules`** 或在 **`onSubmit` 里校验**。需要原生 HTML5 气泡时传 **`noValidate={false}`**。 |
| `form` | **`FormInstance`** | — | 由 **`useForm()`** 创建；**`await form.validateFields()`** 驱动 **`rules`**；显式 **`FormField` `error`** 优先于规则错误 |
| `layout` | `vertical` \| `horizontal` | `vertical` | 子级 **`FormField`** 默认布局；单字段可 **`layout="horizontal"`** 覆盖 |
| `size` | `Size` | `md` | 子级 **`Input` / `Textarea` / `Select` / `Switch`** 未自设 **`size`** 时注入 |
| `disabled` | `boolean` | `false` | 与子项 **`disabled`** 合并（字段显式 **`disabled`** 仍为禁用） |
| `className` / `style` | — | — | 根 **`form`**；常用 **`max-w-* w-full`** 限制最大宽度 |
| `children` | `ReactNode` | 必填 | 任意结构；上下文仅对 **`Form` 子树**生效 |

---

## 内置 `rules` + `useForm`（类 Ant Design）

### 流程

1. **`const form = useForm()`**（每个表单一份实例，勿在 render 中重复创建多份）。
2. **`<Form form={form} onSubmit={…}>`** 挂载后，实例与 DOM 上的 **`<form>`** 绑定。
3. **`FormField`** 上 **`name`**（与控件 **`name`** 一致）+ **`rules`**；提交时 **`await form.validateFields()`**。
4. 校验失败会 **`throw FormValidateError`**（含 **`errorFields`**、**`values`**）；通过时返回 **`getFieldsValue()`** 同结构的值对象。
5. **纯受控**且不在 **`FormData`** 里出现的字段，给 **`FormField` 传 `getValue={() => state}`**。

### `FormRule` 支持的能力（子集）

| 键 | 说明 |
|----|------|
| `required` / `message` | 必填 |
| `whitespace` | 为 true 时先 trim 再判空（配合 `required`） |
| `len` / `min` / `max` | 字符串长度或数组长度；`type: 'number'` 时对数值比较 |
| `pattern` | 正则 |
| `type` | `'string'` \| `'number'` \| `'email'` \| `'url'` |
| `validator` | `(rule, value) => string \| void` 或 async |

多条规则用数组：**`rules={[{ required: true }, { min: 2 }]}`**，按顺序执行，**遇错即停**。

### 示例

```tsx
import {
  Button,
  Form,
  FormField,
  FormValidateError,
  Input,
  useForm,
} from 'stand-ui/components';

function EmailForm() {
  const form = useForm();
  return (
    <Form
      form={form}
      className="max-w-md w-full"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const values = await form.validateFields();
          console.log(values);
        } catch (err) {
          if (err instanceof FormValidateError) {
            console.warn(err.errorFields);
          }
        }
      }}
    >
      <FormField
        label="邮箱"
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '格式不正确' },
        ]}
      >
        <Input name="email" type="email" placeholder="you@example.com" />
      </FormField>
      <Button type="submit" color="primary" size="sm">
        提交
      </Button>
    </Form>
  );
}
```

### `FormInstance` API

| 方法 | 说明 |
|------|------|
| **`validateFields(nameList?)`** | 校验：不传参则校验所有已注册 **`name`**；传数组则只校验这些字段。成功返回 **`values`**，失败 **`throw FormValidateError`** |
| **`getFieldsValue()`** | 从当前 **`<form>`** 的 **`FormData`** 汇总（多选同名键为数组） |
| **`setFields({ email: { errors: ['自定义'] } })`** | 手动设错（首条文案展示在 **`FormField`**） |
| **`resetFields(nameList?)`** | **`form.reset()`** 并清空对应（或全部）校验错误 |
| **`getFieldError(name)`** / **`clearErrors()`** | 读单字段错 / 清空所有错 |

### 与手写 `error`、`RHF` 的关系

- **`FormField` 上传了 `error`（非 `undefined`）** 时，**不再展示 `rules` 产生的错误**（便于外部覆盖或对接 RHF 的 **`errors.xxx`**）。
- **RHF + Zod** 仍可单独使用；本套 **`rules`** 为**零依赖**场景的轻量替代。

---

## 与 FormSection、FormField 组合（完整示例）

下面展示：**两个分组**、**Select**、**说明文案**、**底部主次按钮**。

```tsx
import {
  Button,
  Form,
  FormField,
  FormSection,
  Input,
  Select,
  Stack,
} from 'stand-ui/components';

<Form
  className="max-w-xl w-full"
  onSubmit={(e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    console.log(Object.fromEntries(fd.entries()));
  }}
>
  <FormSection title="基本信息" description="带 * 为必填">
    <FormField label="显示名称" required>
      <Input name="displayName" placeholder="2～32 个字符" />
    </FormField>
    <FormField label="类型">
      <Select
        name="kind"
        placeholder="请选择"
        options={[
          { value: 'app', label: '应用' },
          { value: 'api', label: '接口' },
        ]}
      />
    </FormField>
  </FormSection>

  <FormSection title="联系方式" description="至少填一项">
    <FormField label="邮箱">
      <Input type="email" name="email" placeholder="you@example.com" />
    </FormField>
    <FormField label="手机">
      <Input type="tel" name="phone" placeholder="选填" />
    </FormField>
  </FormSection>

  <Stack direction="row" gap="sm" justify="end">
    <Button type="button" variant="ghost">
      取消
    </Button>
    <Button type="submit" color="primary">
      创建
    </Button>
  </Stack>
</Form>
```

---

## 校验与错误：不要用浏览器气泡

1. **`Form`** 默认 **`noValidate`**，避免原生黄色提示条。
2. 在 **`onSubmit`** 里读 **`FormData`** 或受控 state，自行判断。
3. 把错误文案交给 **`FormField` 的 `error`**，会显示在**控件下方**（并 **`aria-invalid`** / **`role="alert"`**）。

手写状态示例：

```tsx
import { useState } from 'react';
import { Button, Form, FormField, Input, Stack } from 'stand-ui/components';

export function CreateForm() {
  const [errors, setErrors] = useState<{ name?: string }>({});

  return (
    <Form
      className="max-w-md w-full"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const name = String(fd.get('name') ?? '').trim();
        if (!name) {
          setErrors({ name: '请填写名称' });
          return;
        }
        setErrors({});
        // 调用接口…
      }}
    >
      <FormField label="名称" required error={errors.name}>
        <Input name="name" placeholder="项目名称" />
      </FormField>
      <Stack direction="row" gap="sm" justify="end">
        <Button type="submit" color="primary">
          提交
        </Button>
      </Stack>
    </Form>
  );
}
```

用户修改后若要清错，可在 **`Input` 的 `onChange`** 里 **`setErrors((e) => ({ ...e, name: undefined }))`**。

---

## 上下文：layout / size / disabled

- **整表横向**：**`Form layout="horizontal"`**，各 **`FormField`** 建议统一 **`labelWidth`**（如 `96` / `120`）。
- **某一列仍要纵向**：该 **`FormField layout="vertical"`**。
- **紧凑表**：**`Form size="sm"`**；单个字段要大输入框可给 **`Input size="lg"`** 覆盖。
- **提交中整表禁用**：**`Form disabled={submitting}`**，避免重复点击；可与按钮 **`loading`** 并用。

---

## `useFormContext`

在 **`Form`** 外为 **`null`**。自定义控件若要对齐表单 **`size`**：

```tsx
import { useFormContext } from 'stand-ui/components/Form';

function MyControl() {
  const ctx = useFormContext();
  const size = ctx?.size ?? 'md';
  // …
}
```

---

## CSS 变量

| 变量 | 说明 |
|------|------|
| `--su-form-gap` | **`Form` 根节点**子元素之间的 **`gap`**，默认回退 **`--su-space-4`**（16px） |

示例：**略加大字段间距**

```tsx
<Form style={{ ['--su-form-gap' as string]: 'var(--su-space-6)' }}>
  …
</Form>
```

---

## react-hook-form 与 Zod（可选）

在应用项目安装 **`react-hook-form`**、**`zod`**、**`@hookform/resolvers`**。要点：

1. **`Form onSubmit={handleSubmit(onValid)}`**（RHF 会 **`preventDefault`**）。
2. **`Input` / `Textarea`** 用 **`register('field')`**。
3. **`Select` / `Switch`** 等用 **`Controller`** + **`field.value` / `field.onChange`**。
4. **`FormField error={errors.xxx?.message}`** 与 **`formState.errors`** 对齐。

```bash
npm i react-hook-form zod @hookform/resolvers
```

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Form, FormField, Input, Select } from 'stand-ui/components';

const schema = z.object({
  title: z.string().min(1, '必填'),
  city: z.string().min(1, '请选择城市'),
});

type FormValues = z.infer<typeof schema>;

export function DemoForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', city: '' },
  });

  return (
    <Form onSubmit={handleSubmit((data) => console.log(data))}>
      <FormField label="标题" error={errors.title?.message} required>
        <Input {...register('title')} placeholder="项目名称" />
      </FormField>
      <FormField label="城市" error={errors.city?.message} required>
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <Select
              name={field.name}
              value={field.value}
              onChange={(v) => field.onChange(v)}
              placeholder="请选择"
              options={[
                { value: 'sh', label: '上海' },
                { value: 'bj', label: '北京' },
              ]}
            />
          )}
        />
      </FormField>
      <Button type="submit" color="primary">
        提交
      </Button>
    </Form>
  );
}
```

**`Select` 的 `onChange`** 为 **`(value, syntheticEvent) => void`**，对接 RHF 时写 **`field.onChange(v)`** 即可。

---

## 文件位置

| 内容 | 路径 |
|------|------|
| 组件 | `src/components/Form/`（含 **`formStore` / `formRules` / `useForm`**） |
| 表单项 | `src/components/FormField/` |
| 分组 | `src/components/FormSection/` |
