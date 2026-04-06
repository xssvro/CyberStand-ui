# Avatar 组件 - AI 使用指南

Avatar 用于展示**用户或实体头像**：支持**图片**（`object-fit: cover` 圆内裁切）、**文字缩写**占位、**自定义图标**占位；图片加载失败时自动回退到占位。形状支持**圆形**与**圆角矩形**，尺寸 **xs～xl**，占位底色可走 **Color** 语义。

### 视觉与 CyberStand 理念（DESIGN.md）

- **外框**：`default` 为 **`--su-border-subtle` / 深色 `--su-border-default`** 单层细线，**无**外阴影与内高光；`primary` 等语义占位与 **Button `solid` 同色**，**`border-color: transparent`**，避免主色块外再套一圈灰线。  
- **图片**：**`--su-border-default` 单层外边框**（`withImage`），不用 inset 阴影，避免与占位态形成双线观感。  
- **占位**：`color` 映射 **`--su-btn-*-solid-bg` / `-fg`**（与实心按钮一致：**主色为黄色系** / 夜城黄语义，浅色略压暗、深色为高亮黄）；`default` 为 `bg-muted` + `text-default`。  
- **默认图标**：使用图标库 **`IconUserHud`**（直角细线框 HUD 人形），与文档站侧栏赛博线框图标一致，而非填充剪影。

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
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 外框约 26 / 34 / 42 / 52 / 68 px（略放大以利描边与内高光） |
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

- 使用 `Avatar.module.css` 与 `vars.css`（`--su-border-subtle`、`--su-btn-*-solid-*`、`--su-type-label-weight` 等）。
- 默认占位图标来自 **`IconUserHud`**（`src/icons/CyberIcons.tsx`），可在业务中复用同一 HUD 语言。
- 覆盖外观时可加 `className`；语义色占位默认无边框线，若改成透明底请注意与背景的区分。

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
