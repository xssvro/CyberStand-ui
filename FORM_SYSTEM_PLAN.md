# 表单域体系 — 实现计划（临时进度书）

> **说明**：本文档用于对照「依赖从底到上」的落地顺序，并标记**当前仓库已做到哪一步**。与 `COMPONENT_DEVELOPMENT.md`（怎么做组件）互补；进度变更时请随手更新勾选状态。稳定后可删减或并入正式路线图。

---

## 建议实现顺序与进度

### 第一阶段：单字段骨架（最先做）

| # | 项 | 状态 | 备注 |
|---|----|------|------|
| 1 | **`FormField`**（表单项容器：标签 + 控件槽 + 说明 + 错误；间距、必填、`htmlFor`/`id`、`aria-*`） | **已完成** | `src/components/FormField/FormField.tsx` |
| 2 | **`Label`**（或与 Typography 二选一；含 required、禁用态） | **已完成** | `FormField/Label.tsx`，与 `FormField` 配套 |
| 3 | **与现有 `Input` 对齐**（错误态、只读/禁用与标签联动） | **已完成** | `color="error"`、`disabled`、`aria-describedby` 等已联调 |

---

### 第二阶段：常用控件补全

| # | 项 | 状态 | 备注 |
|---|----|------|------|
| 4 | **`Textarea`**（与 Input 共享 token） | **已完成** | `src/components/Textarea/` |
| 5 | **`Select`**（原计划先原生 `<select>`） | **已完成（已升级）** | 当前为**自定义 Listbox + Portal**（`renderValue` / `renderOption` 等），非原生下拉层 |
| 6 | **`Checkbox` + `CheckboxGroup`** | **已完成** | 含纵向/横向组、`FormField` + `invalid` |
| 7 | **`Radio` + `RadioGroup`** | **已完成** | `name` + 受控、`FormField` 组合 |

---

### 第三阶段：开关与分组语义

| # | 项 | 状态 | 备注 |
|---|----|------|------|
| 8 | **`Switch`** | **已完成** | `src/components/Switch/`；`role="switch"`、readOnly、`name` 隐藏域、文档 `/component/Switch` |
| 9 | **`Fieldset` / `FormSection`（可选）** | **已完成** | `src/components/FormSection/`；默认 `fieldset`/`legend`，可选 `as="div"`；文档 `/component/FormSection` |

---

### 第四阶段：整表与校验故事

| # | 项 | 状态 | 备注 |
|---|----|------|------|
| 10 | **`Form`（轻量上下文）** — `layout` / `size`、提交区约定，不绑 RHF | **未开始** | — |
| 11 | **文档与示例** — 各控件与 `FormField` 组合、`*.ai.md`、文档站注册 | **部分完成** | `Switch`、`FormSection` 已独立注册；仍缺轻量 **`Form`** 与「整表组合」专项示例 |

---

### 第五阶段（按需）

| # | 项 | 状态 | 备注 |
|---|----|------|------|
| 12 | **自定义 Select 深化**、日期、文件上传 | **部分完成** | Select 已为自定义实现；日期/上传未做 |
| 13 | **与第三方库集成说明**（RHF、Zod 等）— 文档 + 示例 | **未开始** | 建议仅文档站或 README 片段 |

---

## 最小可用路径（对照）

按原计划的最小路径：

`FormField`（+ Label）→ `Input` → `Textarea` → `Select` → `Checkbox`/`Radio` → **`Switch`** → **`Form`** 与分组组件。

**当前断点**：第三阶段已完成；第四阶段 **`Form` 上下文** 与整表示例、第五阶段集成文档仍待选做。

---

## 下一步建议（可改计划时同步本文）

1. 轻量 **`Form`** 上下文（`layout` / `size`）与文档站 **整表示例**。  
2. Select **可搜索**、日期、上传等按需排入第五阶段。  
3. **RHF / Zod** 等仅文档 + 示例片段。

---

## 相关路径

| 用途 | 路径 |
|------|------|
| 表单容器与标签 | `src/components/FormField/` |
| 开关、分组 | `src/components/Switch/`、`src/components/FormSection/` |
| 文档站注册 | `src/docs/components.ts`、`src/pages/ComponentPage.tsx` |
| 尺寸与圆角 token | `src/core/stand.ts` |
| 开发规范 | `COMPONENT_DEVELOPMENT.md` |
