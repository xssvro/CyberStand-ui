# Button 组件 - AI 使用指南

## 快速开始

```tsx
import { Button } from 'stand-ui/components/Button';

// 基础用法
<Button>点击我</Button>

// 常用配置
<Button color="primary" variant="solid" size="md">主要按钮</Button>
```

## Props 完整说明

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `children` | 可渲染子节点 | **必填** | 按钮显示内容 |
| `size` | `Size`（xs / sm / md / lg / xl） | `'md'` | 按钮尺寸 |
| `color` | `Color`（default、primary…） | `'primary'` | 颜色主题 |
| `variant` | `Variant`（solid、soft…） | `'solid'` | 样式变体 |
| `radius` | `Radius`（none～full） | `'md'` | 圆角；**默认 `'md'` 时按 `size` 阶梯**（xs 约 3px → xl 约 10px），显式传入其它 `radius` 仍用全局刻度 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `loading` | `boolean` | `false` | 是否加载中 |
| `block` | `boolean` | `false` | 是否块级宽度100% |
| `leftIcon` | 可渲染子节点 | - | 左侧图标 |
| `rightIcon` | 可渲染子节点 | - | 右侧图标 |
| `onClick` | `(e) => void` | - | 点击事件 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 按钮类型 |
| `className` | `string` | - | 自定义CSS类 |
| `style` | `CSSProperties` | - | 自定义内联样式 |

## 常用组合示例

### 1. 操作按钮组合
```tsx
// 主要操作 + 次要操作
<div className="flex gap-2">
  <Button color="primary">保存</Button>
  <Button variant="ghost">取消</Button>
</div>
```

### 2. 危险操作
```tsx
// 删除等危险操作使用 error 颜色
<Button color="error" variant="soft">删除</Button>
<Button color="error" variant="outlined">删除</Button>
```

### 3. 带图标的按钮
```tsx
<Button leftIcon={<PlusIcon />}>新建</Button>
<Button rightIcon={<ArrowRightIcon />}>下一步</Button>
```

### 4. 加载状态
```tsx
<Button loading>提交中...</Button>
<Button loading disabled={false}>强制加载样式</Button>
```

### 5. 尺寸阶梯
```tsx
<div className="flex items-center gap-2">
  <Button size="xs">超小</Button>
  <Button size="sm">小</Button>
  <Button size="md">中</Button>
  <Button size="lg">大</Button>
  <Button size="xl">超大</Button>
</div>
```

### 6. 不同变体完整展示
```tsx
// 主要按钮的各种变体
<div className="flex gap-2">
  <Button variant="solid">实心</Button>
  <Button variant="soft">柔和</Button>
  <Button variant="outlined">描边</Button>
  <Button variant="ghost">幽灵</Button>
  <Button variant="link">链接</Button>
</div>
```

## 样式覆盖指南

### 通过 CSS Variables 覆盖（推荐）

单个按钮覆盖：

```tsx
<Button style={{ '--su-primary-600': '#ff6b00' }}>自定义色</Button>
```

全局主题（在 `:root` 或容器上）：

```css
:root {
  --su-primary-600: #ff6b00;
  --su-primary-700: #e55f00;
}
```

### 通过 className 覆盖
```tsx
<Button className="my-custom-btn">自定义类</Button>
```
```css
.my-custom-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 按压与焦点

- **按下**：`:active` 时通过透明度略降（约 0.88，`link` 约 0.82）做按压反馈，无缩放、避免布局抖动。
- **焦点**：`focus-visible` 时显示主题色描边环，便于键盘导航。

## 最佳实践

1. **操作层级**：主要操作用 `solid`，次要用 `soft` 或 `outlined`，第三级用 `ghost`
2. **颜色语义**：
   - `primary` - 主要/确认
   - `error` - 删除/危险
   - `success` - 成功/通过
   - `warning` - 警告/注意
   - `info` - 信息/提示
3. **表单提交**：设置 `type="submit"`
4. **加载状态**：异步操作时使用 `loading` 属性，会自动禁用点击并显示加载动画
