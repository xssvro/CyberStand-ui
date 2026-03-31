# Input 组件 - AI 使用指南

## 快速开始

```tsx
import { Input } from 'stand-ui/components/Input';

// 基础用法
<Input placeholder="请输入" />

// 受控组件
const [value, setValue] = useState('');
<Input value={value} onChange={setValue} />
```

## Props 完整说明

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | - | 输入值（受控） |
| `defaultValue` | `string` | - | 默认值（非受控） |
| `onChange` | `(value, event) => void` | - | 值变化回调 |
| `placeholder` | `string` | - | 占位提示文字 |
| `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'` | 输入类型 |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 尺寸 |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | 聚焦时的主题色 |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | 圆角 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `readOnly` | `boolean` | `false` | 是否只读 |
| `required` | `boolean` | `false` | 是否必填 |
| `autoFocus` | `boolean` | `false` | 自动聚焦 |
| `prefix` | 可渲染子节点 | - | 前置内容（图标/文字） |
| `suffix` | 可渲染子节点 | - | 后置内容（图标/文字） |
| `maxLength` | `number` | - | 最大长度 |
| `minLength` | `number` | - | 最小长度 |
| `name` | `string` | - | 表单 name 属性 |
| `autoComplete` | `string` | - | 自动完成 |
| `pattern` | `string` | - | 正则验证模式 |
| `className` | `string` | - | 自定义类名 |
| `style` | `CSSProperties` | - | 自定义样式 |

## 常用组合示例

### 1. 带图标的输入框
```tsx
<Input 
  prefix={<SearchIcon />} 
  placeholder="搜索..." 
/>

<Input 
  suffix={<AtIcon />} 
  placeholder="邮箱地址" 
/>

<Input 
  prefix={<UserIcon />}
  suffix={<CheckIcon />}
  placeholder="用户名"
/>
```

### 2. 密码输入
```tsx
const [showPwd, setShowPwd] = useState(false);

<Input
  type={showPwd ? 'text' : 'password'}
  suffix={
    <button onClick={() => setShowPwd(!showPwd)}>
      {showPwd ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  }
  placeholder="请输入密码"
/>
```

### 3. 表单验证状态
```tsx
// 错误状态
<Input color="error" placeholder="输入有误" />

// 成功状态
<Input color="success" placeholder="验证通过" />

// 警告状态
<Input color="warning" placeholder="需要注意" />
```

### 4. 搜索输入框
```tsx
<Input
  type="search"
  prefix={<SearchIcon />}
  suffix={
    <Button size="xs" color="primary">
      搜索
    </Button>
  }
  placeholder="请输入关键词"
/>
```

### 5. 带标签的输入框（配合布局）
```tsx
<div className="flex flex-col gap-1">
  <label className="text-sm text-gray-600">邮箱</label>
  <Input 
    type="email" 
    prefix={<MailIcon />}
    placeholder="your@email.com"
  />
</div>
```

## 样式覆盖指南

### 调整宽度
```tsx
// 通过 style
<Input style={{ width: '300px' }} />

// 通过 className（配合 CSS）
<Input className="w-full max-w-md" />
```

### 自定义前缀后缀样式
前缀后缀容器会自动继承文字颜色，如需自定义：
```css
/* 在父级作用域 */
.my-input-wrapper [class*="prefix"] {
  color: #ff6b00;
}
```

## 最佳实践

1. **始终提供 placeholder**：帮助用户理解输入内容
2. **配合 label 使用**：不要仅用 placeholder 替代 label
3. **合理的 type 类型**：邮箱用 `email`，电话用 `tel`，会唤起对应键盘
4. **验证反馈**：配合 `color="error"` 提示验证错误
5. **搜索框**：使用 `type="search"` 会在移动端显示搜索按钮
