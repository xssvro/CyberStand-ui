# 反馈与状态组件 — 实现计划（临时进度书）

> **说明**：与 `FORM_SYSTEM_PLAN.md` 同构：按**依赖从底到上**排期，标记进度；与 `COMPONENT_DEVELOPMENT.md`（怎么做组件）互补。进度变更时请更新勾选状态。

**范围**：页面内反馈与加载/空态展示，**区别于**已有 **`Toast`**（全局轻提示、命令式 API）。

---

## 与现有能力的关系

| 已有 | 说明 |
|------|------|
| **`Toast` / `Toaster`** | 全局角落通知；本计划**不重复** |
| **`Button` `loading`** | 按钮级加载态；**`Spinner` / `Loading`** 提供通用旋转器与区块/全页遮罩，并与之 **token 对齐** |
| **`Typography`** | 文案层级；**`Empty` / `Result` / `Alert`** 可组合或内置简化标题/描述 |
| **`Card` / `Divider`** | 布局容器；**`Callout`** 可与 Card 二选一或并存（Callout 更强调语义色条） |

---

## 建议实现顺序与进度

### 第一阶段：轻量标记与加载原子

| # | 项 | 状态 | 备注 |
|---|----|------|------|
| 1 | **`Badge`**（数字角标 / 圆点；`children` 为锚点或独立展示） | **已完成** | 对齐 `stand` 语义色；无 `children` 时建议 `aria-label` |
| 2 | **`Tag`**（可关闭、可选色 / soft / outlined；只读标签） | **已完成** | 与 Badge 区分：Tag 为**块状标签**，Badge 为**角标/计数** |
| 3 | **`Spinner`**（`size` / `color`；`role="status"` + 可选 `aria-label`） | **已完成** | `Button` `loading` 已复用 `Spinner size="inherit"` |
| 4 | **`Loading`**（区块或全屏：`Spinner` + 遮罩 + 可选 `tip`） | **已完成** | `fullscreen` + `z-index: var(--su-z-loading)`，低于 Toast（`--su-z-toast`） |

---

### 第二阶段：进度与骨架

| # | 项 | 状态 | 备注 |
|---|----|------|------|
| 5 | **`Progress`**（`value` 0–100、`indeterminate`、可选 `size` / `color` / `striped`） | **已完成** | **`role="progressbar"`**；不确定态无 `aria-valuenow`；轨道圆角与系统一致 |
| 6 | **`Skeleton`**（`text` / `circle` / `rect`、`rows`、`active`） | **已完成** | 组合占位；`prefers-reduced-motion` 下静止 |

---

### 第三阶段：页面内提示（非 Toast）

| # | 项 | 状态 | 备注 |
|---|----|------|------|
| 7 | **`Alert`**（`variant`：info/success/warning/error；标题+描述；可关闭；`role="alert"` 慎用） | **未开始** | 默认信息提示可用 **`role="status"`**；真正紧急错误再考虑 `alert` |
| 8 | **`Callout`**（侧色条 / 左边框强调；比 Alert 更「文档/说明」向，可选无图标） | **未开始** | 与 Alert 二选一上线亦可：先 Alert 后 Callout，或合并为 Alert `appearance="callout"` |

---

### 第四阶段：空态与结果页

| # | 项 | 状态 | 备注 |
|---|----|------|------|
| 9 | **`Empty`**（插画/图标槽 + 标题 + 描述 + `extra` 操作区；`image` 可插槽或预设简笔画） | **未开始** | 文档站可用内联 SVG，避免外链图失效 |
| 10 | **`Result`**（`status`：success / error / info / warning / 403 / 404 等；标题、副标题、`extra` 按钮组） | **未开始** | 偏整页/大区块；可内部组合 Icon + Typography + Stack |

---

## 每组件最小 API 备忘（落地时细化）

| 组件 | 建议优先支持的 Props / 行为 |
|------|------------------------------|
| **Badge** | `count`、`dot`、`max`、`showZero`、`color` / `variant` |
| **Tag** | `closable`、`onClose`、`color`、`variant`（solid / soft / outlined） |
| **Spinner** | `size`、`color`、可访问名称 |
| **Loading** | `spinning`、`tip`、`fullscreen`、`children`（包裹即遮罩子树） |
| **Progress** | `percent`、`status`、`showInfo`、`strokeWidth` 或 `size` |
| **Skeleton** | `active`、`paragraph`（行数/宽度）、`avatar`、`loading` 受控包裹 |
| **Alert** | `type`、`title`、`message`、`closable`、`onClose`、`banner`（可选通栏） |
| **Callout** | `title`、`children`、`intent`（与 Alert 对齐语义色） |
| **Empty** | `image`、`description`、`children`（extra） |
| **Result** | `status`、`title`、`subTitle`、`extra` |

---

## 文档与站点（每项完成后）

- 各组件 **`*.ai.md`**、`src/docs/components.ts` 注册、`ComponentPage.tsx` 预览与 **`componentMap` / `aiDocMap`**。
- 在 **`Alert` / `Empty` 文档中明确写清**：与 **`Toast`** 的选用边界（持久 vs 瞬时、阻断 vs 非阻断）。

---

## 相关路径

| 用途 | 路径 |
|------|------|
| 现有全局反馈 | `src/components/Toast/` |
| Token | `src/core/vars.css`、`src/core/stand.ts` |
| 文档站注册 | `src/docs/components.ts`、`src/pages/ComponentPage.tsx` |
| 开发规范 | `COMPONENT_DEVELOPMENT.md` |

---

## 下一步建议

1. 第三阶段：**Alert**、**Callout**（或合并为 Alert 的 `appearance`）。  
2. **Alert** 与 **Callout** 若高度重叠，可先实现 **Alert + `variant`/`layout`**，再拆 Callout，避免两套并行维护。
