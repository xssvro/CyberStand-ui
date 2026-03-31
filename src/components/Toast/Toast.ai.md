# Toast 通知 - AI 使用指南

全局轻提示：参考 **Sonner / React Hot Toast** 等常见设计——**命令式 `toast()`** + **根节点挂载一次 `<Toaster />`**；另提供 **`useToast()`** 便于在组件内解构（与顶层 `toast` 等价）。

## 前置条件

在应用根（或布局）**渲染一次**：

```tsx
import { Toaster } from 'stand-ui/components/Toast';

function App() {
  return (
    <>
      {/* 默认 position="top-center"（页面水平居中、靠上）；可改为 top-right、bottom-center 等 */}
      <Toaster />
      {/* 其余路由 / 页面 */}
    </>
  );
}
```

## 命令式 API（推荐）

```tsx
import { toast } from 'stand-ui/components/Toast';

toast('简短说明');
toast.success('操作成功');
toast.error('出错了');
toast.warning('请注意');
toast.info('提示');

toast('带副标题', {
  description: '补充说明一行',
  duration: 5000,
});

// 需要手动关闭按钮时
toast('可点 × 关闭', { dismissible: true });

toast.dismiss();       // 关闭全部
toast.dismiss('某 id'); // 关闭单条（addToast / promise 返回的 id）
```

### Promise

```tsx
await toast.promise(
  fetch('/api').then((r) => r.json()),
  {
    loading: '提交中…',
    success: '已保存',
    error: (e) => (e instanceof Error ? e.message : '失败'),
  }
);
```

### 长时间 Loading

```tsx
const id = toast.loading('处理中…');
// 完成后：
toast.dismiss(id);
```

## 组件式用法（Hook）

与 `toast` 行为一致，便于在函数组件里与 props/state 一起书写：

```tsx
import { useToast } from 'stand-ui/components/Toast';

function Demo() {
  const { toast, dismiss } = useToast();
  return <button onClick={() => toast.success('OK')}>保存</button>;
}
```

## `<Toaster />` Props

| Prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| `position` | 见下 | `'top-center'` | 出现位置 |
| `className` | `string` | - | 容器额外 class |

`position`: `'top-right'` \| `'top-center'` \| `'top-left'` \| `'bottom-right'` \| `'bottom-center'` \| `'bottom-left'`

## 可访问性

单条 Toast 使用 `role="status"`；错误类为 `aria-live="assertive"`，其余为 `polite`。

## 样式

基于 `vars.css` token；左侧语义色条区分类型。可通过覆盖 `Toast.module.css` 或容器 `className` 扩展。
