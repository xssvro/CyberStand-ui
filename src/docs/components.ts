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
    description:
      '基础文本输入组件，支持多种类型和前后置内容；date / time 等隐藏右侧原生按钮，内部强调色为主色',
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
      {
        title: '日期与时间（无右侧原生图标，主色 accent）',
        code: `<Stack gap="md" className="max-w-md w-full">
  <Input type="date" name="day" />
  <Input type="datetime-local" name="at" />
  <Input type="date" min="2026-01-01" max="2026-12-31" name="range" />
</Stack>`,
      },
    ],
  },
  {
    name: 'DatePicker',
    title: 'DatePicker 日期选择',
    category: '表单',
    description:
      '自研月历弹层（Portal + 与 Select 同源定位）；值 yyyy-mm-dd；选中日为主色实心，支持 min/max 与表单隐藏域 name',
    aiDocPath: '/src/components/DatePicker/DatePicker.ai.md',
    examples: [
      {
        title: '基础用法',
        code: `const [d, setD] = useState('');
<DatePicker value={d} onChange={(v) => setD(v)} placeholder="选择日期" />`,
      },
      {
        title: '范围与尺寸',
        code: `<Stack gap="md" className="max-w-md w-full">
  <DatePicker
    min="2026-01-01"
    max="2026-12-31"
    placeholder="2026 年内"
  />
  <DatePicker size="sm" color="primary" placeholder="小号主色环" />
</Stack>`,
      },
      {
        title: '与 FormField',
        code: `<FormField label="截止日期" required className="max-w-md w-full">
  <DatePicker name="due" placeholder="请选择" />
</FormField>`,
      },
    ],
  },
  {
    name: 'FormField',
    title: 'FormField / Label 表单项',
    category: '表单',
    description:
      'FormField：标签、单控件槽、说明与错误；与 Input / Textarea / Select / Switch / DatePicker 联用注入 color=error；与 CheckboxGroup / RadioGroup 注入 invalid 与 aria-labelledby。',
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
      '原生 form + Context：下发 layout / size / disabled；默认 noValidate，与 FormField 控件下方 error 配合。可嵌套 FormSection、FormData 提交；RHF/Zod 见 Form.ai.md。',
    aiDocPath: '/src/components/Form/Form.ai.md',
    examples: [
      {
        title: '整表：说明 + 主次按钮',
        code: `<Form
  className="max-w-lg w-full"
  onSubmit={(e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    console.log(Object.fromEntries(fd.entries()));
  }}
>
  <FormField label="名称" description="对内展示用" required>
    <Input name="name" placeholder="2～32 个字符" />
  </FormField>
  <FormField label="描述">
    <Textarea name="desc" rows={3} placeholder="选填" />
  </FormField>
  <Stack direction="row" gap="sm" justify="end">
    <Button type="button" variant="ghost" size="sm">
      取消
    </Button>
    <Button type="submit" color="primary" size="sm">
      保存
    </Button>
  </Stack>
</Form>`,
      },
      {
        title: '上下文：横向 layout + labelWidth',
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
        title: '上下文：整表 size="sm"',
        code: `<Form size="sm" className="max-w-md w-full">
  <FormField label="标题">
    <Input name="title" placeholder="sm 输入框" />
  </FormField>
  <FormField label="类型">
    <Select
      name="kind"
      placeholder="请选择"
      options={[
        { value: 'a', label: '类型 A' },
        { value: 'b', label: '类型 B' },
      ]}
    />
  </FormField>
</Form>`,
      },
      {
        title: '整表 disabled（提交中预览）',
        code: `<Form disabled className="max-w-md w-full">
  <FormField label="只读项">
    <Input name="ro" defaultValue="不可编辑" />
  </FormField>
</Form>`,
      },
      {
        title: '嵌套 FormSection（多区块）',
        code: `<Form
  className="max-w-xl w-full"
  onSubmit={(e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    console.log(Object.fromEntries(fd.entries()));
  }}
>
  <FormSection title="基本信息" description="带 * 为必填">
    <FormField label="显示名称" required>
      <Input name="displayName" placeholder="2～32 个字符" />
    </FormField>
    <FormField label="类型">
      <Select
        name="kind"
        placeholder="请选择"
        options={[
          { value: 'app', label: '应用' },
          { value: 'api', label: '接口' },
        ]}
      />
    </FormField>
  </FormSection>

  <FormSection title="联系方式" description="至少填一项">
    <FormField label="邮箱">
      <Input type="email" name="email" placeholder="you@example.com" />
    </FormField>
    <FormField label="手机">
      <Input type="tel" name="phone" placeholder="选填" />
    </FormField>
  </FormSection>

  <Stack direction="row" gap="sm" justify="end">
    <Button type="button" variant="ghost" size="sm">
      取消
    </Button>
    <Button type="submit" color="primary" size="sm">
      创建
    </Button>
  </Stack>
</Form>`,
      },
      {
        title: '提交前校验 + FormField error（无气泡）',
        code: `const [errors, setErrors] = useState<{ name?: string }>({});

<Form
  className="max-w-md w-full"
  onSubmit={(e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '').trim();
    if (!name) {
      setErrors({ name: '请填写名称' });
      return;
    }
    setErrors({});
    // 调用接口…
  }}
>
  <FormField label="名称" required error={errors.name}>
    <Input
      name="name"
      placeholder="项目名称"
      onChange={() => setErrors((prev) => ({ ...prev, name: undefined }))}
    />
  </FormField>
  <Stack direction="row" gap="sm" justify="end">
    <Button type="submit" color="primary" size="sm">
      提交
    </Button>
  </Stack>
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
      '自定义 Listbox + Portal 下拉，样式与 Input 对齐；支持 searchable 筛选、options、Select.Option、renderValue/renderOption 与 placement。',
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
      {
        title: 'searchable 可搜索',
        code: `<Select
  searchable
  searchPlaceholder="输入城市名筛选"
  placeholder="选择城市"
  className="max-w-md w-full"
  options={[
    { value: 'bj', label: '北京' },
    { value: 'sh', label: '上海' },
    { value: 'gz', label: '广州' },
    { value: 'sz', label: '深圳' },
    { value: 'hz', label: '杭州' },
  ]}
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
    name: 'Modal',
    title: 'Modal / Dialog 对话框',
    category: '反馈',
    description:
      '阻断式弹层：Portal、可选遮罩（mask）、主色阴影面板；Esc/遮罩或透明层/关闭钮、焦点陷阱与滚动锁定；z-index 为 --su-z-modal',
    aiDocPath: '/src/components/Modal/Modal.ai.md',
    examples: [
      {
        title: '基础：标题 + 正文 + 底栏',
        code: `const [open, setOpen] = useState(false);

<>
  <Button type="button" onClick={() => setOpen(true)}>打开对话框</Button>
  <Modal
    open={open}
    onOpenChange={setOpen}
    title="确认操作"
    footer={
      <>
        <Button variant="ghost" size="sm" type="button" onClick={() => setOpen(false)}>取消</Button>
        <Button color="primary" size="sm" type="button" onClick={() => setOpen(false)}>确定</Button>
      </>
    }
  >
    <Typography variant="body" noMargin>确定要执行该操作吗？</Typography>
  </Modal>
</>`,
      },
      {
        title: '尺寸与宽度',
        code: `<Modal open={open} onOpenChange={setOpen} title="小号" size="sm">内容</Modal>
<Modal open={open2} onOpenChange={setOpen2} title="自定义宽度" width={640}>宽面板</Modal>`,
      },
      {
        title: '靠上展示 / 禁止点遮罩关闭',
        code: `<Modal
  open={open}
  onOpenChange={setOpen}
  title="靠上"
  centered={false}
  maskClosable={false}
>
  仅能通过关闭钮或 Esc 关闭（keyboard 默认开启）
</Modal>`,
      },
      {
        title: '非遮罩模式（无半透明底）',
        code: `<Modal
  open={open}
  onOpenChange={setOpen}
  title="无遮罩"
  mask={false}
  footer={<Button size="sm" type="button" onClick={() => setOpen(false)}>知道了</Button>}
>
  <Typography variant="bodySmall" color="muted" noMargin>
    无模糊暗色底，仍锁定背后滚动；点空白处可关（maskClosable 默认 true）。
  </Typography>
</Modal>`,
      },
    ],
  },
  {
    name: 'Drawer',
    title: 'Drawer 抽屉',
    category: '反馈',
    description:
      '侧滑面板：Portal、四向 placement、可选遮罩；与 Modal 同级的滚动锁定与焦点陷阱；z-index 为 --su-z-drawer',
    aiDocPath: '/src/components/Drawer/Drawer.ai.md',
    examples: [
      {
        title: '基础：右侧抽屉',
        code: `const [open, setOpen] = useState(false);

<>
  <Button type="button" onClick={() => setOpen(true)}>打开抽屉</Button>
  <Drawer
    open={open}
    onOpenChange={setOpen}
    title="筛选"
    footer={
      <Button size="sm" color="primary" type="button" onClick={() => setOpen(false)}>
        应用
      </Button>
    }
  >
    <Typography variant="bodySmall" color="muted" noMargin>抽屉正文，可滚动。</Typography>
  </Drawer>
</>`,
      },
      {
        title: 'placement 与宽度',
        code: `<Drawer open={openL} onOpenChange={setOpenL} title="左侧" placement="left" width={320}>…</Drawer>
<Drawer open={openT} onOpenChange={setOpenT} title="顶部" placement="top" height="min(36vh, 280px)">…</Drawer>`,
      },
      {
        title: '非遮罩模式',
        code: `<Drawer open={open} onOpenChange={setOpen} title="无遮罩" mask={false}>
  无暗色底，仍锁定背后滚动；点外侧空白可关（maskClosable 默认 true）。
</Drawer>`,
      },
    ],
  },
  {
    name: 'Badge',
    title: 'Badge 角标',
    category: '反馈',
    description: '数字角标或圆点，可锚定在按钮/图标上，也可无锚点独立展示',
    aiDocPath: '/src/components/Badge/Badge.ai.md',
    examples: [
      {
        title: '锚定在按钮上',
        code: `<Badge count={5}>
  <Button size="sm" variant="ghost" aria-label="通知">
    铃
  </Button>
</Badge>
<Badge count={0} showZero>
  <Button size="sm" variant="ghost" aria-label="草稿">
    稿
  </Button>
</Badge>`,
      },
      {
        title: '圆点与无锚点',
        code: `<Badge dot color="error">
  <span>任务</span>
</Badge>
<Badge count={120} max={99} aria-label="未读 99+" />`,
      },
      {
        title: '语义色',
        code: `<Stack direction="row" gap="sm" className="flex-wrap">
  <Badge count={2} color="primary">
    <Button size="sm" variant="ghost">主色</Button>
  </Badge>
  <Badge count={3} color="success">
    <Button size="sm" variant="ghost">成功</Button>
  </Badge>
  <Badge dot color="warning">
    <Button size="sm" variant="ghost">警告点</Button>
  </Badge>
</Stack>`,
      },
    ],
  },
  {
    name: 'Tag',
    title: 'Tag 标签',
    category: '反馈',
    description: '块状标签：solid / soft / outlined，可选可关闭；与 Badge 角标区分',
    aiDocPath: '/src/components/Tag/Tag.ai.md',
    examples: [
      {
        title: '变体',
        code: `<Space wrap size="sm">
  <Tag>soft 默认</Tag>
  <Tag variant="solid" color="primary">
    solid
  </Tag>
  <Tag variant="outlined" color="info">
    outlined
  </Tag>
</Space>`,
      },
      {
        title: '可关闭',
        code: `<Tag
  closable
  onClose={() => {
    /* 从列表移除该项 */
  }}
>
  筛选：已发布
</Tag>`,
      },
      {
        title: '筛选条组合',
        code: `<Space wrap size="sm" align="center">
  <Typography variant="caption" color="muted" noMargin>
    已选
  </Typography>
  <Tag closable color="primary">
    类型 A
  </Tag>
  <Tag closable>标签 B</Tag>
</Space>`,
      },
    ],
  },
  {
    name: 'Spinner',
    title: 'Spinner 加载指示',
    category: '反馈',
    description: '旋转指示器；`Button` `loading` 内使用 `size="inherit"` 与文字对齐',
    aiDocPath: '/src/components/Spinner/Spinner.ai.md',
    examples: [
      {
        title: '尺寸',
        code: `<Space wrap size="md" align="center">
  <Spinner size="xs" />
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
</Space>`,
      },
      {
        title: '语义色',
        code: `<Space wrap size="md" align="center">
  <Spinner color="primary" />
  <Spinner color="success" />
  <Spinner color="warning" />
  <Spinner color="error" />
</Space>`,
      },
      {
        title: 'inherit 与字号',
        code: `<Typography variant="h4" className="flex items-center gap-2">
  <Spinner size="inherit" color="current" aria-hidden />
  加载标题旁
</Typography>`,
      },
    ],
  },
  {
    name: 'Loading',
    title: 'Loading 加载遮罩',
    category: '反馈',
    description: '包裹子树或全屏：`fullscreen` 时 fixed；z-index 低于 Toast',
    aiDocPath: '/src/components/Loading/Loading.ai.md',
    examples: [
      {
        title: '包裹内容',
        code: `<Loading spinning tip="正在同步…">
  <Card title="列表示意" className="min-h-[100px] w-full max-w-md">
    <Typography variant="bodySmall" color="muted" noMargin>
      遮罩盖在卡片上方
    </Typography>
  </Card>
</Loading>`,
      },
      {
        title: '独立占位（无 children）',
        code: `<div className="max-w-md w-full">
  <Loading spinning />
</div>`,
      },
      {
        title: '关闭旋转（仅内容）',
        code: `<Loading spinning={false}>
  <Card className="max-w-md">spinning=false 时不显示遮罩</Card>
</Loading>`,
      },
      {
        title: '全屏演示',
        code: `const [open, setOpen] = useState(false);
useEffect(() => {
  if (!open) return;
  const t = window.setTimeout(() => setOpen(false), 2200);
  return () => window.clearTimeout(t);
}, [open]);

<>
  <Button type="button" onClick={() => setOpen(true)}>
    演示全屏加载约 2 秒
  </Button>
  {open ? <Loading fullscreen tip="请稍候…" /> : null}
</>`,
      },
    ],
  },
  {
    name: 'Progress',
    title: 'Progress 进度条',
    category: '反馈',
    description:
      'role=progressbar：value 0–100、不确定态、语义色与条纹；轨道圆角与表单控件一致。',
    aiDocPath: '/src/components/Progress/Progress.ai.md',
    examples: [
      {
        title: '确定进度',
        code: `<Stack gap="md" className="max-w-md w-full">
  <Progress value={0} />
  <Progress value={35} />
  <Progress value={100} color="success" />
</Stack>`,
      },
      {
        title: '尺寸与标签',
        code: `<Stack gap="md" className="max-w-md w-full">
  <Progress value={48} size="sm" showLabel />
  <Progress value={64} size="md" showLabel color="info" />
  <Progress value={82} size="lg" showLabel color="warning" />
</Stack>`,
      },
      {
        title: '条纹与不确定',
        code: `<Stack gap="md" className="max-w-md w-full">
  <Progress value={55} striped color="primary" />
  <Progress indeterminate aria-label="正在上传" />
</Stack>`,
      },
    ],
  },
  {
    name: 'Skeleton',
    title: 'Skeleton 骨架屏',
    category: '反馈',
    description: 'text / circle / rect 组合占位，active 扫光；与具体业务卡片解耦。',
    aiDocPath: '/src/components/Skeleton/Skeleton.ai.md',
    examples: [
      {
        title: '文本与多行',
        code: `<Stack gap="md" className="max-w-md w-full">
  <Skeleton variant="text" />
  <Skeleton variant="text" rows={3} />
</Stack>`,
      },
      {
        title: '头像 + 段落（列表项）',
        code: `<Flex gap="md" align="start" className="max-w-md w-full">
  <Skeleton variant="circle" width={44} height={44} />
  <Stack gap="sm" className="min-w-0 flex-1">
    <Skeleton variant="text" width="55%" />
    <Skeleton variant="text" rows={2} />
  </Stack>
</Flex>`,
      },
      {
        title: '矩形块与静止',
        code: `<Stack gap="md" className="max-w-md w-full">
  <Skeleton variant="rect" height={96} rounded />
  <Skeleton variant="rect" height={40} active={false} />
</Stack>`,
      },
    ],
  },
  {
    name: 'Alert',
    title: 'Alert 提示条',
    category: '反馈',
    description:
      '页内常驻提示：variant 语义色、可选标题与关闭；默认 role=status，慎用 role=alert。与 Toast 区分见 Alert.ai.md。',
    aiDocPath: '/src/components/Alert/Alert.ai.md',
    examples: [
      {
        title: '四种语义（点击触发）',
        code: `const [kind, setKind] = useState<AlertVariant | null>(null);
const text: Record<AlertVariant, { title: string; children: string }> = {
  info: { title: '提示', children: '配置已缓存，刷新页面后生效。' },
  success: { title: '完成', children: '已成功保存草稿。' },
  warning: { title: '注意', children: '免费额度将在 3 天后重置。' },
  error: { title: '错误', children: '无法连接服务器，请稍后重试。' },
};

<Stack gap="md" className="max-w-lg w-full">
  <Space wrap size="sm">
    <Button size="sm" color="info" onClick={() => setKind('info')}>信息</Button>
    <Button size="sm" color="success" onClick={() => setKind('success')}>成功</Button>
    <Button size="sm" color="warning" onClick={() => setKind('warning')}>警告</Button>
    <Button size="sm" color="error" onClick={() => setKind('error')}>错误</Button>
  </Space>
  {kind ? (
    <Alert variant={kind} title={text[kind].title}>
      {text[kind].children}
    </Alert>
  ) : null}
</Stack>`,
      },
      {
        title: '可关闭',
        code: `const [open, setOpen] = useState(false);

<>
  {!open ? (
    <Button size="sm" variant="soft" onClick={() => setOpen(true)}>
      显示可关闭提示
    </Button>
  ) : (
    <Alert variant="info" closable onClose={() => setOpen(false)} title="可关闭">
      关闭后把 open 设回 false 即可再次展示。
    </Alert>
  )}
</>`,
      },
      {
        title: '通栏与 role=alert',
        code: `const [show, setShow] = useState(false);

<>
  <Button size="sm" variant="soft" onClick={() => setShow(true)}>
    显示通栏错误
  </Button>
  {show ? (
    <Alert variant="error" role="alert" banner title="提交失败">
      请修正标红字段后再试。
    </Alert>
  ) : null}
</>`,
      },
    ],
  },
  {
    name: 'Callout',
    title: 'Callout 说明块',
    category: '反馈',
    description:
      '文档/说明向 aside：左侧色条 + 可选小标题；非 Toast、非 Alert。适合文内注意事项。',
    aiDocPath: '/src/components/Callout/Callout.ai.md',
    examples: [
      {
        title: 'intent 与标题',
        code: `<Stack gap="sm" className="max-w-lg w-full">
  <Callout intent="default" title="说明">
    中性补充，不参与表单校验反馈。
  </Callout>
  <Callout intent="info" title="提示">
    该字段会展示在公开资料页。
  </Callout>
  <Callout intent="warning" title="注意">
    删除后 30 天内可从回收站恢复。
  </Callout>
</Stack>`,
      },
      {
        title: '无标题',
        code: `<Callout intent="success" className="max-w-lg w-full">
  纯正文说明块，左侧仍为成功色强调条。
</Callout>`,
      },
      {
        title: '与正文混排',
        code: `<Stack gap="md" className="max-w-lg w-full">
  <Typography variant="body" noMargin>
    下文为接口约定摘要。
  </Typography>
  <Callout intent="info" title="API">
    <Typography variant="bodySmall" noMargin>
      所有时间戳均为 UTC ISO-8601。
    </Typography>
  </Callout>
</Stack>`,
      },
    ],
  },
  {
    name: 'Empty',
    title: 'Empty 空状态',
    category: '反馈',
    description:
      '列表/区块无数据：插图槽、标题、说明与操作区；内置简笔画。与 Toast 区分见 Empty.ai.md。',
    aiDocPath: '/src/components/Empty/Empty.ai.md',
    examples: [
      {
        title: '内置插图与操作',
        code: `<Empty
  title="暂无数据"
  description="请调整筛选或稍后再试。"
>
  <Button color="primary" size="sm">新建</Button>
</Empty>`,
      },
      {
        title: '自定义图标',
        code: `import { IconPackage } from 'stand-ui/icons';

<Empty
  title="仓库为空"
  description="导入依赖或从模板创建项目。"
  image={<IconPackage size={72} />}
>
  <Button size="sm" variant="soft">导入</Button>
</Empty>`,
      },
      {
        title: '无图区',
        code: `<Empty title="筛选结果为空" description="当前条件下没有匹配项。" image={null} />`,
      },
    ],
  },
  {
    name: 'Result',
    title: 'Result 结果页',
    category: '反馈',
    description:
      '整页/大块结果态：success/error/403/404 等内置图标与 extra 操作区。与 Toast、Empty 区分见 Result.ai.md。',
    aiDocPath: '/src/components/Result/Result.ai.md',
    examples: [
      {
        title: '成功',
        code: `<Result
  status="success"
  title="提交成功"
  subTitle="我们已收到申请，将在 1～3 个工作日内处理。"
  extra={<Button color="primary" size="sm">返回首页</Button>}
/>`,
      },
      {
        title: '错误与双操作',
        code: `<Result
  status="error"
  title="支付失败"
  subTitle="银行返回超时，请重试或更换支付方式。"
  extra={
    <Stack direction="row" gap="sm">
      <Button size="sm" variant="soft">联系客服</Button>
      <Button size="sm" color="primary">重新支付</Button>
    </Stack>
  }
/>`,
      },
      {
        title: '404',
        code: `<Result
  status="404"
  title="页面不存在"
  subTitle="链接可能已失效，或内容已被移除。"
  extra={<Button size="sm" variant="soft">返回上一页</Button>}
>
  错误码 404 · 如需帮助请联系管理员
</Result>`,
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
