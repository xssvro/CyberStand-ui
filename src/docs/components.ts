/**
 * 组件文档注册表
 * 新增组件时在此注册，文档站点会自动展示
 */

/** 侧边栏与首页「组件列表」分组（顺序由 COMPONENT_DOC_CATEGORY_ORDER 决定） */
export type ComponentDocCategory = '通用' | '表单' | '布局' | '反馈';

/** 侧边栏分类展示顺序 */
export const COMPONENT_DOC_CATEGORY_ORDER: ComponentDocCategory[] = [
  '通用',
  '表单',
  '布局',
  '反馈',
];

export interface ComponentDoc {
  /** 组件名 */
  name: string;
  /** 组件标题 */
  title: string;
  /** 文档分组 */
  category: ComponentDocCategory;
  /** 组件描述 */
  description: string;
  /** AI文档路径 */
  aiDocPath: string;
  /** 示例代码 */
  examples: Example[];
}

/** 按分类聚合（仅返回有组件的分类） */
export function getComponentDocsGrouped(): {
  category: ComponentDocCategory;
  docs: ComponentDoc[];
}[] {
  return COMPONENT_DOC_CATEGORY_ORDER.map((category) => ({
    category,
    docs: componentDocs.filter((d) => d.category === category),
  })).filter((g) => g.docs.length > 0);
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
    category: '通用',
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
    category: '表单',
    description: '基础文本输入组件，支持多种类型和前后置内容',
    aiDocPath: '/src/components/Input/Input.ai.md',
    examples: [
      {
        title: '基础用法',
        code: `<Input placeholder="请输入内容" />`,
      },
      {
        title: '带图标',
        code: `<Input prefix={<IconSearch size={16} />} placeholder="搜索..." />
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
    name: 'FormField',
    title: 'FormField / Label 表单项',
    category: '表单',
    description:
      'FormField：标签、单控件槽、说明与错误；与 Input / Textarea / Select / Switch 联用注入 color=error；与 CheckboxGroup / RadioGroup 注入 invalid 与 aria-labelledby。',
    aiDocPath: '/src/components/FormField/FormField.ai.md',
    examples: [
      {
        title: '纵向：说明、必填与错误',
        code: `<Stack gap="xl" className="max-w-md w-full">
  <FormField label="邮箱" description="用于登录与找回密码" required>
    <Input type="email" placeholder="you@example.com" required />
  </FormField>

  <FormField label="昵称" error="2～16 个字符">
    <Input placeholder="输入昵称" />
  </FormField>
</Stack>`,
      },
      {
        title: '横向布局',
        code: `<FormField label="用户名" layout="horizontal" labelWidth={100} required>
  <Input placeholder="唯一标识" required />
</FormField>`,
      },
      {
        title: '独立 Label + Input',
        code: `<Stack gap="sm">
  <Label htmlFor="demo-field-a">备注</Label>
  <Input id="demo-field-a" placeholder="选填" />
</Stack>`,
      },
      {
        title: '与 Switch',
        code: `<Stack gap="lg" className="max-w-md w-full">
  <FormField label="推送通知" description="关闭后不再收到消息">
    <Switch defaultChecked />
  </FormField>
  <FormField label="公开资料" error="请先阅读并同意条款">
    <Switch />
  </FormField>
</Stack>`,
      },
    ],
  },
  {
    name: 'Form',
    title: 'Form 整表容器',
    category: '表单',
    description:
      '原生 form + 轻量 Context：默认 layout / size / disabled 下发给子级 FormField；字段级仍可覆盖。不绑定 react-hook-form。',
    aiDocPath: '/src/components/Form/Form.ai.md',
    examples: [
      {
        title: '整表 + 提交',
        code: `<Form
  className="max-w-lg w-full"
  onSubmit={(e) => {
    e.preventDefault();
    // fetch / 状态管理
  }}
>
  <FormField label="名称" required>
    <Input name="name" placeholder="项目名" required />
  </FormField>
  <FormField label="描述">
    <Textarea name="desc" rows={3} placeholder="选填" />
  </FormField>
  <Stack direction="row" gap="sm" justify="end">
    <Button type="submit" color="primary">
      保存
    </Button>
  </Stack>
</Form>`,
      },
      {
        title: '上下文：横向布局',
        code: `<Form layout="horizontal" className="max-w-xl w-full">
  <FormField label="用户名" labelWidth={96} required>
    <Input name="user" placeholder="唯一标识" />
  </FormField>
  <FormField label="邮箱" labelWidth={96}>
    <Input type="email" name="email" placeholder="you@example.com" />
  </FormField>
</Form>`,
      },
      {
        title: '上下文：统一小尺寸',
        code: `<Form size="sm" className="max-w-md w-full">
  <FormField label="标题">
    <Input placeholder="sm 输入框" />
  </FormField>
  <FormField label="类型">
    <Select placeholder="请选择" options={[{ value: 'a', label: 'A' }]} />
  </FormField>
</Form>`,
      },
      {
        title: '整表禁用',
        code: `<Form disabled className="max-w-md w-full">
  <FormField label="只读项">
    <Input defaultValue="不可编辑" />
  </FormField>
</Form>`,
      },
    ],
  },
  {
    name: 'Textarea',
    title: 'Textarea 多行输入',
    category: '表单',
    description: '多行文本输入，与 Input 共用 Stand 语义与 FormField 组合。',
    aiDocPath: '/src/components/Textarea/Textarea.ai.md',
    examples: [
      {
        title: '多行与 resize',
        code: `<Stack gap="md" className="max-w-xl w-full">
  <Textarea placeholder="纵向可拖拽调整高度…" rows={3} />
  <Textarea resize="none" placeholder="禁止拖拽" rows={2} />
</Stack>`,
      },
      {
        title: '尺寸与 color',
        code: `<Stack gap="md" className="max-w-xl w-full">
  <Textarea size="sm" rows={2} placeholder="sm" />
  <Textarea size="lg" rows={2} placeholder="lg" />
  <Textarea color="error" rows={2} placeholder="error 描边" />
</Stack>`,
      },
      {
        title: '与 FormField',
        code: `<FormField label="备注" description="选填" className="max-w-lg w-full">
  <Textarea rows={3} placeholder="补充说明" />
</FormField>`,
      },
    ],
  },
  {
    name: 'Select',
    title: 'Select 选择器',
    category: '表单',
    description:
      '自定义 Listbox + Portal 下拉，样式与 Input 对齐；支持 options、Select.Option、renderValue/renderOption 与 placement。',
    aiDocPath: '/src/components/Select/Select.ai.md',
    examples: [
      {
        title: 'placeholder 与 options',
        code: `<Select
  placeholder="请选择"
  options={[
    { value: 'a', label: '选项 A' },
    { value: 'b', label: '选项 B' },
  ]}
/>`,
      },
      {
        title: '子元素 option',
        code: `<Select placeholder="请选择">
  <option value="x">手写选项 X</option>
  <option value="y">手写选项 Y</option>
</Select>`,
      },
      {
        title: '与 FormField（error）',
        code: `<FormField label="地区" error="请选择" className="max-w-lg w-full">
  <Select placeholder="请选择" options={[{ value: 'sh', label: '上海' }]} />
</FormField>`,
      },
      {
        title: 'renderOption + meta（自定义选项行）',
        code: `<Select
  placeholder="套餐"
  className="max-w-md w-full"
  options={[
    { value: 'free', label: '免费版', meta: { hint: '适合体验' } },
    { value: 'pro', label: '专业版', meta: { hint: '全功能' } },
  ]}
  renderOption={({ option, selected }) => {
    const hint = (option.meta as { hint?: string })?.hint;
    return (
      <div>
        <div>{option.label}{selected ? ' ✓' : ''}</div>
        <div style={{ fontSize: 12, opacity: 0.65 }}>{hint}</div>
      </div>
    );
  }}
/>`,
      },
    ],
  },
  {
    name: 'Checkbox',
    title: 'Checkbox / CheckboxGroup',
    category: '表单',
    description: '复选框与复选组，可与 FormField 组合（error 时 invalid）。',
    aiDocPath: '/src/components/Checkbox/Checkbox.ai.md',
    examples: [
      {
        title: '单独 Checkbox',
        code: `<Checkbox defaultChecked label="同意条款" />`,
      },
      {
        title: 'CheckboxGroup 受控',
        code: `<CheckboxGroup name="skill" value={skills} onValueChange={setSkills}>
  <Checkbox value="ts" label="TypeScript" />
  <Checkbox value="rust" label="Rust" />
</CheckboxGroup>`,
      },
      {
        title: '与 FormField（error）',
        code: `<FormField label="通知方式" error="至少选一项" className="max-w-lg w-full">
  <CheckboxGroup name="notify" value={notify} onValueChange={setNotify}>
    <Checkbox value="email" label="邮件" />
    <Checkbox value="sms" label="短信" />
  </CheckboxGroup>
</FormField>`,
      },
    ],
  },
  {
    name: 'Radio',
    title: 'Radio / RadioGroup',
    category: '表单',
    description: '单选与单选组，支持横向排列，可与 FormField 组合。',
    aiDocPath: '/src/components/Radio/Radio.ai.md',
    examples: [
      {
        title: 'RadioGroup 纵向',
        code: `<RadioGroup name="plan" value={plan} onValueChange={setPlan}>
  <Radio value="free" label="免费版" />
  <Radio value="pro" label="专业版" />
</RadioGroup>`,
      },
      {
        title: 'RadioGroup 横向',
        code: `<RadioGroup name="tier" value={tier} horizontal onValueChange={setTier}>
  <Radio value="a" label="A" />
  <Radio value="b" label="B" />
</RadioGroup>`,
      },
      {
        title: '与 FormField（error）',
        code: `<FormField label="套餐" error="请选择一项" className="max-w-lg w-full">
  <RadioGroup name="pkg" value={pkg} onValueChange={setPkg}>
    <Radio value="basic" label="基础" />
    <Radio value="pro" label="专业" />
  </RadioGroup>
</FormField>`,
      },
    ],
  },
  {
    name: 'Switch',
    title: 'Switch 开关',
    category: '表单',
    description: 'role=switch 按钮开关；支持 readOnly、表单 name、与 FormField 的 error 注入。',
    aiDocPath: '/src/components/Switch/Switch.ai.md',
    examples: [
      {
        title: '基础与 label',
        code: `<Stack gap="md" className="max-w-md w-full">
  <Switch defaultChecked onCheckedChange={(v) => console.log(v)} />
  <Switch label="启用邮件通知" />
</Stack>`,
      },
      {
        title: '尺寸',
        code: `<Stack direction="row" gap="lg" align="center" className="flex-wrap">
  <Switch size="sm" defaultChecked />
  <Switch size="md" defaultChecked />
</Stack>`,
      },
      {
        title: 'disabled 与 readOnly',
        code: `<Stack gap="md" className="max-w-md w-full">
  <Switch disabled defaultChecked label="禁用（开）" />
  <Switch readOnly defaultChecked label="只读（开）" />
</Stack>`,
      },
      {
        title: '与 FormField（error）',
        code: `<FormField label="同意条款" error="请开启开关" className="max-w-md w-full">
  <Switch />
</FormField>`,
      },
    ],
  },
  {
    name: 'FormSection',
    title: 'FormSection 表单分组',
    category: '表单',
    description: '标题 + 可选说明；默认 fieldset/legend，可选 div+role=group。',
    aiDocPath: '/src/components/FormSection/FormSection.ai.md',
    examples: [
      {
        title: 'fieldset（默认）',
        code: `<FormSection title="联系方式" description="至少填写一项">
  <FormField label="邮箱">
    <Input type="email" placeholder="you@example.com" />
  </FormField>
  <FormField label="手机">
    <Input type="tel" placeholder="选填" />
  </FormField>
</FormSection>`,
      },
      {
        title: 'as="div" + role=group',
        code: `<FormSection as="div" title="偏好设置" description="可随时在设置中修改">
  <FormField label="主题">
    <Select placeholder="请选择" options={[{ value: 'dark', label: '深色' }]} />
  </FormField>
</FormSection>`,
      },
      {
        title: '整组禁用（fieldset）',
        code: `<FormSection title="已归档" disabled>
  <FormField label="备注">
    <Input placeholder="不可编辑" />
  </FormField>
</FormSection>`,
      },
    ],
  },
  {
    name: 'Card',
    title: 'Card 卡片',
    category: '布局',
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
    category: '反馈',
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
    name: 'Divider',
    title: 'Divider / Separator 分割线',
    category: '布局',
    description:
      'Divider 为视觉分割（默认可弱化无障碍）；Separator 为语义分割（role="separator"）。支持横纵、线型、间距与带文案横向分割。',
    aiDocPath: '/src/components/Divider/Divider.ai.md',
    examples: [
      {
        title: '横向：线型与颜色',
        code: `<Divider />
<Divider variant="dashed" />
<Divider variant="dotted" spacing="sm" />
<Divider color="subtle" spacing="md" />`,
      },
      {
        title: '横向：带文案与 titleAlign',
        code: `<Divider>默认居中</Divider>
<Divider titleAlign="start">靠左</Divider>
<Divider titleAlign="end" variant="dashed">靠右</Divider>`,
      },
      {
        title: '纵向：配合 flex 行布局',
        code: `<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', minHeight: 100, gap: 12 }}>
  <span>区域 A</span>
  <Divider orientation="vertical" />
  <span>区域 B</span>
  <Separator orientation="vertical" spacing="sm" />
  <span>区域 C（Separator 语义分割）</span>
</div>`,
      },
      {
        title: 'Separator 与 Divider decorative',
        code: `{/* 菜单项之间：读屏可识别分隔 */}
<Separator spacing="sm" />

{/* 等价于 */}
<Divider decorative={false} spacing="sm" />`,
      },
    ],
  },
  {
    name: 'AspectRatio',
    title: 'AspectRatio 固定宽高比',
    category: '布局',
    description:
      '用 CSS aspect-ratio 固定容器宽高比；支持 ratio 数字或字符串、object-fit 作用于内部 img/video；适合封面、视频占位、方形头像框。',
    aiDocPath: '/src/components/AspectRatio/AspectRatio.ai.md',
    examples: [
      {
        title: '16:9 与 1:1（色块示意）',
        code: `<Stack gap="xl" className="max-w-xl w-full">
  <Stack gap="sm">
    <Typography variant="caption" color="muted">16 : 9</Typography>
    <AspectRatio ratio={16 / 9} className="w-full rounded-lg overflow-hidden border border-[var(--su-border-default)]">
      <div
        className="h-full w-full"
        style={{ background: 'linear-gradient(135deg, var(--su-info-500), var(--su-primary-600))' }}
        aria-hidden
      />
    </AspectRatio>
  </Stack>

  <Stack gap="sm">
    <Typography variant="caption" color="muted">1 : 1</Typography>
    <AspectRatio ratio={1} className="w-32 rounded-md overflow-hidden border border-[var(--su-border-default)]">
      <div
        className="h-full w-full"
        style={{ background: 'var(--su-bg-muted)' }}
        aria-hidden
      />
    </AspectRatio>
  </Stack>
</Stack>`,
      },
      {
        title: 'objectFit：cover 与 contain',
        code: `<Stack gap="xl" className="max-w-2xl w-full">
  <Stack gap="sm">
    <Typography variant="caption" color="muted">cover（裁切铺满）</Typography>
    <AspectRatio ratio={16 / 9} objectFit="cover" className="w-full max-w-md rounded-md overflow-hidden">
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%230ea5e9' width='800' height='400'/%3E%3Crect fill='%23e11d48' x='120' y='60' width='560' height='280' rx='12'/%3E%3C/svg%3E" alt="" />
    </AspectRatio>
  </Stack>

  <Stack gap="sm">
    <Typography variant="caption" color="muted">contain（完整显示）</Typography>
    <AspectRatio ratio={16 / 9} objectFit="contain" className="w-full max-w-md rounded-md overflow-hidden bg-[var(--su-bg-muted)]">
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%230ea5e9' width='800' height='400'/%3E%3Crect fill='%23e11d48' x='120' y='60' width='560' height='280' rx='12'/%3E%3C/svg%3E" alt="" />
    </AspectRatio>
  </Stack>
</Stack>`,
      },
      {
        title: '字符串 ratio 与下方文案区（通栏无内边距）',
        code: `<div className="max-w-2xl w-full overflow-hidden rounded-lg border border-[var(--su-border-default)] bg-[var(--su-bg-elevated)]" style={{ boxShadow: 'var(--su-shadow-sm)' }}>
  <AspectRatio ratio="4 / 3" className="w-full">
    <div
      className="h-full w-full flex items-center justify-center text-sm text-[var(--su-text-muted)]"
      style={{ background: 'var(--su-bg-subtle)' }}
    >
      4 : 3 占位区
    </div>
  </AspectRatio>
  <div className="p-4 border-t border-[var(--su-border-subtle)]">
    <Typography variant="bodySmall" noMargin>
      正文与上方比例区分离（比例区通栏无 Card body 内边距）
    </Typography>
  </div>
</div>`,
      },
    ],
  },
  {
    name: 'Layout',
    title: '布局工具 Flex / Grid / Stack / Space',
    category: '布局',
    description:
      'Flex / Grid / Stack / Space：统一 LayoutSpacing 与 vars 间距变量；Flex 支持 alignContent；Grid 支持 minChildWidth + autoRepeat、autoRows；Stack 有 fullWidth；Space 有 block/split。',
    aiDocPath: '/src/components/Layout/Layout.ai.md',
    examples: [
      {
        title: 'Flex：多段示例（段与段之间用 Stack 拉开）',
        code: `<Stack gap="xl" className="max-w-2xl w-full">
  <Stack gap="sm">
    <Typography variant="caption" color="muted">主轴两头对齐 + 换行</Typography>
    <Flex gap="md" justify="between" align="center" wrap className="w-full rounded-lg border border-[var(--su-border-default)] p-3">
      <Typography variant="bodySmall" noMargin>左侧说明</Typography>
      <Button size="sm">操作</Button>
    </Flex>
  </Stack>

  <Stack gap="sm">
    <Typography variant="caption" color="muted">纵向 gap</Typography>
    <Flex direction="column" gap="sm" align="start" className="text-[var(--su-text-muted)]">
      <span>第一行</span>
      <span>第二行</span>
    </Flex>
  </Stack>
</Stack>`,
      },
      {
        title: 'Stack：表单区 + 横向工具条',
        code: `<Stack gap="xl" className="max-w-sm w-full">
  <Stack gap="md" fullWidth>
    <Typography variant="caption" color="muted">登录</Typography>
    <Input placeholder="邮箱" />
    <Input type="password" placeholder="密码" />
    <Button color="primary" block>
      登录
    </Button>
  </Stack>

  <Stack gap="sm">
    <Typography variant="caption" color="muted">次要操作（横向）</Typography>
    <Stack direction="row" gap="sm" align="center">
      <Button size="xs" variant="soft">
        忘记密码
      </Button>
      <Button size="xs" variant="ghost">
        注册
      </Button>
    </Stack>
  </Stack>
</Stack>`,
      },
      {
        title: 'Grid：等分列、模板列、响应列 + autoRows',
        code: `<Stack gap="xl" className="max-w-3xl w-full">
  <Stack gap="sm">
    <Typography variant="caption" color="muted">三等分</Typography>
    <Grid columns={3} gap="md" className="w-full">
      <Card>一</Card>
      <Card>二</Card>
      <Card>三</Card>
    </Grid>
  </Stack>

  <Stack gap="sm">
    <Typography variant="caption" color="muted">minChildWidth + auto-fit 拉满</Typography>
    <Grid minChildWidth={140} autoRepeat="fit" gap="sm" className="w-full">
      <Button size="sm">A</Button>
      <Button size="sm">B</Button>
      <Button size="sm">C</Button>
      <Button size="sm">D</Button>
    </Grid>
  </Stack>

  <Stack gap="sm">
    <Typography variant="caption" color="muted">固定行高下限</Typography>
    <Grid columns={2} autoRows="minmax(72px, auto)" gap="sm" className="w-full">
      <Card>区域 A</Card>
      <Card>区域 B</Card>
    </Grid>
  </Stack>
</Stack>`,
      },
      {
        title: 'Space：换行、split、纵向',
        code: `<Stack gap="xl" className="max-w-2xl w-full">
  <Stack gap="sm">
    <Typography variant="caption" color="muted">换行工具条</Typography>
    <Space wrap size="sm" className="w-full">
      <Button size="xs">新建</Button>
      <Button size="xs" variant="soft">
        导入
      </Button>
      <Button size="xs" variant="ghost">
        更多
      </Button>
    </Space>
  </Stack>

  <Stack gap="sm">
    <Typography variant="caption" color="muted">split + 竖线</Typography>
    <Space size="sm" split={<Divider orientation="vertical" spacing="none" />} align="stretch">
      <Typography variant="caption" color="muted" noMargin>
        首页
      </Typography>
      <Typography variant="caption" color="muted" noMargin>
        文档
      </Typography>
    </Space>
  </Stack>

  <Stack gap="sm">
    <Typography variant="caption" color="muted">纵向排列</Typography>
    <Space direction="vertical" size="sm" align="start">
      <span className="text-sm text-[var(--su-text-muted)]">上一项</span>
      <span className="text-sm text-[var(--su-text-muted)]">下一项</span>
    </Space>
  </Stack>
</Stack>`,
      },
    ],
  },
  {
    name: 'Typography',
    title: 'Typography 排版',
    category: '通用',
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
