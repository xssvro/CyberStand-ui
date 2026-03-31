/**
 * 组件文档注册表
 * 新增组件时在此注册，文档站点会自动展示
 */

export interface ComponentDoc {
  /** 组件名 */
  name: string;
  /** 组件标题 */
  title: string;
  /** 组件描述 */
  description: string;
  /** AI文档路径 */
  aiDocPath: string;
  /** 示例代码 */
  examples: Example[];
}

export interface Example {
  /** 示例标题 */
  title: string;
  /** 示例代码 */
  code: string;
}

export const componentDocs: ComponentDoc[] = [
  {
    name: 'Button',
    title: 'Button 按钮',
    description: '用于触发操作或事件的基础组件',
    aiDocPath: '/src/components/Button/Button.ai.md',
    examples: [
      {
        title: '基础用法',
        code: `<Button>默认按钮</Button>
<Button color="primary">主要按钮</Button>
<Button color="secondary">次要按钮</Button>`,
      },
      {
        title: '变体展示',
        code: `<Button variant="solid">实心</Button>
<Button variant="soft">柔和</Button>
<Button variant="outlined">描边</Button>
<Button variant="ghost">幽灵</Button>
<Button variant="link">链接</Button>`,
      },
      {
        title: '尺寸阶梯',
        code: `<Button size="xs">超小</Button>
<Button size="sm">小</Button>
<Button size="md">中</Button>
<Button size="lg">大</Button>
<Button size="xl">超大</Button>`,
      },
      {
        title: '状态演示',
        code: `<Button loading>加载中</Button>
<Button disabled>已禁用</Button>
<Button color="error">危险</Button>`,
      },
      {
        title: '语义颜色（实心）',
        code: `<Button color="primary">primary</Button>
<Button color="success">success</Button>
<Button color="warning">warning</Button>
<Button color="error">error</Button>
<Button color="info">info</Button>`,
      },
      {
        title: '圆角 radius',
        code: `<Button radius="none">none</Button>
<Button radius="sm">sm</Button>
<Button radius="md">md</Button>
<Button radius="lg">lg</Button>
<Button radius="full">pill</Button>`,
      },
      {
        title: '块级与图标',
        code: `<Button block>全宽按钮</Button>
<Button leftIcon={<span>＋</span>}>新建</Button>
<Button rightIcon={<span>→</span>}>下一步</Button>`,
      },
    ],
  },
  {
    name: 'Input',
    title: 'Input 输入框',
    description: '基础文本输入组件，支持多种类型和前后置内容',
    aiDocPath: '/src/components/Input/Input.ai.md',
    examples: [
      {
        title: '基础用法',
        code: `<Input placeholder="请输入内容" />`,
      },
      {
        title: '带图标',
        code: `<Input prefix={<IconSearch size={18} />} placeholder="搜索..." />
<Input suffix="@" placeholder="邮箱" />`,
      },
      {
        title: '不同尺寸',
        code: `<Input size="sm" placeholder="小尺寸" />
<Input size="md" placeholder="中尺寸" />
<Input size="lg" placeholder="大尺寸" />`,
      },
      {
        title: '特殊类型',
        code: `<Input type="password" placeholder="密码" />
<Input type="email" placeholder="邮箱" />
<Input type="number" placeholder="数字" />`,
      },
    ],
  },
  {
    name: 'Card',
    title: 'Card 卡片',
    description: '通用容器组件，用于展示内容块',
    aiDocPath: '/src/components/Card/Card.ai.md',
    examples: [
      {
        title: '基础卡片',
        code: `<Card>这是一个基础卡片</Card>`,
      },
      {
        title: '带标题',
        code: `<Card title="卡片标题" subtitle="副标题描述">
  卡片内容区域
</Card>`,
      },
      {
        title: '带操作',
        code: `<Card 
  title="设置"
  extra={<Button size="xs" variant="ghost">编辑</Button>}
  footer={<Button size="sm">保存</Button>}
>
  设置内容
</Card>`,
      },
      {
        title: '可点击卡片',
        code: `<Card hoverable onClick={() => alert('clicked')}>
  点击我
</Card>`,
      },
    ],
  },
  {
    name: 'Toast',
    title: 'Toast 通知',
    description: '全局轻提示：命令式 toast()、useToast()，根节点挂载 Toaster',
    aiDocPath: '/src/components/Toast/Toast.ai.md',
    examples: [
      {
        title: '命令式 API',
        code: `import { toast } from 'stand-ui/components/Toast';

toast('默认');
toast.success('成功');
toast.error('失败');
toast.warning('警告');
toast.info('提示');`,
      },
      {
        title: '副标题与时长',
        code: `toast('已保存', {
  description: '更改将在下次同步时生效',
  duration: 6000,
});`,
      },
      {
        title: 'Promise',
        code: `await toast.promise(
  fetch('/api').then((r) => r.json()),
  {
    loading: '处理中…',
    success: '完成',
    error: (e) => String(e),
  }
);`,
      },
    ],
  },
  {
    name: 'Typography',
    title: 'Typography 排版',
    description:
      '语义化排版：标题层级、正文、辅助文案、引用与代码样式；支持多态标签、语义色、截断与可复制（Ant Typography 风格）',
    aiDocPath: '/src/components/Typography/Typography.ai.md',
    examples: [
      {
        title: '标题阶梯：display～h6 + 副标题',
        code: `<Typography variant="display" as="h1">Display</Typography>
<Typography variant="h1">h1</Typography>
<Typography variant="h2">h2</Typography>
<Typography variant="h3">h3</Typography>
<Typography variant="h4">h4</Typography>
<Typography variant="h5">h5</Typography>
<Typography variant="h6">h6</Typography>
<Typography variant="subtitle">subtitle 副标题说明</Typography>`,
      },
      {
        title: '正文阶梯：lead / bodyLarge / body / bodySmall',
        code: `<Typography variant="lead">lead 导语略大</Typography>
<Typography variant="bodyLarge">bodyLarge 偏大正文</Typography>
<Typography variant="body">body 标准正文</Typography>
<Typography variant="bodySmall" color="muted">bodySmall 偏小次要</Typography>`,
      },
      {
        title: '辅助：caption / label / overline / code / blockquote',
        code: `<Typography variant="caption" color="muted">caption 图注脚注</Typography>
<Typography variant="label" as="label">label 表单标签</Typography>
<Typography variant="overline">overline 分类标签</Typography>
<Typography variant="body" as="p">
  行内 <Typography variant="code" as="code" noMargin>npm i</Typography> 命令
</Typography>
<Typography variant="blockquote">blockquote 引用块</Typography>`,
      },
      {
        title: '全部语义色 color',
        code: `<Typography variant="body" color="default">default</Typography>
<Typography variant="body" color="muted">muted</Typography>
<Typography variant="body" color="subtle">subtle</Typography>
<Typography variant="body" color="emphasis">emphasis</Typography>
<Typography variant="body" color="primary">primary</Typography>
<Typography variant="body" color="secondary">secondary</Typography>
<Typography variant="body" color="info">info</Typography>
<Typography variant="body" color="success">success</Typography>
<Typography variant="body" color="warning">warning</Typography>
<Typography variant="body" color="error">error</Typography>
<div style={{ background: '#0f1419', padding: 12, borderRadius: 8 }}>
  <Typography variant="body" color="inverse">inverse</Typography>
</div>`,
      },
      {
        title: '字重 weight + 对齐 textAlign',
        code: `<Typography variant="body" weight="normal">normal</Typography>
<Typography variant="body" weight="medium">medium</Typography>
<Typography variant="body" weight="semibold">semibold</Typography>
<Typography variant="body" weight="bold">bold</Typography>
<Typography variant="body" textAlign="start">textAlign start</Typography>
<Typography variant="body" textAlign="center">textAlign center</Typography>
<Typography variant="body" textAlign="end">textAlign end</Typography>
<Typography variant="bodySmall" textAlign="justify" noMargin>
  justify 长段两端对齐（中文慎用）
</Typography>`,
      },
      {
        title: '截断：truncate 与 lineClamp',
        code: `<div className="max-w-xs">
  <Typography variant="body" truncate noMargin>
    单行省略：很长很长的文件名或表格单元格
  </Typography>
</div>
<Typography variant="body" lineClamp={2} noMargin>
  多行省略：第二行后省略……
</Typography>
<Typography variant="body" lineClamp={4} noMargin>
  lineClamp={4} 适合卡片摘要多行展示。
</Typography>`,
      },
      {
        title: '可复制 copyable',
        code: `<Typography variant="body" copyable>从子节点抽取纯文本复制</Typography>
<Typography variant="body" copyable={{ text: '固定复制内容', tooltip: '复制' }}>
  展示文案可与复制内容不同
</Typography>
<Typography variant="caption" copyable={{ text: 'ORDER-2026-001' }}>
  订单号（点复制）
</Typography>`,
      },
      {
        title: '链接：Typography.Link / TypographyLink / variant=link',
        code: `<Typography.Link href="https://example.com" external color="info">
  外链 Typography.Link
</Typography.Link>
<TypographyLink href="/settings" color="primary">站内 TypographyLink</TypographyLink>
<Typography variant="link" as="span">link 仅样式（非 a 标签）</Typography>`,
      },
      {
        title: '多态 as + 无障碍属性',
        code: `<Typography variant="h2" as="div" role="heading" aria-level={2}>
  视觉像 h2，语义 div（模态标题常用）
</Typography>
<Typography variant="caption" as="span" color="muted" title="悬停说明">
  带 title 的小字
</Typography>
<Typography variant="body" color="error" role="alert">
  role="alert" 错误提示
</Typography>`,
      },
      {
        title: 'noMargin：列表与密排',
        code: `<ul className="list-disc pl-5">
  <li>
    <Typography variant="bodySmall" noMargin>列表项内紧凑</Typography>
  </li>
  <li>
    <Typography variant="bodySmall" noMargin>第二项</Typography>
  </li>
</ul>`,
      },
      {
        title: '文章骨架（组合）',
        code: `<article>
  <Typography variant="overline">分类</Typography>
  <Typography variant="h1" as="h1">文章标题</Typography>
  <Typography variant="subtitle">副标题</Typography>
  <Typography variant="lead">摘要 lead。</Typography>
  <Typography variant="body">正文段落。</Typography>
  <Typography variant="bodySmall" color="muted">更新日期等元信息</Typography>
</article>`,
      },
      {
        title: 'className / style 扩展',
        code: `<Typography variant="h3" className="opacity-90">
  叠加任意 className
</Typography>
<Typography variant="body" style={{ maxWidth: '42ch' }}>
  style 限制行长（ch）
</Typography>`,
      },
    ],
  },
];
