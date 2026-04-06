# Typography 组件 - AI 使用指南

面向「一次查全」：下列覆盖 **全部 variant / color / 对齐 / 字重 / 截断 / 可复制 / 链接 / 多态 as / 透传 HTML 属性 / 常见版面组合**。实现以 `Typography.tsx` + `Typography.module.css` + `vars.css` 为准。

---

## 快速开始

```tsx
import { Typography, TypographyLink } from 'stand-ui/components/Typography';

<Typography variant="h1">标题</Typography>
<Typography variant="body">正文</Typography>
<TypographyLink href="/settings">站内链接</TypographyLink>
<Typography.Link href="https://example.com" external>
  外链
</Typography.Link>
```

---

## 全部 `variant` 与默认标签

未传 `as` 时的默认元素（SEO / 无障碍友好）：

| variant      | 默认标签                              |
| ------------ | ------------------------------------- |
| `display`    | `h1`                                  |
| `h1` … `h6`  | `h1` … `h6`                           |
| `subtitle`   | `p`                                   |
| `lead`       | `p`                                   |
| `bodyLarge`  | `p`                                   |
| `body`       | `p`                                   |
| `bodySmall`  | `p`                                   |
| `caption`    | `span`                                |
| `label`      | `label`                               |
| `overline`   | `span`                                |
| `code`       | `code`                                |
| `blockquote` | `blockquote`                          |
| `link`       | `span`（仅下划线样式，**无** `href`） |

### 一次列出所有 variant（速查）

```tsx
<Typography variant="display">display</Typography>
<Typography variant="h1">h1</Typography>
<Typography variant="h2">h2</Typography>
<Typography variant="h3">h3</Typography>
<Typography variant="h4">h4</Typography>
<Typography variant="h5">h5</Typography>
<Typography variant="h6">h6</Typography>
<Typography variant="subtitle">subtitle</Typography>
<Typography variant="lead">lead</Typography>
<Typography variant="bodyLarge">bodyLarge</Typography>
<Typography variant="body">body</Typography>
<Typography variant="bodySmall">bodySmall</Typography>
<Typography variant="caption">caption</Typography>
<Typography variant="label" as="label" htmlFor="field-a">label</Typography>
<Typography variant="overline">overline</Typography>
<Typography variant="code" as="code">code</Typography>
<Typography variant="blockquote">blockquote</Typography>
<Typography variant="link">link 样式（非真实链接）</Typography>
```

---

## 全部 `color`

| 取值                                     | 用途提示                             |
| ---------------------------------------- | ------------------------------------ |
| `default`                                | 主正文                               |
| `muted`                                  | 次要说明                             |
| `subtle`                                 | 更弱一层                             |
| `emphasis`                               | 强调                                 |
| `inverse`                                | **深底**上的反色字（父级需深色背景） |
| `primary` / `secondary`                  | 品牌主/次                            |
| `info` / `success` / `warning` / `error` | 状态语义                             |

### 色板一行展示（body 上）

```tsx
<Typography variant="body" color="default">default</Typography>
<Typography variant="body" color="muted">muted</Typography>
<Typography variant="body" color="subtle">subtle</Typography>
<Typography variant="body" color="emphasis">emphasis</Typography>
<Typography variant="body" color="primary">primary</Typography>
<Typography variant="body" color="secondary">secondary</Typography>
<Typography variant="body" color="info">info</Typography>
<Typography variant="body" color="success">success</Typography>
<Typography variant="body" color="warning">warning</Typography>
<Typography variant="body" color="error">error</Typography>
```

### `inverse`（示例：父级深色条）

```tsx
<div style={{ background: '#0f1419', padding: 12, borderRadius: 8 }}>
  <Typography variant="body" color="inverse">
    深色背景上的说明文字
  </Typography>
</div>
```

### 变体自带色与 `default` 的关系

`subtitle`、`blockquote`、`code` 在 `color="default"` 时**不会**强行套 `color-default`，以保留变体默认的 muted / 代码色等。若要在副标题上强制主色，显式写 `color="primary"` 等即可。

---

## 全部 `textAlign`

```tsx
<Typography variant="body" textAlign="start">start（逻辑起始侧）</Typography>
<Typography variant="body" textAlign="center">center</Typography>
<Typography variant="body" textAlign="end">end</Typography>
<Typography variant="body" textAlign="justify">justify（长文慎用）</Typography>
```

---

## 全部 `weight`

```tsx
<Typography variant="body" weight="normal">normal 400</Typography>
<Typography variant="body" weight="medium">medium 500</Typography>
<Typography variant="body" weight="semibold">semibold 600</Typography>
<Typography variant="body" weight="bold">bold 700</Typography>
```

可与任意 `variant` 叠加（例如 `caption` + `weight="semibold"`）。

---

## `truncate` 与 `lineClamp`

| Prop            | 行为                            |
| --------------- | ------------------------------- |
| `truncate`      | 单行省略，`white-space: nowrap` |
| `lineClamp={n}` | 最多 n 行，多行省略             |

```tsx
<div style={{ maxWidth: 240 }}>
  <Typography variant="body" truncate noMargin>
    很长很长单行省略文件名或表格单元格
  </Typography>
</div>
<Typography variant="body" lineClamp={1} noMargin>等价于单行 clamp</Typography>
<Typography variant="body" lineClamp={2} noMargin>第二行起省略</Typography>
<Typography variant="body" lineClamp={4} noMargin>卡片摘要可给更大行数</Typography>
```

**注意**：截断依赖「宽度约束」；无 `max-width` / flex 收缩时可能看不出省略。

---

## `noMargin`

组件对部分 variant 带有默认块级 margin。在 **Card 标题、列表密排、表格内** 等场景用 `noMargin` 去掉，避免间距堆叠。

```tsx
<ul>
  <li>
    <Typography variant="bodySmall" noMargin>
      列表项内紧凑一行
    </Typography>
  </li>
</ul>
```

---

## `copyable`

| 写法                                         | 行为                                                     |
| -------------------------------------------- | -------------------------------------------------------- |
| `copyable`                                   | 等价 `copyable={true}`，复制内容从子节点**递归抽纯文本** |
| `copyable={{ text: '...' }}`                 | 复制固定串，展示文案可与复制内容不同                     |
| `copyable={{ text: '...', tooltip: '...' }}` | `tooltip` 用作复制按钮 `aria-label`                      |

```tsx
<Typography variant="body" copyable>整段纯文本复制</Typography>
<Typography variant="caption" copyable={{ text: 'ORDER-2026-001' }}>
  订单号展示（点复制抄订单号）
</Typography>
<Typography variant="body" copyable={{ text: 'secret', tooltip: '复制密钥' }}>
  自定义无障碍标签
</Typography>
```

富文本子节点时务必测一下抽取结果；复杂 DOM 建议**始终**传 `copyable.text`。

---

## 链接：`TypographyLink` / `Typography.Link`

| 需求                 | 用法                                                |
| -------------------- | --------------------------------------------------- |
| 真实跳转、键盘可达   | `TypographyLink` 或 `Typography.Link`（渲染 `<a>`） |
| 仅下划线风格、无导航 | `variant="link"` + `as="span"` 等                   |

```tsx
<TypographyLink href="/app" color="info">站内</TypographyLink>
<TypographyLink href="/pricing" color="primary">primary 链接</TypographyLink>
<Typography.Link href="https://npmjs.com" external color="secondary">
  外链新开页
</Typography.Link>
```

`external`：`target="_blank"` + `rel="noopener noreferrer"`。其余 `<a>` 属性（`download`、`rel`、`className`）照常透传。

---

## 多态 `as`（样式与语义分离）

```tsx
{
  /* 视觉上像大标题，语义用 div，避免页面多个 h1 */
}
<Typography variant="h2" as="div" role="heading" aria-level={2}>
  弹窗/抽屉标题区
</Typography>;
{
  /* 段落内辅助说明，避免 p 套 p */
}
<Typography variant="caption" as="span" color="muted">
  （选填）
</Typography>;
{
  /* 行内代码保持语义 code */
}
<Typography variant="code" as="code" noMargin>
  API_KEY
</Typography>;
{
  /* 标签语义 */
}
<Typography variant="label" as="label" htmlFor="user-email">
  邮箱
</Typography>;
```

---

## `ref` 与 `forwardRef`

根元素会收到传入的 `ref`（动态标签同理）。

```tsx
const ref = useRef<HTMLElement>(null);
<Typography ref={ref} variant="h2" as="div">
  可测量或可滚动锚点
</Typography>;
```

---

## 透传原生 HTML 属性

`Typography` 继承 `Omit<HTMLAttributes<HTMLElement>, 'color'>`，常用：

```tsx
<Typography variant="body" id="section-install" data-section="install">
  安装
</Typography>
<Typography variant="body" title="悬停说明">
  带 title
</Typography>
<Typography
  variant="caption"
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  已保存
</Typography>
<Typography variant="body" tabIndex={0} onClick={() => {}} onKeyDown={() => {}}>
  可聚焦块（需自行处理键盘）
</Typography>
```

---

## 版面组合示例

### 文章骨架

```tsx
<article>
  <Typography variant="overline">教程</Typography>
  <Typography variant="h1" as="h1">
    如何接入
  </Typography>
  <Typography variant="subtitle">5 分钟上手</Typography>
  <Typography variant="lead">本文介绍安装与最小示例。</Typography>
  <Typography variant="body">第一段正文……</Typography>
  <Typography variant="blockquote">「引用文档原句」</Typography>
  <Typography variant="bodySmall" color="muted">
    更新于 2026-03-30
  </Typography>
</article>
```

### 描述列表 / 键值

```tsx
<dl>
  <Typography variant="label" as="dt" noMargin>
    状态
  </Typography>
  <Typography variant="body" as="dd" noMargin color="success">
    运行中
  </Typography>
</dl>
```

### 面包屑（链接 + 分隔）

```tsx
<nav aria-label="面包屑">
  <Typography variant="caption" as="span" noMargin>
    <TypographyLink href="/" color="muted">
      首页
    </TypographyLink>
    {' / '}
    <TypographyLink href="/docs" color="muted">
      文档
    </TypographyLink>
    {' / '}
    <Typography variant="caption" as="span" color="default">
      Typography
    </Typography>
  </Typography>
</nav>
```

### 表单字段组

```tsx
<Typography variant="label" as="label" htmlFor="pwd" noMargin>
  密码
</Typography>
<Typography variant="caption" color="error" noMargin>
  至少 8 位
</Typography>
```

### 统计 / KPI 一行

```tsx
<Typography variant="overline" noMargin>今日</Typography>
<Typography variant="h3" noMargin>1,248</Typography>
<Typography variant="caption" color="muted" noMargin>
  较昨日 +12%
</Typography>
```

### 与 `Button` 并排（Typography 作说明）

```tsx
<div className="flex items-center gap-2">
  <Typography variant="bodySmall" noMargin>
    将删除不可恢复
  </Typography>
  <Button size="sm" color="error">
    删除
  </Button>
</div>
```

### 错误区整块

```tsx
<Typography variant="body" color="error" role="alert">
  提交失败：网络超时，请重试。
</Typography>
```

### 法律/页脚小字

```tsx
<Typography variant="caption" color="subtle" textAlign="center">
  © 2026 公司名 · 隐私政策 · 服务条款
</Typography>
```

---

## `className` / `style`

与 BEM / Tailwind / CSS Modules 混用：

```tsx
<Typography variant="h2" className="tracking-tight">
  自定义跟踪字距
</Typography>
<Typography variant="body" style={{ maxWidth: '65ch' }}>
  限制行长提升可读性
</Typography>
```

---

## 注意事项（易踩坑）

1. **`variant="link"`** 不是 `<a>`，无 `href`，爬虫/读屏不会当链接处理。
2. **`copyable`** 依赖 `navigator.clipboard`，非安全上下文可能失败；无复制内容时按钮会 `disabled`。
3. **`lineClamp` + `truncate`**：一般二选一；同时设时以 CSS 层叠为准，建议只用一个。
4. **`inverse`**：浅底上不要用，对比度不足。
5. **标题层级**：页面主标题建议唯一 `h1`；侧栏/模态里大字号用 `as="div"` + `role="heading"` 更稳。
6. **设计 token**：字号行高来自 `vars.css` 的 `--su-type-*`，换主题优先改 CSS 变量。

---

## 与常见库的对应关系（心智模型）

| 本组件                 | MUI                    | Ant Design                                      |
| ---------------------- | ---------------------- | ----------------------------------------------- |
| `display` / `h1`～`h6` | `Typography` variant   | `Typography.Title` level                        |
| `body` / `lead`        | `body1` / `body2` 等   | `Typography.Paragraph`                          |
| `caption` / `overline` | `caption` / `overline` | `Typography.Text type=secondary/success` 等组合 |
| `copyable`             | -                      | `Paragraph` 的 `copyable`                       |
| `Typography.Link`      | `Link` 组件            | `Typography.Link`                               |

---

## 类型导出（TS）

```ts
import type {
  TypographyProps,
  TypographyVariant,
  TypographyColor,
  TypographyAlign,
  TypographyWeight,
  CopyableConfig,
  TypographyLinkProps,
} from 'stand-ui/components/Typography';
```

以上用法均可与 `React 19` + `forwardRef` 一起使用；链接组件单独 `forwardRef<HTMLAnchorElement, TypographyLinkProps>`。
