# CyberStand UI — 组件开发规范

本文档供**后续人类与 AI 助手**在仓库内新增、修改组件时遵循。更偏「怎么做」；设计动机与灵感见根目录 **DESIGN.md**，色彩与 token 的**唯一真源**为 **`src/core/vars.css`**。

---

## 1. 相关路径速查

| 用途 | 路径 |
|------|------|
| 组件实现 | `src/components/<ComponentName>/` |
| 组件库统一导出 | `src/components/index.ts` |
| 设计 token（颜色、背景、文案、阴影、圆角等） | `src/core/vars.css` |
| 通用类型与尺寸/圆角工具 | `src/core/stand.ts`、`src/core/index.ts` |
| 文档站组件注册（侧边栏 + 示例代码块） | `src/docs/components.ts` |
| 文档站页面（预览、Markdown 渲染、Tab） | `src/pages/ComponentPage.tsx` |
| 文档站布局与全局样式 | `src/pages/Layout.tsx`、`src/pages/docs.css` |
| 自制 SVG 图标（HUD / 赛博风） | `src/icons/` |
| 设计理念与影像参照 | `DESIGN.md` |

---

## 2. 色彩与设计科学（摘要）

- **单一真源**：组件样式**优先使用** `vars.css` 中的 `--su-*` 变量（如 `--su-primary-600`、`--su-text-default`、`--su-border-default`），避免在组件里写死十六进制色值，除非局部演示覆盖。
- **语义分工**（与 DESIGN.md 一致）：深色底压噪；**主色黄**作品牌/主操作锚点；**信息蓝**作链接、焦点、信息态；**珊瑚/错误色**作危险、次要强调，避免整屏高饱和红。
- **可读优先**：正文用冷灰 slate 系 token；霓虹感仅用于强调与状态，不替代正文对比度。
- **多端理念**：当前仓库以 Web（CSS Variables）为参考实现；文档与 token 命名保持**框架无关**，避免在对外文案中绑定特定框架名（见历史约定）。

---

## 3. 标准目录与文件

每个组件独占一个目录，**至少**包含：

```
src/components/MyComponent/
├── MyComponent.tsx          # 实现（TypeScript + React）
├── MyComponent.module.css   # 样式（CSS Modules，类名局部化）
├── MyComponent.ai.md        # 给 AI/人类看的用法说明（强烈建议始终维护）
└── index.ts                 # export 组件与类型
```

约定：

- **样式**：使用 **CSS Modules**（`*.module.css`），通过 `className={styles.xxx}` 引用；全局主题依赖 `vars.css` 中的变量。
- **类型**：从 `core/stand` 复用 `StandProps`、`Size`、`Color` 等（若适用）；组件专有类型写在同目录或 `stand.ts` 扩展。
- **组件**：优先 `forwardRef`（可聚焦元素），并设置 **`displayName`** 便于调试。
- **Props**：与现有组件一致时保持命名（如 `size`、`color`、`variant`、`className`、`style`）；`style` 在 TS 中可为 `React.CSSProperties`，文档面向多端时可描述为「样式对象」。

---

## 4. 引入方式（消费方）

文档与 `.ai.md` 中的 import 路径可按发布方式二选一书写（与 README 一致即可）：

```tsx
// 从包入口（发布后在应用中使用）
import { Button } from 'stand-ui/components';

// 从单组件路径（文档站 / 本地调试常用）
import { Button } from 'stand-ui/components/Button';
```

本仓库内开发：`import { Button } from '../components/Button'` 等相对路径。

新增组件后必须在 **`src/components/index.ts`** 中导出组件及 `Props` 类型。

---

## 5. AI 文档（`*.ai.md`）规范

`*.ai.md` 的目标：**让 AI 编码助手在不读源码的情况下，也能正确拼写 Props、组合示例与覆盖样式**。

建议结构：

1. **标题**：`# <Component> 组件 - AI 使用指南`
2. **快速开始**：最短 import + 一行用法示例（`tsx` 代码块）。
3. **Props 完整说明**：Markdown **表格**，列包含 `Prop | 类型 | 默认值 | 说明`。
   - 类型列：用反引号包裹；联合类型注意表格内 `|` 的转义或表述方式，避免破坏表格解析（可参考现有 Button.ai.md）。
   - **可渲染子节点**：文档中可写「可渲染子节点」，避免过度绑定某一框架类型名。
4. **常用组合示例**：分小节（标题 + 代码块），覆盖典型场景与错误/加载等状态。
5. **样式覆盖**：说明如何通过 **CSS Variables**（`--su-*`）或 `className` / `style` 扩展；必要时给出一行示例。

禁忌与注意：

- 保持与**真实导出 API** 一致；Props 变更时**同步改** `.ai.md`。
- 对外描述以「通用 UI」为主，不必强调特定单端框架，除非该 Props 仅某端存在。

---

## 6. 文档站注册（必须步骤清单）

新增组件要在文档站出现，需完成以下步骤（缺一可能导致 404 或无预览）：

1. **`src/docs/components.ts`**  
   - 在 `componentDocs` 数组中追加一项：`name`（路由段，与文件夹名一致）、`title`、**`category`**（`通用` | `表单` | `布局` | `反馈`，侧边栏与首页按 `COMPONENT_DOC_CATEGORY_ORDER` 分组）、`description`、`aiDocPath`、`examples`（多组 `title` + `code` 字符串）。

2. **`src/pages/ComponentPage.tsx`**  
   - `import` 组件（若需预览）。  
   - `import XxxAiMd from '../components/Xxx/Xxx.ai.md?raw'`。  
   - **`componentMap`**：`name` → 组件。若组件**无 UI**（如纯命令式 API），可设占位组件 `() => null` 并加注释说明。  
   - **`aiDocMap`**：`name` → raw 字符串变量。  
   - **`renderExample`**：按 `doc.name === 'Xxx'` 分支编写交互预览；示例索引与 `examples` 数组下标对应（`idx`）。

3. **`src/components/index.ts`**  
   - 导出组件与类型。

---

## 7. 图标与资源

- 文档站优先使用 **`src/icons/`** 下自制 SVG（赛博 / HUD 线框风），避免在侧栏、特性区等使用 emoji 作为图标。
- 新增图标：在 `CyberIcons.tsx` 或单独文件实现，经 `src/icons/index.ts` 导出，保持 `currentColor` 与尺寸由父级控制。

---

## 8. 代码风格与质量

- **TypeScript**：严格模式；避免滥用 `any`；未使用变量/参数需处理（与现有 ESLint 一致）。
- **可访问性**：交互组件补充 `aria-*`、`role`、键盘可操作；图标装饰用 `aria-hidden`。
- **文案**：用户可见字符串与 DESIGN 品牌名（CyberStand UI）一致。

---

## 9. 自检清单（提交前）

- [ ] `vars.css` 中已有对应语义，未随意新增无 token 的硬编码色。
- [ ] `*.ai.md` 与 Props、示例一致。
- [ ] 已更新 `src/components/index.ts`。
- [ ] 已更新 `src/docs/components.ts` 与 `ComponentPage.tsx`（含 `componentMap`、`aiDocMap`、预览）。
- [ ] 本地 `npm run dev` 打开 `/component/<Name>` 可看到文档与预览（或占位说明）。

---

## 10. 参考文件

| 说明 | 文件 |
|------|------|
| 组件 + Props + AI 文档范例 | `src/components/Button/` |
| 注册表范例 | `src/docs/components.ts` |
| 文档页集成范例 | `src/pages/ComponentPage.tsx` |
| Token 全集 | `src/core/vars.css` |
| 设计叙事 | `DESIGN.md` |

---

*文档版本随仓库迭代；若与代码冲突，以 `vars.css` 与组件源码为准。*
