# Table 组件 - AI 使用指南

Table 提供**数据表格的视觉与语义骨架**：基于原生 `<table>` / `<thead>` / `<tbody>` 等标签的组合式子组件，使用 CSS Modules 与 `vars.css` 中的表面色、边框与字号 token，与 Card、Typography、Stack 等组件风格一致。

**本版范围**：展示结构、**圆角外框**、尺寸（含 **xs**）、斑马纹、**`border-collapse: collapse` 网格**、**`shadow` / `loading` / `TableEmpty`**、行悬停、列对齐、等宽数字、`layout`、表头 sticky；**受控约定下的列排序**（`TableHead` 的 `sortable` + `aria-sort` + 内嵌按钮）与 **筛选工具条容器 `TableToolbar`**；工具函数 **`cycleTableSortOrder`**。仍为**组合式** API，不设 `columns` / `dataSource`，**排序比较与筛选逻辑在父组件**（`useMemo` 中 `filter`/`sort`）。

**不提供**：全自动 `dataSource` 排序、服务端请求封装、行选择、虚拟滚动；**分页**请用 **Pagination** + `slice`。

---

## 快速开始

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'stand-ui/components/Table';

<Table bordered shadow="sm">
  <TableCaption>销售概览</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead scope="col">区域</TableHead>
      <TableHead scope="col">金额</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>华东</TableCell>
      <TableCell align="end" numeric>
        12,800.00
      </TableCell>
    </TableRow>
  </TableBody>
</Table>;
```

### DOM 结构（与 Ant / Element 常见实现一致）

1. **外层 `div`（`.root`）**：`border-radius: var(--su-radius)` + **`overflow: hidden`**，承担 **`shadow="sm"`**（与背景裁剪），解决表格直角顶破圆角的问题。
2. **加载遮罩**：`loading` 时在该层内绝对定位半透明层 + `Spinner`，`pointer-events: auto` 拦截点击。
3. **内层 `div`（`.scrollInner`）**：**仅横向** `overflow-x: auto`，窄屏可滑动。
4. **`<table>`**：`bordered` 时使用 **`border-collapse: collapse`**，**外框 1px** 与**单元格网格**都画在 `table` / `th` / `td` 上。这样 **`colSpan` / `rowSpan` 合并后**，网格线仍与布局一致（不再依赖 `:last-child` 去右边线，避免 rowspan 下一行缺竖线）。

`className` / `style` 仍传到 **`<table>`**；若要控制最外框边距，请用 **`wrapperClassName`**（或在外再包一层布局容器）。

---

## 组件树与 HTML 对应关系

| 导出组件       | 对应标签                              | 职责                                                                                                                                                  |
| -------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Table`        | 外层圆角容器 + 横向滚动层 + `<table>` | 根：`size`、斑马纹、`bordered`（`table` 上外框 + `collapse` 网格）、`shadow`、`loading`、`hoverable`、`layout`、`stickyHeader`；透传标准 `table` 属性 |
| `TableCaption` | `<caption>`                           | 表格标题条（顶栏背景 + 底部分割，类似工具条区）                                                                                                       |
| `TableEmpty`   | `<tr>` 包一行合并单元格               | 空数据占位，类似 Ant `locale.emptyText`                                                                                                               |
| `TableHeader`  | `<thead>`                             | 列标题区域                                                                                                                                            |
| `TableBody`    | `<tbody>`                             | 数据行区域                                                                                                                                            |
| `TableFooter`  | `<tfoot>`                             | 汇总行、分页说明等（可选）                                                                                                                            |
| `TableRow`     | `<tr>`                                | 行                                                                                                                                                    |
| `TableHead`    | `<th>`                                | 列头；可选 **可排序**（`sortable` + `onSort` + 受控 `sortOrder`）                                                                                     |
| `TableCell`    | 默认 `<td>`，`as="th"` 时为 `<th>`    | 数据格；行表头用 `as="th"` 并设 `scope="row"`                                                                                                         |
| `TableToolbar` | `<div role="toolbar">`                | 表格外筛选/操作横条，与 **Input / Select / Button** 组合                                                                                              |

---

## `Table` 根组件 Props

除下表所列外，支持 React 的 `TableHTMLAttributes<HTMLTableElement>`（如 `id`、`role`、`aria-*`，以及原生 `summary` 等）。

| Prop               | 类型                           | 默认值   | 说明                                                                           |
| ------------------ | ------------------------------ | -------- | ------------------------------------------------------------------------------ |
| `size`             | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'`   | 全表字号与内边距；`xs` 接近 Element 紧凑表格                                   |
| `striped`          | `boolean`                      | `false`  | 仅 `tbody` 内隔行背景色                                                        |
| `bordered`         | `boolean`                      | `false`  | **`table` 外框 1px** + **单元格网格**（`collapse` 合并线，合并单元格边框正确） |
| `hoverable`        | `boolean`                      | `false`  | 仅 `tbody` 行鼠标悬停背景                                                      |
| `layout`           | `'auto' \| 'fixed'`            | `'auto'` | `table-layout`；`fixed` 适合配合列宽与文本省略                                 |
| `stickyHeader`     | `boolean`                      | `false`  | 表头 `position: sticky; top: 0`；需在**纵向可滚动祖先**内才明显（见下文）      |
| `loading`          | `boolean`                      | `false`  | 遮罩 + 主色 `Spinner`，`aria-busy`；拦截表体点击                               |
| `shadow`           | `'none' \| 'sm'`               | `'none'` | 外层 `box-shadow: var(--su-shadow-sm)`，列表页常用                             |
| `wrapperClassName` | `string`                       | -        | 加到**最外层**圆角容器                                                         |
| `className`        | `string`                       | -        | 加到 `<table>` 上                                                              |
| `style`            | `CSSProperties`                | -        | 加到 `<table>` 上                                                              |
| `children`         | `ReactNode`                    | **必填** | 通常 `caption` + `thead` + `tbody`（+ 可选 `tfoot`）                           |

**`ref`**：转发到内层 **`<table>`**，不指向外层圆角容器。

---

## 子组件 Props 摘要

### `TableHeader` / `TableBody` / `TableFooter` / `TableRow`

分别对应 `<thead>`、`<tbody>`、`<tfoot>`、`<tr>` 的 `HTMLAttributes`，仅增加 `className` 合并；**无**额外业务 Props。

### `TableCaption`

对应 `<caption>` 的 `HTMLAttributes`。默认 `caption-side: top`，带浅底与底部分割，与表头区区分。若标题需在表下方，可用 `style={{ captionSide: 'bottom' }}` 覆盖。

### `TableHead`（列头 `<th>`）

| Prop            | 类型                                          | 默认值    | 说明                                                                                                                                     |
| --------------- | --------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `align`         | `'start' \| 'center' \| 'end'`                | `'start'` | 文本对齐；排序列 `end` 时按钮右对齐                                                                                                      |
| `numeric`       | `boolean`                                     | -         | 为真时施加 `font-variant-numeric: tabular-nums`，适合金额、数量列标题与数据对齐                                                          |
| `sortable`      | `boolean`                                     | `false`   | 为真且传入 `onSort` 时，列头内渲染 **`<button type="button">`**，并在 `th` 上设置 **`aria-sort`**（`ascending` / `descending` / `none`） |
| `sortOrder`     | `TableSortOrder`（`'asc' \| 'desc' \| null`） | `null`    | **受控**：当前列是否为主排序列及方向；非主列传 `null`                                                                                    |
| `onSort`        | `() => void`                                  | -         | 点击排序按钮；父组件内切换「排序列」或对当前列执行 **`cycleTableSortOrder`**                                                             |
| `sortAriaLabel` | `string`                                      | -         | 排序按钮的无障碍名称，建议「按某某排序」                                                                                                 |
| `sortDisabled`  | `boolean`                                     | `false`   | 禁用排序按钮                                                                                                                             |
| 其余            | `ThHTMLAttributes`                            | -         | **务必**为列头设置 `scope="col"`（多列分组时可配合 `colSpan` / `scope="colgroup"` 等标准用法）                                           |

### `TableToolbar`

| Prop         | 类型                             | 默认值         | 说明                                        |
| ------------ | -------------------------------- | -------------- | ------------------------------------------- |
| `children`   | `ReactNode`                      | -              | 左侧/主区：筛选控件（`Input`、`Select` 等） |
| `extra`      | `ReactNode`                      | -              | 右侧：次要操作按钮                          |
| `aria-label` | `string`                         | `'表格工具栏'` | `role="toolbar"` 的可访问名称，可按业务改写 |
| 其余         | `HTMLAttributes<HTMLDivElement>` | -              | `className` 等与容器合并                    |

### `TableCell`（单元格 `<td>` / `<th>`）

| Prop      | 类型                           | 默认值    | 说明                                                          |
| --------- | ------------------------------ | --------- | ------------------------------------------------------------- |
| `as`      | `'td' \| 'th'`                 | `'td'`    | 行表头或角格使用 `as="th"`，并设置 `scope="row"` 或相应 scope |
| `align`   | `'start' \| 'center' \| 'end'` | `'start'` | 文本对齐；金额列常用 `align="end"`                            |
| `numeric` | `boolean`                      | -         | 与 `TableHead` 一致，等宽数字                                 |
| 其余      | `TdHTMLAttributes`             | -         | 支持 `colSpan`、`rowSpan`、`headers` 等原生属性               |

### `TableEmpty`

| Prop          | 类型                                  | 默认值       | 说明                                                   |
| ------------- | ------------------------------------- | ------------ | ------------------------------------------------------ |
| `colSpan`     | `number`                              | **必填**     | 与当前表列数一致，合并为一格                           |
| `description` | `ReactNode`                           | `'暂无数据'` | 无 `children` 时展示                                   |
| `children`    | `ReactNode`                           | -            | 自定义空状态（插图、按钮等），优先级高于 `description` |
| 其余          | `HTMLAttributes<HTMLTableRowElement>` | -            | 传到外层 `<tr>`                                        |

---

## 列排序与筛选（受控约定）

### 排序状态与 `cycleTableSortOrder`

从包内导出 **`TableSortOrder`**（`'asc' | 'desc' | null`）与 **`cycleTableSortOrder(prev)`**：单列点击常见三态为 **无 → 升序 → 降序 → 无**。换列时一般由父组件把 **`sortOrder` 设为 `'asc'`** 并切换 `sortKey`。

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cycleTableSortOrder,
} from 'stand-ui/components/Table';
import type { TableSortOrder } from 'stand-ui/components/Table';

type SortKey = 'name' | 'amount' | null;
const [sortKey, setSortKey] = useState<SortKey>(null);
const [sortOrder, setSortOrder] = useState<TableSortOrder>(null);

const onSortColumn = (key: Exclude<SortKey, null>) => {
  if (sortKey !== key) {
    setSortKey(key);
    setSortOrder('asc');
    return;
  }
  const next = cycleTableSortOrder(sortOrder);
  setSortOrder(next);
  if (next === null) setSortKey(null);
};

// 展示用数据：useMemo 里对 rows 做 sort（勿在 render 里直接改原数组）
```

表头绑定示例：

```tsx
<TableHead
  scope="col"
  sortable
  sortOrder={sortKey === 'name' ? sortOrder : null}
  onSort={() => onSortColumn('name')}
  sortAriaLabel="按名称排序"
>
  名称
</TableHead>
```

### 筛选与 `TableToolbar`

筛选条件（关键词、下拉部门等）放在 **`TableToolbar`** 内，父组件用 `useMemo` **`filter`** 数据源后再 `map` 到 `TableBody`。不要求表格内置「筛选行」——与 **Element / Ant** 一样，由页面状态驱动数据。

```tsx
<Stack gap="sm" className="w-full max-w-3xl">
  <TableToolbar extra={<Button size="sm">导出</Button>}>
    <Input placeholder="搜索" value={q} onChange={...} className="max-w-xs" />
    <Select value={dept} options={[...]} onChange={...} />
  </TableToolbar>
  <Table bordered shadow="sm">...</Table>
</Stack>
```

---

## 无障碍（a11y）建议

1. **标题**：使用 `TableCaption` 或原生 `<caption>`，简要说明表内容。
2. **列头**：每个列头 `TableHead` 使用 `scope="col"`。
3. **行头**：首列若为维度名称，使用 `TableCell as="th" scope="row"`。
4. **复杂表**：若存在多层表头或合并单元格，使用 `id` + `headers` 建立单元格与表头关联（HTML 标准）。
5. **可排序列**：使用 `TableHead` 的 **`sortable` + `onSort` + `sortAriaLabel`** 时，库会设置 **`aria-sort`** 与按钮 `aria-label`；勿在子节点再套一层不可见的重复按钮。
6. **仅装饰的表**：若数据关系已由周边文案说清，且表极简单，可按产品要求权衡；复杂数据表仍建议完整语义。

---

## 响应式与横向滚动

- 根 `Table` 已包一层 **横向滚动**；外层可用 `className="w-full max-w-..."` 限制最大宽度。
- **纵向滚动 + 吸顶表头**：将整表包在带 `max-height` 与 `overflow-y: auto` 的容器中，并设置 `stickyHeader`。示例：

```tsx
<div style={{ maxHeight: 280, overflowY: 'auto' }}>
  <Table stickyHeader bordered>
    <TableHeader>...</TableHeader>
    <TableBody>{/* 多行 */}</TableBody>
  </Table>
</div>
```

注意：吸顶参照**最近滚动容器**；若仅页面级滚动，表头会随页面滚动，是否「贴顶」取决于视口与表格位置。

---

## 与 Card、工具栏组合

列表页常见结构：**Card** 内放筛选工具栏 + **Table** + 底栏（预留 **Pagination**）。Table 本身不自带内边距；若需与 Card 边距对齐，由 Card 的 `children` 区域统一 padding，或在外层加 `Stack` / `div`。

```tsx
<Card title="订单列表">
  <Stack gap="md">
    {/* 筛选区：Input、Select、Button … */}
    <Table bordered striped hoverable>
      ...
    </Table>
    {/* <Pagination ... /> 见 Pagination 组件 */}
  </Stack>
</Card>
```

---

## `colSpan` / `rowSpan`

直接使用 React 在 `TableHead` / `TableCell` 上写 `colSpan`、`rowSpan`（数字）。合并后注意保持每行格子总数与列模型一致，避免布局错乱。

---

## 样式与主题变量

- 组件使用 `Table.module.css`，颜色与边框来自 `--su-bg-*`、`--su-border-*`、`--su-text-*` 等。
- 可在业务侧为 **`Table` 的 `className` / `style`** 覆盖视觉；或为外层滚动容器加圆角、阴影。
- 模块内预留 CSS 变量，便于局部微调：
  - `--su-table-outer-radius`（**外层**圆角，默认等同 `var(--su-radius)`，与 Card 一致）
  - `--su-table-font-size`
  - `--su-table-cell-padding`

暗色主题（`data-theme="dark"`）下斑马纹与悬停色已做轻微区分。

---

## 常见问题（FAQ）

**Q：为什么没有 `dataSource` / `columns`？**  
A：本库此版走**组合式 + 原生表格**，便于任意合并单元格、嵌入按钮/Checkbox、与表单混排。如需配置化渲染，可在项目内写一层薄封装。

**Q：排序、筛选、分页怎么做？**  
A：**排序**：`TableHead` 受控 `sortOrder` + `cycleTableSortOrder` + `useMemo` 内 `sort`。**筛选**：`TableToolbar` + 受控 `Input`/`Select` + `useMemo` 内 `filter`。**分页**：**Pagination** + `slice`。三者均不内置请求，由业务在 `onChange`/`onSort` 里拉数或改本地状态。

**Q：`layout="fixed"` 下列宽不均？**  
A：`fixed` 下首行决定列宽；可为部分 `TableHead` / `TableCell` 设置 `style={{ width: '20%' }}` 或 `className` 控制，或对过长的 `td` 做 `truncate`（需在单元格内包一层 `overflow-hidden` 结构）。

**Q：表头 sticky 不生效？**  
A：检查是否有**带 `overflow: hidden/auto` 的祖先**截断了 sticky；将滚动容器设为直接包裹 Table 的那一层并设置 `max-height` 通常可解。

**Q：`colSpan` / `rowSpan` 后竖线或横线缺失？**  
A：`bordered` 模式使用 **`border-collapse: collapse`** 与单元格四边 `1px` 边框，由表格布局合并线段；请勿再依赖「最后一列去右边线」类技巧。若极老浏览器在 **sticky 表头 + collapse** 上异常，可去 `stickyHeader` 或升级目标浏览器。

---

## 类型导出

从 `stand-ui/components/Table` 或包入口可导出：`TableProps`、`TableSize`、`TableHeadProps`、`TableCellProps`、`TableToolbarProps`、**`TableSortOrder`**，以及 **`cycleTableSortOrder`**。

---

## 检查清单（交付 / Code Review）

- [ ] 有 `caption` 或等价可见标题（设计豁免除外）
- [ ] 列头 `scope="col"`；行头 `th` + `scope="row"`
- [ ] 大数据量时考虑分页或虚拟化（本组件不包含虚拟列表）
- [ ] 移动端确认横向滚动与最小列宽可读性
- [ ] 可排序列已设 `sortAriaLabel`，且 `aria-sort` 与数据排序方向一致
