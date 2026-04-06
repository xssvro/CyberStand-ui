# Pagination 组件 - AI 使用指南

Pagination 用于**列表/表格底部分页**：页码按钮（含省略号）、上一页/下一页、可选「每页条数」与「跳至某页」，以及 `showTotal` 自定义总数区间文案。与 **Table** 组合时，业务侧对全量或当前页数据做 **`slice`**，本组件只负责**页码与条数 UI + 回调**。

设计参考 **Ant Design Pagination**、**Element Plus el-pagination** 的常见能力；API 保持受控/非受控清晰，不内置请求。

---

## 快速开始

```tsx
import { Pagination } from 'stand-ui/components/Pagination';
import { useState } from 'react';

const pageSize = 10;
const total = 127;
const [page, setPage] = useState(1);

<Pagination
  current={page}
  pageSize={pageSize}
  total={total}
  onChange={(p) => setPage(p)}
  showTotal={(range, t) => `第 ${range[0]}-${range[1]} 条，共 ${t} 条`}
/>;
```

---

## 与 Table 组合（数据 slice）

```tsx
const [page, setPage] = useState(1);
const pageSize = 10;
const rows = useMemo(() => allRows.slice((page - 1) * pageSize, page * pageSize), [allRows, page]);

<Stack gap="md">
  <Table bordered shadow="sm">
    {/* 用 rows 渲染 tbody */}
  </Table>
  <Pagination
    align="end"
    current={page}
    pageSize={pageSize}
    total={allRows.length}
    onChange={(p) => setPage(p)}
  />
</Stack>;
```

若总数来自服务端且为**仅当前页数组**，需额外保存 **`total`（总条数）** 字段，勿把 `rows.length` 当成总条数。

---

## Props 说明

除下表外，支持 `React.HTMLAttributes<HTMLElement>` 中可作用于 `<nav>` 的属性（如 `className`、`style`、`id`）。**不要**把原生 `onChange` 当作分页回调（已 Omit），请使用本组件的 **`onChange`**。

| Prop               | 类型                                                    | 默认值              | 说明                                                                  |
| ------------------ | ------------------------------------------------------- | ------------------- | --------------------------------------------------------------------- |
| `total`            | `number`                                                | **必填**            | 数据总条数（用于计算总页数）                                          |
| `current`          | `number`                                                | -                   | 当前页（从 1 开始）；传入即**受控**                                   |
| `defaultCurrent`   | `number`                                                | `1`                 | 非受控初始页                                                          |
| `pageSize`         | `number`                                                | -                   | 每页条数；传入即**受控**                                              |
| `defaultPageSize`  | `number`                                                | `10`                | 非受控初始每页条数                                                    |
| `pageSizeOptions`  | `number[]`                                              | `[10, 20, 50, 100]` | `showSizeChanger` 时的选项                                            |
| `onChange`         | `(page: number, pageSize: number) => void`              | -                   | 页码或每页条数变化时触发；**改每页条数时页码会回到 1**（与 Ant 一致） |
| `disabled`         | `boolean`                                               | `false`             | 禁用按钮、下拉与跳转框                                                |
| `hideOnSinglePage` | `boolean`                                               | `false`             | **仅当** `total > 0` 且总页数 ≤ 1 时不渲染                            |
| `showSizeChanger`  | `boolean`                                               | `false`             | 显示「每页」+ `Select`                                                |
| `showQuickJumper`  | `boolean`                                               | `false`             | 显示跳页输入框；**回车**提交并跳转                                    |
| `showTotal`        | `(range: [number, number], total: number) => ReactNode` | -                   | 左侧文案；`range` 为当前页首尾条序号（1-based），`total` 为总条数     |
| `simple`           | `boolean`                                               | `false`             | 极简：‹ · 当前/总页 · ›                                               |
| `size`             | `'sm' \| 'md' \| 'lg'`                                  | `'md'`              | 整体字号与按钮高度                                                    |
| `align`            | `'start' \| 'center' \| 'end'`                          | `'start'`           | 整条分页在容器内的主轴对齐                                            |
| `siblingDelta`     | `number`                                                | `2`                 | 当前页左右额外展示的页码个数（不含当前页），用于控制省略号出现时机    |
| `navAriaLabel`     | `string`                                                | `'分页'`            | `<nav>` 的 `aria-label`                                               |
| `prevAriaLabel`    | `string`                                                | `'上一页'`          | 上一页按钮                                                            |
| `nextAriaLabel`    | `string`                                                | `'下一页'`          | 下一页按钮                                                            |

**`ref`**：转发到外层 `<nav>`。

---

## 页码序列与 `buildPaginationItems`

内部使用 `buildPaginationItems(current, totalPages, siblingDelta)` 生成 `(number | 'ellipsis')[]`。当总页数 ≤ 7 时展示全部页码；更多时自动插入省略号。若需在别处复用同一套序列（例如自定义 `itemRender` 扩展），可从包入口导入：

```tsx
import { buildPaginationItems } from 'stand-ui/components/Pagination';
```

当前 **Pagination** 未暴露 `itemRender`；需要完全自定义按钮时，可用该函数自行渲染列表。

---

## 受控与非受控

| 场景         | 做法                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| 受控页码     | 传 `current` + `onChange`，父组件更新 `current`                                                          |
| 受控每页条数 | 传 `pageSize` + `onChange`，`onChange` 的第二个参数为新 `pageSize`                                       |
| 非受控       | 不传 `current` / `pageSize`，用 `defaultCurrent`、`defaultPageSize`；仍需 `onChange` 若需同步 URL 或日志 |

**改 `pageSize` 时** 会调用 `onChange(1, newPageSize)`，请同步更新列表请求或 slice 起点。

---

## 无障碍

- 根节点为 `<nav aria-label>`，页码按钮带 `aria-label`；当前页按钮带 `aria-current="page"`。
- 省略号节点 `aria-hidden`。
- 「每页」与 `Select` 通过 `useId` 生成唯一 `aria-labelledby`，避免同页多个分页冲突。

---

## 样式与主题

- 使用 `Pagination.module.css`，颜色与边框来自 `vars.css`（`--su-border-default`、`--su-primary-*`、`--su-bg-elevated` 等）。
- `showSizeChanger` 使用库内 **Select**，尺寸与 Pagination 的 `size` 大致对齐。

---

## 常见问题（FAQ）

**Q：`total={0}` 时表现？**  
A：总页数为 0，上一页/下一页禁用，极简模式显示 `0 / 0`；页码列表为空。`hideOnSinglePage` 要求 `total > 0` 才隐藏，故空列表仍会显示分页（可业务层自行不渲染）。

**Q：服务端分页怎么接？**  
A：`onChange` 里请求 `page`、`pageSize`，返回后更新 `current`/`pageSize` 与列表数据；`total` 用接口返回的总条数。

**Q：为何改每页条数会回到第 1 页？**  
A：与 Ant Design 行为一致，避免 `pageSize` 变大后仍停在超大页码导致空数据。

---

## 检查清单

- [ ] `total` 为**全量条数**，不是当前页数组长度（除非确实只有一页数据）
- [ ] 受控时 `current` 与 `onChange` 成对使用
- [ ] Table + Pagination 时 `slice` 区间与 `page`、`pageSize` 一致
