# Card 组件 - AI 使用指南

## 快速开始

```tsx
import { Card } from 'stand-ui/components/Card';

// 基础用法
<Card>这里是卡片内容</Card>

// 完整用法
<Card
  title="卡片标题"
  subtitle="卡片副标题描述"
  extra={<Button>操作</Button>}
  footer={<Button>确定</Button>}
>
  卡片主体内容
</Card>
```

## Props 完整说明

| Prop        | 类型                                               | 默认值   | 说明                         |
| ----------- | -------------------------------------------------- | -------- | ---------------------------- |
| `children`  | 可渲染子节点                                       | **必填** | 卡片内容                     |
| `title`     | 可渲染子节点                                       | -        | 标题（字符串或组件）         |
| `subtitle`  | 可渲染子节点                                       | -        | 副标题                       |
| `extra`     | 可渲染子节点                                       | -        | 右上角操作区                 |
| `footer`    | 可渲染子节点                                       | -        | 底部操作区                   |
| `radius`    | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'`   | 圆角                         |
| `shadow`    | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'`           | `'sm'`   | 阴影大小                     |
| `bordered`  | `boolean`                                          | `true`   | 是否有边框                   |
| `hoverable` | `boolean`                                          | `false`  | 是否有悬浮效果               |
| `disabled`  | `boolean`                                          | `false`  | 是否禁用                     |
| `onClick`   | `() => void`                                       | -        | 点击事件（设置后卡片可点击） |
| `className` | `string`                                           | -        | 自定义类名                   |
| `style`     | `CSSProperties`                                    | -        | 自定义样式                   |

## 常用组合示例

### 1. 信息展示卡片

```tsx
<Card title="用户信息" subtitle="查看和管理用户资料" extra={<EditIcon />}>
  <p>姓名：张三</p>
  <p>邮箱：zhangsan@example.com</p>
  <p>手机：138****8888</p>
</Card>
```

### 2. 操作卡片

```tsx
<Card
  title="删除账户"
  subtitle="此操作不可恢复，请谨慎操作"
  footer={
    <>
      <Button variant="ghost">取消</Button>
      <Button color="error">确认删除</Button>
    </>
  }
>
  <p>删除账户将清除所有数据，包括：</p>
  <ul>
    <li>个人资料</li>
    <li>历史订单</li>
    <li>收藏内容</li>
  </ul>
</Card>
```

### 3. 可点击卡片（链接/导航）

```tsx
<Card hoverable onClick={() => navigate('/detail')} shadow="md">
  <h3>项目 A</h3>
  <p>点击查看详情 →</p>
</Card>
```

### 4. 无边框简洁卡片

```tsx
<Card bordered={false} shadow="none">
  <StatValue value="1,234" label="总用户" />
</Card>
```

### 5. 卡片列表

```tsx
<div className="grid grid-cols-3 gap-4">
  {items.map((item) => (
    <Card key={item.id} title={item.name} hoverable shadow="sm">
      <p>{item.description}</p>
    </Card>
  ))}
</div>
```

### 6. 图片卡片

```tsx
<Card padding={0} overflow="hidden">
  <img src="cover.jpg" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
  <div style={{ padding: 16 }}>
    <h3>文章标题</h3>
    <p>文章摘要...</p>
  </div>
</Card>
```

## 样式覆盖指南

### 自定义卡片尺寸

```tsx
<Card style={{ width: 300, height: 200 }}>固定尺寸卡片</Card>
```

### 网格布局中的卡片

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
```

### 覆盖内部样式

```css
/* 自定义头部：用 token 实色（勿用装饰渐变铺头图） */
.my-card [class*='header'] {
  background: var(--su-btn-primary-solid-bg);
  color: var(--su-btn-primary-solid-fg);
}

.my-card [class*='title'] {
  color: var(--su-btn-primary-solid-fg);
}
```

## 最佳实践

1. **标题层级**：title 用于主要信息，subtitle 用于补充说明
2. **操作按钮**：extra 放编辑/更多操作，footer 放确认/取消
3. **点击区域**：有 `onClick` 时建议同时设置 `hoverable` 提升体验
4. **阴影选择**：普通内容用 `sm`，强调/悬浮用 `md` 或 `lg`
5. **内容间距**：Card 内部有默认 padding，复杂布局可嵌套其他组件
