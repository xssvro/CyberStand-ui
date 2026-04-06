# AspectRatio 固定宽高比 - AI 使用指南

在容器内维持 **固定宽高比**（封面图、视频占位、方形头像框等）。根节点使用 CSS **`aspect-ratio`**，子内容在 **`position: absolute` 的层** 内铺满；**直接子级**的 **`img` / `video`** 以及 **`picture` 内 `img`** 会套用 **`object-fit`**（默认 **`cover`**）。

实现以 `AspectRatio.tsx` + `AspectRatio.module.css` 为准。

---

## 快速开始

```tsx
import { AspectRatio } from 'stand-ui/components/AspectRatio';
// 或
import { AspectRatio } from 'stand-ui/components';
```

```tsx
<AspectRatio ratio={16 / 9} className="max-w-xl">
  <img src="/cover.jpg" alt="" />
</AspectRatio>

<AspectRatio ratio={1} className="w-32">
  <img src="/avatar.png" alt="" />
</AspectRatio>
```

---

## Props

| 属性                  | 类型                                                     | 默认    | 说明                                                                                                |
| --------------------- | -------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| `ratio`               | `number` \| `string`                                     | `16/9`  | 宽高比；数字为 CSS 数值（如 `1`、`1.777`）；字符串可为 `"16/9"`、`"4 / 3"` 等合法 `aspect-ratio` 值 |
| `objectFit`           | `contain` \| `cover` \| `fill` \| `none` \| `scale-down` | `cover` | 作用于内部 **`img` / `video` / `picture img`**                                                      |
| `className` / `style` | —                                                        | —       | 根容器；可用 `max-w-*`、`width` 控制宽度，高度随比例计算                                            |
| 其余                  | `HTMLAttributes<HTMLDivElement>`                         | —       | 如 `onClick`、`data-*`、`aria-*`（根为 `div`）                                                      |

**子节点**：任意 React 节点；非图片/视频时自行控制铺满（如 `className="w-full h-full"` 的色块）。

---

## `ratio` 写法

| 写法             | 含义                         |
| ---------------- | ---------------------------- |
| `ratio={16 / 9}` | 宽:高 ≈ 16:9                 |
| `ratio={1}`      | 正方形                       |
| `ratio="16/9"`   | 与上等价，由浏览器解析为比例 |
| `ratio="4 / 3"`  | 4:3                          |

---

## 示例

### 视频/封面（默认 cover）

```tsx
<AspectRatio ratio={16 / 9} className="max-w-3xl rounded-lg overflow-hidden">
  <video src="/clip.mp4" controls playsInline />
</AspectRatio>
```

### 完整展示（contain）

```tsx
<AspectRatio ratio={16 / 9} objectFit="contain" className="max-w-md bg-[var(--su-bg-muted)]">
  <img src="/logo.png" alt="Logo" />
</AspectRatio>
```

### 非媒体内容（色块、骨架）

```tsx
<AspectRatio ratio={1} className="max-w-xs rounded-md overflow-hidden">
  <div className="h-full w-full bg-[var(--su-btn-primary-soft-bg)]" aria-hidden />
</AspectRatio>
```

---

## 可访问性

- 装饰性图片请 **`alt=""`** 或父级 **`aria-hidden`**；信息图需有意义 **`alt`**。
- 视频请补充 **`title`**、字幕或文案说明（按业务要求）。

---

## 文件位置

| 内容 | 路径                          |
| ---- | ----------------------------- |
| 组件 | `src/components/AspectRatio/` |
