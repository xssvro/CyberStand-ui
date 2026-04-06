# Avatar 组件 - AI 使用指南

Avatar 用于展示**用户或实体头像**：支持**图片**（`object-fit: cover` 圆内裁切）、**文字缩写**占位、**自定义图标**占位；图片加载失败时自动回退到占位。形状支持**圆形**与**圆角矩形**，尺寸 **xs～xl**，占位底色可走 **Color** 语义。

---

## 快速开始

```tsx
import { Avatar } from 'stand-ui/components/Avatar';

<Avatar src={user.avatarUrl} alt={user.name} />
<Avatar color="primary">张三</Avatar>
<Avatar size="lg" shape="rounded" color="info">
  AB
</Avatar>
```

---

## Props

除下表外，支持 `React.HTMLAttributes<HTMLSpanElement>` 中可作用于外层容器的属性（如 `className`、`style`、`title`）。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | `string` | - | 图片 URL；省略或加载失败时显示占位 |
| `alt` | `string` | `''` | 有图时为 `<img alt>`；无图时参与 **`aria-label`**（读屏名称） |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 边长约 24 / 32 / 40 / 48 / 64 px |
| `shape` | `'circle' \| 'rounded'` | `'circle'` | 圆形或主题圆角矩形 |
| `color` | `Color` | `'default'` | 无图/失败时的浅色底 + 前景色（与 Tag soft 系一致思路） |
| `children` | `ReactNode` | - | **字符串/数字**：生成缩写（拉丁文约取前 2 字母大写，中文可取前 2 字）；**React 元素**：直接作为占位内容 |
| `icon` | `ReactNode` | - | 无文字子节点且无图时的占位；不传则为内置人形剪影 |

**`ref`**：转发到外层 `<span>`。

---

## 文字缩写规则

- 子节点为 `string` / `number`：去首尾空格后，若全为 ASCII 且长度 > 2，取前 **2** 字符并 `toUpperCase()`；否则长度 ≤2 时整体大写；**含中文等非 ASCII** 时取字符串前 **2** 个字符（不强行 toUpperCase）。
- 子节点为 **空字符串**：视为无文字，走 **`icon`** 或默认人形图标。

---

## 无障碍

- 展示图片时：由 **`<img alt>`** 承担名称；若仅有装饰性图片可传 `alt=""`（不推荐用于真实头像）。
- 展示占位时：容器 **`role="img"`**，使用 **`aria-label`**：`alt` 优先，否则「头像 + 缩写」，否则「用户头像」。
- 内置 SVG 图标带 **`aria-hidden`**。

---

## 与 Badge 组合

将 **Avatar** 作为 **Badge** 的 `children` 可做点状/数字提醒（与「按钮 + Badge」相同用法）：

```tsx
<Badge dot color="error">
  <Avatar size="sm" alt="李明" src={url} />
</Badge>
```

---

## 样式与主题

- 使用 `Avatar.module.css` 与 `vars.css` 的语义色、`--su-radius`、`--su-border-subtle`。
- 暗色主题下各 `color` 前景色已略提亮以保证对比。

---

## 常见问题（FAQ）

**Q：图片跨域或 403 一直失败？**  
A：`onError` 会触发占位；请检查 URL、CORS 与鉴权；静态头像建议走同源或允许匿名读的 CDN。

**Q：能否传入 `next/image`？**  
A：本组件内置 `<img>`；若用 Next Image，可自行用 `Image` 做同样尺寸的圆形容器，或 fork 样式逻辑。

**Q：需要方形头像不要圆？**  
A：使用 `shape="rounded"` 并在外层 `className` 覆盖 `border-radius`（例如 `rounded-none`），或向库提需求增加 `shape="square"`。

---

## 检查清单

- [ ] 真实用户头像提供 **`alt` 或 有意义的 `children` 字符串** 以便读屏  
- [ ] 列表中大量头像注意 **图片体积与懒加载**（业务层 `loading="lazy"` 等）  
- [ ] 与 **Badge** 组合时，Badge 的 `aria-label` 是否需补充「未读」等语义  
