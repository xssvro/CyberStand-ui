# 布局工具（Flex / Grid / Stack / Space）- AI 使用指南

面向「少写布局样板、统一间距语义」：四个组件均基于原生 **flex** / **grid**，间距走 **`vars.css`** 中的 `--su-space-*`，与 **Button / Card** 等组件同一套 token。实现以 `Layout/*.tsx` + `core/layoutSpacing.ts` 为准。

---

## 快速开始

```tsx
import { Flex, Grid, Stack, Space } from 'stand-ui/components/Layout';
// 或
import { Flex, Grid, Stack, Space } from 'stand-ui/components';
```

```tsx
<Stack gap="lg" fullWidth>
  <Typography variant="caption" color="muted">
    区块标题
  </Typography>
  <Flex justify="between" align="center" wrap gap="md">
    <span>左侧</span>
    <Button size="sm">操作</Button>
  </Flex>
</Stack>
```

---

## 间距刻度 `LayoutSpacing`

| 关键字 | 约等于 | CSS 变量       |
| ------ | ------ | -------------- |
| `none` | 0      | —              |
| `xs`   | 4px    | `--su-space-1` |
| `sm`   | 8px    | `--su-space-2` |
| `md`   | 12px   | `--su-space-3` |
| `lg`   | 16px   | `--su-space-4` |
| `xl`   | 24px   | `--su-space-6` |
| `2xl`  | 32px   | `--su-space-8` |

`gap` / `size` / `rowGap` / `columnGap` 除关键字外还支持：

- **数字**：按 **px** 解析（如 `gap={16}` → `16px`）
- **任意 CSS 长度**：如 `'1rem'`、`'clamp(8px, 2vw, 16px)'`

类型导入：

```ts
import type { LayoutSpacing } from 'stand-ui/core';
```

常量对照（文档/调试，与主题变量一致）：

```ts
import { LAYOUT_SPACING_PX } from 'stand-ui/core';
```

---

## `Flex`

块级 **`display: flex`**；`inline` 时为 **`inline-flex`**。

### Props

| 属性                   | 类型                                                              | 默认      | 说明                                |
| ---------------------- | ----------------------------------------------------------------- | --------- | ----------------------------------- |
| `inline`               | `boolean`                                                         | `false`   | 行内 flex                           |
| `direction`            | `row` \| `row-reverse` \| `column` \| `column-reverse`            | `row`     | `flex-direction`                    |
| `wrap`                 | `boolean` \| `nowrap` \| `wrap` \| `wrap-reverse`                 | `false`   | `flex-wrap`                         |
| `align`                | `start` \| `end` \| `center` \| `stretch` \| `baseline`           | `stretch` | `align-items`                       |
| `justify`              | `start` \| `end` \| `center` \| `between` \| `around` \| `evenly` | `start`   | `justify-content`                   |
| `alignContent`         | CSS 值                                                            | —         | 多行时主轴堆叠（`wrap` 换行时常用） |
| `gap`                  | `LayoutSpacing` \| `number` \| `string`                           | —         | 统一槽距                            |
| `rowGap` / `columnGap` | 同上                                                              | —         | 与 `gap` 组合时拆分行列距           |

其余 **`div` 属性**（`className`、`style`、`onClick`、`data-*`、`aria-*` 等）**透传**。

### 示例

```tsx
<Flex gap="md" justify="between" align="center" wrap>
  <Typography variant="bodySmall" noMargin>
    说明文案
  </Typography>
  <Button size="sm">确认</Button>
</Flex>

<Flex direction="column" gap="sm" align="start">
  <span>第一行</span>
  <span>第二行</span>
</Flex>

<Flex wrap gap="sm" alignContent="start">
  {items.map((x) => (
    <Card key={x}>{x}</Card>
  ))}
</Flex>
```

---

## `Stack`

在 **`Flex`** 上约定默认值：**纵向**、**交叉轴拉伸**、**`gap="md"`**。适合表单、设置页、垂直列表。

### 额外 Props

| 属性        | 类型      | 默认    | 说明                                              |
| ----------- | --------- | ------- | ------------------------------------------------- |
| `fullWidth` | `boolean` | `false` | `width: 100%` + `minWidth: 0`，避免 flex 子项溢出 |

### 示例

```tsx
<Stack fullWidth className="max-w-sm">
  <Input placeholder="邮箱" />
  <Input type="password" placeholder="密码" />
  <Button color="primary" block>
    登录
  </Button>
</Stack>

<Stack direction="row" gap="sm" align="center">
  <Button size="xs">筛选</Button>
  <Button size="xs" variant="ghost">
    重置
  </Button>
</Stack>
```

---

## `Grid`

**`display: grid`**；`columns` / `rows` 为数字时生成 **`repeat(n, minmax(0, 1fr))`**，字符串则原样作为 **`grid-template-columns` / `grid-template-rows`**。

### Props

| 属性                                                              | 类型                 | 说明                                                                         |
| ----------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------- |
| `columns`                                                         | `number` \| `string` | 列数或模板                                                                   |
| `rows`                                                            | `number` \| `string` | 行数或模板                                                                   |
| `minChildWidth`                                                   | `number` \| `string` | 与 `columns` **互斥**；生成响应列 `minmax(..., 1fr)`                         |
| `autoRepeat`                                                      | `fill` \| `fit`      | 与 `minChildWidth` 搭配：`fill`→`auto-fill`（默认），`fit`→`auto-fit` 列拉满 |
| `autoRows`                                                        | CSS `grid-auto-rows` | 如 `minmax(0, auto)`、`minmax(120px, auto)`                                  |
| `gap` / `rowGap` / `columnGap`                                    | 同 Flex              | —                                                                            |
| `alignItems` / `justifyItems` / `alignContent` / `justifyContent` | CSS                  | —                                                                            |
| `autoFlow`                                                        | CSS `grid-auto-flow` | —                                                                            |

### 示例

```tsx
<Grid columns={3} gap="md">
  <Card>一</Card>
  <Card>二</Card>
  <Card>三</Card>
</Grid>

<Grid columns="minmax(0, 1fr) 2fr" gap="lg" rowGap="md">
  <aside>侧栏</aside>
  <main>主区</main>
</Grid>

<Grid minChildWidth={200} autoRepeat="fit" gap="md">
  {cards.map((c) => (
    <Card key={c.id}>{c.title}</Card>
  ))}
</Grid>

<Grid columns={2} autoRows="minmax(120px, auto)" gap="sm">
  <div>等高行由内容撑开</div>
  <div>…</div>
</Grid>
```

---

## `Space`

在 **`Flex`** 上约定：**横向**（或纵向）、**`size="sm"`**；横向时默认 **`align="center"`**（纵向为 **`stretch`**）。适合工具栏、标签组、面包屑式排列；支持 **`split`** 在子项之间插入分隔（仍参与同一 `gap`）。

### 额外 Props

| 属性        | 类型                       | 默认         | 说明                                     |
| ----------- | -------------------------- | ------------ | ---------------------------------------- |
| `direction` | `horizontal` \| `vertical` | `horizontal` | —                                        |
| `size`      | 同 `gap`                   | `sm`         | 槽距                                     |
| `wrap`      | `boolean`                  | `false`      | 换行                                     |
| `align`     | 同 Flex                    | 见上         | 可覆盖默认对齐                           |
| `block`     | `boolean`                  | `false`      | 横向时 **`width: 100%`**，工具条铺满容器 |
| `split`     | `ReactNode`                | —            | 插在相邻**子节点**之间                   |

### 示例

```tsx
<Space wrap size="md">
  <Button size="sm">新建</Button>
  <Button size="sm" variant="soft">
    导入
  </Button>
  <Button size="sm" variant="ghost">
    更多
  </Button>
</Space>

<Flex justify="between" align="center" gap="md" className="w-full">
  <Typography variant="bodySmall" noMargin>
    左侧标题
  </Typography>
  <Space size="sm">
    <Button size="xs">编辑</Button>
    <Button size="xs" variant="ghost">
      更多
    </Button>
  </Space>
</Flex>

<Space direction="vertical" size="sm" align="start">
  <span>上</span>
  <span>下</span>
</Space>

<Space
  size="sm"
  split={<Divider orientation="vertical" spacing="none" />}
>
  <Typography variant="caption" noMargin>
    首页
  </Typography>
  <Typography variant="caption" noMargin>
    文档
  </Typography>
</Space>
```

**注意**：使用 `split` 时，子节点会先被展平再插入分隔，请保证 **`key` 稳定的列表**用 **`React` 可识别子项**（避免纯索引列表在重排时闪烁）。

---

## 版面组合建议

1. **多块示例 / 表单分区**：外层用 **`Stack gap="lg"`** 或 **`xl`**，块与块之间再包一层 **`Stack gap="sm"`** 放标题 + 控件，避免「行与行挤在一起」。
2. **横向一排按钮**：优先 **`Space`**；需要与左侧标题 **`justify-content: space-between`** 时，用 **`Flex justify="between"`** 或 **`Space block` + 嵌套 `Flex`**。
3. **响应卡片墙**：**`Grid minChildWidth` + `autoRepeat="fit"`**，窄屏自动减列、列宽拉满。
4. **嵌套滚动**：子项加 **`minWidth: 0` / `minHeight: 0`**（**`Stack fullWidth`** 已带 **`minWidth: 0`**），避免 flex/grid 子项撑破父级。

---

## 可访问性

- 布局组件**不添加** landmark `role`；页面结构请用 **`main` / `nav` / `section`** 等语义标签包裹或 **`as` 模式**（若后续扩展）。
- **`Space` + `split`** 仅视觉分隔时，分隔符应 **`aria-hidden`**；若表示语义分割，优先使用 **`Divider` / `Separator`** 并遵循其文档。

---

## 文件位置

| 内容     | 路径                                  |
| -------- | ------------------------------------- |
| 组件     | `src/components/Layout/`              |
| 间距解析 | `src/core/layoutSpacing.ts`           |
| 间距变量 | `src/core/vars.css`（`--su-space-*`） |
