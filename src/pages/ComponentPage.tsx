import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { componentDocs, type Example } from '../docs/components';
import { Button } from '../components/Button';
import { FormField, Label } from '../components/FormField';
import { Checkbox, CheckboxGroup } from '../components/Checkbox';
import { Input } from '../components/Input';
import { Radio, RadioGroup } from '../components/Radio';
import { Select } from '../components/Select';
import { Textarea } from '../components/Textarea';
import { Switch } from '../components/Switch';
import { Form } from '../components/Form';
import { FormSection } from '../components/FormSection';
import { Card } from '../components/Card';
import { toast } from '../components/Toast';
import { Typography, TypographyLink } from '../components/Typography';
import { Divider, Separator } from '../components/Divider';
import { AspectRatio } from '../components/AspectRatio';
import { Flex, Grid, Space, Stack } from '../components/Layout';
import { IconDataNode, IconSearch } from '../icons';

// 导入 AI 文档内容
import ButtonAiMd from '../components/Button/Button.ai.md?raw';
import InputAiMd from '../components/Input/Input.ai.md?raw';
import FormFieldAiMd from '../components/FormField/FormField.ai.md?raw';
import CardAiMd from '../components/Card/Card.ai.md?raw';
import ToastAiMd from '../components/Toast/Toast.ai.md?raw';
import TypographyAiMd from '../components/Typography/Typography.ai.md?raw';
import DividerAiMd from '../components/Divider/Divider.ai.md?raw';
import LayoutAiMd from '../components/Layout/Layout.ai.md?raw';
import AspectRatioAiMd from '../components/AspectRatio/AspectRatio.ai.md?raw';
import TextareaAiMd from '../components/Textarea/Textarea.ai.md?raw';
import SelectAiMd from '../components/Select/Select.ai.md?raw';
import CheckboxAiMd from '../components/Checkbox/Checkbox.ai.md?raw';
import RadioAiMd from '../components/Radio/Radio.ai.md?raw';
import SwitchAiMd from '../components/Switch/Switch.ai.md?raw';
import FormSectionAiMd from '../components/FormSection/FormSection.ai.md?raw';
import FormAiMd from '../components/Form/Form.ai.md?raw';

/** 文档预览：固定 SVG，避免外链占位图失效 */
const ASPECT_RATIO_DEMO_IMG_SRC =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect fill="#0ea5e9" width="800" height="400"/><rect fill="#e11d48" x="120" y="60" width="560" height="280" rx="12"/></svg>'
  );

/** Toast 为命令式 API，无预览组件，仅占位以通过文档路由校验 */
const ToastDocPlaceholder: React.FC = () => null;

/** 布局工具为多个导出组件，仅占位以通过文档路由校验 */
const LayoutDocPlaceholder: React.FC = () => null;

function TextareaDocDemo({ idx }: { idx: number }) {
  switch (idx) {
    case 0:
      return (
        <Stack gap="md" className="max-w-xl w-full">
          <Textarea placeholder="纵向可拖拽调整高度…" rows={3} />
          <Textarea resize="none" placeholder="禁止拖拽" rows={2} />
        </Stack>
      );
    case 1:
      return (
        <Stack gap="md" className="max-w-xl w-full">
          <Textarea size="sm" rows={2} placeholder="sm" />
          <Textarea size="lg" rows={2} placeholder="lg" />
          <Textarea color="error" rows={2} placeholder="error 描边" />
        </Stack>
      );
    case 2:
      return (
        <FormField label="备注" description="选填" className="max-w-lg w-full">
          <Textarea rows={3} placeholder="补充说明" />
        </FormField>
      );
    default:
      return (
        <Typography variant="body" color="muted">
          无该示例索引
        </Typography>
      );
  }
}

function SelectDocDemo({ idx }: { idx: number }) {
  switch (idx) {
    case 0:
      return (
        <div className="max-w-md w-full">
          <Select
            placeholder="请选择"
            options={[
              { value: 'a', label: '选项 A' },
              { value: 'b', label: '选项 B' },
            ]}
          />
        </div>
      );
    case 1:
      return (
        <div className="max-w-md w-full">
          <Select placeholder="请选择">
            <option value="x">手写选项 X</option>
            <option value="y">手写选项 Y</option>
          </Select>
        </div>
      );
    case 2:
      return (
        <FormField label="地区" error="请选择" className="max-w-lg w-full">
          <Select placeholder="请选择" options={[{ value: 'sh', label: '上海' }]} />
        </FormField>
      );
    case 3:
      return (
        <div className="max-w-md w-full">
          <Select
            placeholder="套餐"
            options={[
              { value: 'free', label: '免费版', meta: { hint: '适合体验' } },
              { value: 'pro', label: '专业版', meta: { hint: '全功能' } },
            ]}
            renderOption={({ option, selected }) => {
              const hint = (option.meta as { hint?: string } | undefined)?.hint;
              return (
                <div>
                  <div>
                    {option.label}
                    {selected ? ' ✓' : ''}
                  </div>
                  <Typography variant="caption" color="muted" noMargin>
                    {hint}
                  </Typography>
                </div>
              );
            }}
          />
        </div>
      );
    default:
      return (
        <Typography variant="body" color="muted">
          无该示例索引
        </Typography>
      );
  }
}

function CheckboxDocDemo({ idx }: { idx: number }) {
  const [skills, setSkills] = useState<string[]>(['ts']);
  const [notify, setNotify] = useState<string[]>([]);

  switch (idx) {
    case 0:
      return <Checkbox defaultChecked label="同意条款" />;
    case 1:
      return (
        <CheckboxGroup name="skill-doc" value={skills} onValueChange={setSkills}>
          <Checkbox value="ts" label="TypeScript" />
          <Checkbox value="rust" label="Rust" />
        </CheckboxGroup>
      );
    case 2:
      return (
        <FormField label="通知方式" error="至少选一项" className="max-w-lg w-full">
          <CheckboxGroup name="notify-doc" value={notify} onValueChange={setNotify}>
            <Checkbox value="email" label="邮件" />
            <Checkbox value="sms" label="短信" />
          </CheckboxGroup>
        </FormField>
      );
    default:
      return (
        <Typography variant="body" color="muted">
          无该示例索引
        </Typography>
      );
  }
}

function SwitchDocDemo({ idx }: { idx: number }) {
  const [on, setOn] = useState(false);

  switch (idx) {
    case 0:
      return (
        <Stack gap="md" className="max-w-md w-full">
          <Switch defaultChecked onCheckedChange={() => {}} />
          <Switch label="启用邮件通知" />
        </Stack>
      );
    case 1:
      return (
        <Stack direction="row" gap="lg" align="center" className="flex-wrap">
          <Switch size="sm" defaultChecked />
          <Switch size="md" defaultChecked />
        </Stack>
      );
    case 2:
      return (
        <Stack gap="md" className="max-w-md w-full">
          <Switch disabled defaultChecked label="禁用（开）" />
          <Switch readOnly defaultChecked label="只读（开）" />
        </Stack>
      );
    case 3:
      return (
        <FormField label="同意条款" error="请开启开关" className="max-w-md w-full">
          <Switch checked={on} onCheckedChange={(v) => setOn(v)} />
        </FormField>
      );
    default:
      return (
        <Typography variant="body" color="muted">
          无该示例索引
        </Typography>
      );
  }
}

function FormDocDemo({ idx }: { idx: number }) {
  switch (idx) {
    case 0:
      return (
        <Form
          className="max-w-lg w-full"
          onSubmit={(e) => {
            e.preventDefault();
            toast('已拦截提交（演示）');
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
        </Form>
      );
    case 1:
      return (
        <Form layout="horizontal" className="max-w-xl w-full">
          <FormField label="用户名" labelWidth={96} required>
            <Input name="user" placeholder="唯一标识" />
          </FormField>
          <FormField label="邮箱" labelWidth={96}>
            <Input type="email" name="email" placeholder="you@example.com" />
          </FormField>
        </Form>
      );
    case 2:
      return (
        <Form size="sm" className="max-w-md w-full">
          <FormField label="标题">
            <Input placeholder="sm 输入框" />
          </FormField>
          <FormField label="类型">
            <Select placeholder="请选择" options={[{ value: 'a', label: 'A' }]} />
          </FormField>
        </Form>
      );
    case 3:
      return (
        <Form disabled className="max-w-md w-full">
          <FormField label="只读项">
            <Input defaultValue="不可编辑" />
          </FormField>
        </Form>
      );
    default:
      return (
        <Typography variant="body" color="muted">
          无该示例索引
        </Typography>
      );
  }
}

function FormSectionDocDemo({ idx }: { idx: number }) {
  switch (idx) {
    case 0:
      return (
        <FormSection title="联系方式" description="至少填写一项" className="max-w-lg w-full">
          <FormField label="邮箱">
            <Input type="email" placeholder="you@example.com" />
          </FormField>
          <FormField label="手机">
            <Input type="tel" placeholder="选填" />
          </FormField>
        </FormSection>
      );
    case 1:
      return (
        <FormSection
          as="div"
          title="偏好设置"
          description="可随时在设置中修改"
          className="max-w-lg w-full"
        >
          <FormField label="主题">
            <Select placeholder="请选择" options={[{ value: 'dark', label: '深色' }]} />
          </FormField>
        </FormSection>
      );
    case 2:
      return (
        <FormSection title="已归档" disabled className="max-w-lg w-full">
          <FormField label="备注">
            <Input placeholder="不可编辑" />
          </FormField>
        </FormSection>
      );
    default:
      return (
        <Typography variant="body" color="muted">
          无该示例索引
        </Typography>
      );
  }
}

function RadioDocDemo({ idx }: { idx: number }) {
  const [plan, setPlan] = useState('pro');
  const [tier, setTier] = useState('b');
  const [pkg, setPkg] = useState('basic');

  switch (idx) {
    case 0:
      return (
        <RadioGroup name="plan-doc" value={plan} onValueChange={setPlan}>
          <Radio value="free" label="免费版" />
          <Radio value="pro" label="专业版" />
        </RadioGroup>
      );
    case 1:
      return (
        <RadioGroup name="tier-doc" value={tier} horizontal onValueChange={setTier}>
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
        </RadioGroup>
      );
    case 2:
      return (
        <FormField label="套餐" error="请选择一项" className="max-w-lg w-full">
          <RadioGroup name="pkg-doc" value={pkg} onValueChange={setPkg}>
            <Radio value="basic" label="基础" />
            <Radio value="pro" label="专业" />
          </RadioGroup>
        </FormField>
      );
    default:
      return (
        <Typography variant="body" color="muted">
          无该示例索引
        </Typography>
      );
  }
}

// 动态导入组件
const componentMap: Record<string, React.ElementType> = {
  Button,
  Input,
  FormField,
  Card,
  Toast: ToastDocPlaceholder,
  Typography,
  Divider,
  AspectRatio,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Form,
  FormSection,
  Layout: LayoutDocPlaceholder,
};

// AI 文档映射
const aiDocMap: Record<string, string> = {
  Button: ButtonAiMd,
  Input: InputAiMd,
  FormField: FormFieldAiMd,
  Card: CardAiMd,
  Toast: ToastAiMd,
  Typography: TypographyAiMd,
  Divider: DividerAiMd,
  AspectRatio: AspectRatioAiMd,
  Textarea: TextareaAiMd,
  Select: SelectAiMd,
  Checkbox: CheckboxAiMd,
  Radio: RadioAiMd,
  Switch: SwitchAiMd,
  FormSection: FormSectionAiMd,
  Form: FormAiMd,
  Layout: LayoutAiMd,
};

/** 按表格竖线拆分单元格，忽略反引号对内的 |（避免类型列里的联合类型拆坏） */
const splitTableCells = (line: string): string[] => {
  const cells: string[] = [];
  let cur = '';
  let inBackticks = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '`') {
      inBackticks = !inBackticks;
      cur += c;
      continue;
    }
    if (c === '|' && !inBackticks) {
      if (cur.endsWith('\\')) {
        cur = `${cur.slice(0, -1)}|`;
        continue;
      }
      cells.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  cells.push(cur.trim());
  while (cells.length > 0 && cells[0] === '') cells.shift();
  while (cells.length > 0 && cells[cells.length - 1] === '') cells.pop();
  return cells;
};

// 简单的 markdown 渲染函数
const renderMarkdown = (md: string): React.ReactNode => {
  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLang = '';
  let listItems: React.ReactNode[] = [];
  let orderedItems: React.ReactNode[] = [];
  let tableRows: React.ReactNode[] = [];
  let tableColCount = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={`list-${elements.length}`} className="markdown-ul">{listItems}</ul>);
      listItems = [];
    }
    if (orderedItems.length > 0) {
      elements.push(<ol key={`olist-${elements.length}`} className="markdown-ol">{orderedItems}</ol>);
      orderedItems = [];
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <div
          key={`table-${elements.length}`}
          className="markdown-table"
          style={{ ['--md-table-cols' as string]: String(Math.max(tableColCount, 1)) }}
        >
          {tableRows}
        </div>
      );
      tableRows = [];
      tableColCount = 0;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 代码块处理
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushList();
        flushTable();
        elements.push(
          <pre key={i} className="markdown-code">
            <code className={codeLang ? `language-${codeLang}` : ''}>
              {codeContent.join('\n')}
            </code>
          </pre>
        );
        codeContent = [];
        codeLang = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // 空行 - 刷新列表和表格
    if (trimmed === '') {
      flushList();
      flushTable();
      continue;
    }

    // 标题
    if (trimmed.startsWith('# ')) {
      flushList();
      flushTable();
      elements.push(<h1 key={i} className="markdown-h1">{parseInlineMarkdown(trimmed.slice(2))}</h1>);
    } else if (trimmed.startsWith('## ')) {
      flushList();
      flushTable();
      elements.push(<h2 key={i} className="markdown-h2">{parseInlineMarkdown(trimmed.slice(3))}</h2>);
    } else if (trimmed.startsWith('### ')) {
      flushList();
      flushTable();
      elements.push(<h3 key={i} className="markdown-h3">{parseInlineMarkdown(trimmed.slice(4))}</h3>);
    } else if (trimmed.startsWith('#### ')) {
      flushList();
      flushTable();
      elements.push(<h4 key={i} className="markdown-h4">{parseInlineMarkdown(trimmed.slice(5))}</h4>);
    }
    // 无序列表
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushTable();
      if (orderedItems.length > 0) {
        elements.push(<ol key={`olist-flush-${i}`} className="markdown-ol">{orderedItems}</ol>);
        orderedItems = [];
      }
      listItems.push(
        <li key={i} className="markdown-li">{parseInlineMarkdown(trimmed.slice(2))}</li>
      );
    }
    // 有序列表 1. xxx
    else if (/^\d+\.\s/.test(trimmed)) {
      flushTable();
      if (listItems.length > 0) {
        elements.push(<ul key={`ul-flush-${i}`} className="markdown-ul">{listItems}</ul>);
        listItems = [];
      }
      const text = trimmed.replace(/^\d+\.\s*/, '');
      orderedItems.push(
        <li key={i} className="markdown-oli">{parseInlineMarkdown(text)}</li>
      );
    }
    // 表格
    else if (trimmed.startsWith('|')) {
      flushList();
      // 跳过表格分隔行 |---|---|
      if (trimmed.match(/^\|[-:\s|]+\|$/)) {
        continue;
      }
      const cells = splitTableCells(trimmed);
      if (cells.length === 0) continue;
      if (tableRows.length === 0) {
        tableColCount = cells.length;
      }
      const isHeader = tableRows.length === 0;
      tableRows.push(
        <div key={i} className={`markdown-table-row ${isHeader ? 'markdown-table-header' : ''}`}>
          {cells.map((cell, idx) => (
            <div key={idx} className="markdown-table-cell">{parseInlineMarkdown(cell)}</div>
          ))}
        </div>
      );
    }
    // 普通段落
    else {
      flushList();
      flushTable();
      elements.push(
        <p key={i} className="markdown-p">{parseInlineMarkdown(trimmed)}</p>
      );
    }
  }

  // 刷新剩余的列表和表格
  flushList();
  flushTable();

  return <div className="markdown-body">{elements}</div>;
};

// 行内 markdown 解析
const parseInlineMarkdown = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let current = '';
  let i = 0;

  while (i < text.length) {
    // 行内代码 `code`
    if (text[i] === '`') {
      const endIdx = text.indexOf('`', i + 1);
      if (endIdx > i) {
        if (current) {
          parts.push(current);
          current = '';
        }
        parts.push(<code key={i} className="markdown-inline-code">{text.slice(i + 1, endIdx)}</code>);
        i = endIdx + 1;
        continue;
      }
    }
    // 加粗 **text**
    if (text.slice(i, i + 2) === '**') {
      const endIdx = text.indexOf('**', i + 2);
      if (endIdx > i) {
        if (current) {
          parts.push(current);
          current = '';
        }
        parts.push(<strong key={i}>{text.slice(i + 2, endIdx)}</strong>);
        i = endIdx + 2;
        continue;
      }
    }
    current += text[i];
    i++;
  }

  if (current) {
    parts.push(current);
  }

  return <>{parts}</>;
};

export const ComponentPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [activeExample, setActiveExample] = useState(0);

  const doc = componentDocs.find(d => d.name === name);
  const Component = name ? componentMap[name] : null;
  const aiDoc = name ? aiDocMap[name] || '' : '';

  if (!doc || !Component) {
    return <div>组件未找到</div>;
  }

  const renderButtonExamples = (_example: Example, idx: number) => {
    const wrap = (children: React.ReactNode) => (
      <div className="example-preview-inner flex gap-3 flex-wrap items-center">{children}</div>
    );
    switch (idx) {
      case 0:
        return wrap(
          <>
            <Button>默认</Button>
            <Button color="primary">主要</Button>
            <Button color="secondary">次要</Button>
            <Button color="default">中性</Button>
          </>
        );
      case 1:
        return wrap(
          <>
            <Button variant="solid">实心 solid</Button>
            <Button variant="soft">柔和 soft</Button>
            <Button variant="outlined">描边 outlined</Button>
            <Button variant="ghost">幽灵 ghost</Button>
            <Button variant="link">链接 link</Button>
          </>
        );
      case 2:
        return wrap(
          <>
            <Button size="xs">xs</Button>
            <Button size="sm">sm</Button>
            <Button size="md">md</Button>
            <Button size="lg">lg</Button>
            <Button size="xl">xl</Button>
          </>
        );
      case 3:
        return wrap(
          <>
            <Button loading>加载中</Button>
            <Button disabled>已禁用</Button>
            <Button color="error">危险 solid</Button>
            <Button color="error" variant="outlined">危险 outlined</Button>
          </>
        );
      case 4:
        return wrap(
          <>
            <Button color="primary">primary</Button>
            <Button color="success">success</Button>
            <Button color="warning">warning</Button>
            <Button color="error">error</Button>
            <Button color="info">info</Button>
          </>
        );
      case 5:
        return wrap(
          <>
            <Button radius="none">none</Button>
            <Button radius="sm">sm</Button>
            <Button radius="md">md</Button>
            <Button radius="lg">lg</Button>
            <Button radius="full">pill</Button>
          </>
        );
      case 6:
        return (
          <div className="example-preview-inner flex flex-col gap-3 max-w-md">
            <Button block>块级 block 100%</Button>
            <div className="flex gap-3 flex-wrap items-center">
              <Button leftIcon={<span aria-hidden>＋</span>}>左侧图标</Button>
              <Button rightIcon={<span aria-hidden>→</span>}>右侧图标</Button>
            </div>
          </div>
        );
      default:
        return wrap(
          <>
            <Button color="primary">主要</Button>
            <Button variant="outlined">描边</Button>
          </>
        );
    }
  };

  const renderDividerExamples = (_example: Example, idx: number) => {
    const col = (node: React.ReactNode) => (
      <div className="flex flex-col gap-0 max-w-lg">{node}</div>
    );
    switch (idx) {
      case 0:
        return col(
          <>
            <Typography variant="bodySmall" color="muted" noMargin>
              solid / dashed / dotted / subtle
            </Typography>
            <Divider />
            <Divider variant="dashed" />
            <Divider variant="dotted" spacing="sm" />
            <Divider color="subtle" spacing="md" />
          </>
        );
      case 1:
        return col(
          <>
            <Divider>默认居中</Divider>
            <Divider titleAlign="start">靠左</Divider>
            <Divider titleAlign="end" variant="dashed">
              靠右
            </Divider>
          </>
        );
      case 2:
        return (
          <div
            className="flex flex-row items-stretch gap-3 min-h-[100px] max-w-xl rounded-lg border border-[var(--su-border-default)] p-3"
            style={{ borderColor: 'var(--su-border-default)' }}
          >
            <span className="text-sm">区域 A</span>
            <Divider orientation="vertical" />
            <span className="text-sm">区域 B</span>
            <Separator orientation="vertical" spacing="sm" />
            <span className="text-sm text-[var(--su-text-muted)]">
              区域 C（Separator）
            </span>
          </div>
        );
      case 3:
        return col(
          <>
            <Typography variant="caption" color="muted" noMargin>
              下方为 Separator（读屏可识别分隔）
            </Typography>
            <Separator spacing="sm" />
            <Typography variant="caption" color="muted" noMargin>
              与将 Divider 的 decorative 设为 false 等价
            </Typography>
            <Divider decorative={false} spacing="sm" />
          </>
        );
      default:
        return col(
          <Typography variant="body" color="muted">
            无该示例索引
          </Typography>
        );
    }
  };

  const renderFormFieldExamples = (_example: Example, idx: number) => {
    switch (idx) {
      case 0:
        return (
          <Stack gap="xl" className="max-w-md w-full">
            <FormField label="邮箱" description="用于登录与找回密码" required>
              <Input type="email" placeholder="you@example.com" required />
            </FormField>
            <FormField label="昵称" error="2～16 个字符">
              <Input placeholder="输入昵称" />
            </FormField>
          </Stack>
        );
      case 1:
        return (
          <FormField label="用户名" layout="horizontal" labelWidth={100} required>
            <Input placeholder="唯一标识" required />
          </FormField>
        );
      case 2:
        return (
          <Stack gap="sm" className="max-w-md w-full">
            <Label htmlFor="demo-field-a">备注</Label>
            <Input id="demo-field-a" placeholder="选填" />
          </Stack>
        );
      case 3:
        return (
          <Stack gap="lg" className="max-w-md w-full">
            <FormField label="推送通知" description="关闭后不再收到消息">
              <Switch defaultChecked />
            </FormField>
            <FormField label="公开资料" error="请先阅读并同意条款">
              <Switch />
            </FormField>
          </Stack>
        );
      default:
        return (
          <Typography variant="body" color="muted">
            无该示例索引
          </Typography>
        );
    }
  };

  const renderAspectRatioExamples = (_example: Example, idx: number) => {
    switch (idx) {
      case 0:
        return (
          <Stack gap="xl" className="max-w-xl w-full">
            <Stack gap="sm">
              <Typography variant="caption" color="muted">
                16 : 9
              </Typography>
              <AspectRatio
                ratio={16 / 9}
                className="w-full rounded-lg overflow-hidden border border-[var(--su-border-default)]"
              >
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--su-info-500), var(--su-primary-600))',
                  }}
                  aria-hidden
                />
              </AspectRatio>
            </Stack>
            <Stack gap="sm">
              <Typography variant="caption" color="muted">
                1 : 1
              </Typography>
              <AspectRatio
                ratio={1}
                className="w-32 rounded-md overflow-hidden border border-[var(--su-border-default)]"
              >
                <div
                  className="h-full w-full"
                  style={{ background: 'var(--su-bg-muted)' }}
                  aria-hidden
                />
              </AspectRatio>
            </Stack>
          </Stack>
        );
      case 1:
        return (
          <Stack gap="xl" className="max-w-2xl w-full">
            <Stack gap="sm">
              <Typography variant="caption" color="muted">
                cover（裁切铺满）
              </Typography>
              <AspectRatio
                ratio={16 / 9}
                objectFit="cover"
                className="w-full max-w-md rounded-md overflow-hidden"
              >
                <img src={ASPECT_RATIO_DEMO_IMG_SRC} alt="" />
              </AspectRatio>
            </Stack>
            <Stack gap="sm">
              <Typography variant="caption" color="muted">
                contain（完整显示）
              </Typography>
              <AspectRatio
                ratio={16 / 9}
                objectFit="contain"
                className="w-full max-w-md rounded-md overflow-hidden bg-[var(--su-bg-muted)]"
              >
                <img src={ASPECT_RATIO_DEMO_IMG_SRC} alt="" />
              </AspectRatio>
            </Stack>
          </Stack>
        );
      case 2:
        return (
          <div
            className="max-w-2xl w-full overflow-hidden rounded-lg border border-[var(--su-border-default)] bg-[var(--su-bg-elevated)]"
            style={{ boxShadow: 'var(--su-shadow-sm)' }}
          >
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
          </div>
        );
      default:
        return (
          <Stack gap="md">
            <Typography variant="body" color="muted">
              无该示例索引
            </Typography>
          </Stack>
        );
    }
  };

  const renderLayoutExamples = (_example: Example, idx: number) => {
    switch (idx) {
      case 0:
        return (
          <Stack gap="xl" className="max-w-2xl w-full">
            <Stack gap="sm">
              <Typography variant="caption" color="muted">
                主轴两头对齐 + 换行
              </Typography>
              <Flex
                gap="md"
                justify="between"
                align="center"
                wrap
                className="w-full rounded-lg border border-[var(--su-border-default)] p-3"
              >
                <Typography variant="bodySmall" color="muted" noMargin>
                  左侧说明
                </Typography>
                <Button size="sm">操作</Button>
              </Flex>
            </Stack>
            <Stack gap="sm">
              <Typography variant="caption" color="muted">
                纵向 gap
              </Typography>
              <Flex direction="column" gap="sm" align="start" className="text-sm text-[var(--su-text-muted)]">
                <span>第一行</span>
                <span>第二行</span>
              </Flex>
            </Stack>
          </Stack>
        );
      case 1:
        return (
          <Stack gap="xl" className="max-w-sm w-full">
            <Stack gap="md" fullWidth>
              <Typography variant="caption" color="muted">
                登录
              </Typography>
              <Input placeholder="邮箱" />
              <Input type="password" placeholder="密码" />
              <Button color="primary" block>
                登录
              </Button>
            </Stack>
            <Stack gap="sm">
              <Typography variant="caption" color="muted">
                次要操作（横向）
              </Typography>
              <Stack direction="row" gap="sm" align="center">
                <Button size="xs" variant="soft">
                  忘记密码
                </Button>
                <Button size="xs" variant="ghost">
                  注册
                </Button>
              </Stack>
            </Stack>
          </Stack>
        );
      case 2:
        return (
          <Stack gap="xl" className="max-w-3xl w-full">
            <Stack gap="sm">
              <Typography variant="caption" color="muted">
                三等分
              </Typography>
              <Grid columns={3} gap="md" className="w-full">
                <Card>一</Card>
                <Card>二</Card>
                <Card>三</Card>
              </Grid>
            </Stack>
            <Stack gap="sm">
              <Typography variant="caption" color="muted">
                minChildWidth + auto-fit 拉满
              </Typography>
              <Grid minChildWidth={140} autoRepeat="fit" gap="sm" className="w-full">
                <Button size="sm">A</Button>
                <Button size="sm">B</Button>
                <Button size="sm">C</Button>
                <Button size="sm">D</Button>
              </Grid>
            </Stack>
            <Stack gap="sm">
              <Typography variant="caption" color="muted">
                固定行高下限
              </Typography>
              <Grid columns={2} autoRows="minmax(72px, auto)" gap="sm" className="w-full">
                <Card>区域 A</Card>
                <Card>区域 B</Card>
              </Grid>
            </Stack>
          </Stack>
        );
      case 3:
        return (
          <Stack gap="xl" className="max-w-2xl w-full">
            <Stack gap="sm">
              <Typography variant="caption" color="muted">
                换行工具条
              </Typography>
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
              <Typography variant="caption" color="muted">
                split + 竖线
              </Typography>
              <Space
                align="stretch"
                size="sm"
                split={<Divider orientation="vertical" spacing="none" />}
              >
                <Typography variant="caption" color="muted" noMargin>
                  首页
                </Typography>
                <Typography variant="caption" color="muted" noMargin>
                  文档
                </Typography>
              </Space>
            </Stack>
            <Stack gap="sm">
              <Typography variant="caption" color="muted">
                纵向排列
              </Typography>
              <Space direction="vertical" size="sm" align="start">
                <span className="text-sm text-[var(--su-text-muted)]">上一项</span>
                <span className="text-sm text-[var(--su-text-muted)]">下一项</span>
              </Space>
            </Stack>
          </Stack>
        );
      default:
        return (
          <Stack gap="md">
            <Typography variant="body" color="muted">
              无该示例索引
            </Typography>
          </Stack>
        );
    }
  };

  const renderTypographyExamples = (_example: Example, idx: number) => {
    const box = (children: React.ReactNode) => (
      <div className="flex flex-col gap-4 max-w-xl">{children}</div>
    );
    switch (idx) {
      case 0:
        return box(
          <>
            <Typography variant="display" as="h1">
              Display
            </Typography>
            <Typography variant="h1">h1</Typography>
            <Typography variant="h2">h2</Typography>
            <Typography variant="h3">h3</Typography>
            <Typography variant="h4">h4</Typography>
            <Typography variant="h5">h5</Typography>
            <Typography variant="h6">h6</Typography>
            <Typography variant="subtitle">subtitle 副标题说明</Typography>
          </>
        );
      case 1:
        return box(
          <>
            <Typography variant="lead">lead 导语略大</Typography>
            <Typography variant="bodyLarge">bodyLarge 偏大正文</Typography>
            <Typography variant="body">body 标准正文</Typography>
            <Typography variant="bodySmall" color="muted">
              bodySmall 偏小次要
            </Typography>
          </>
        );
      case 2:
        return box(
          <>
            <Typography variant="caption" color="muted">
              caption 图注脚注
            </Typography>
            <Typography variant="label" as="label">
              label 表单标签
            </Typography>
            <Typography variant="overline">overline 分类标签</Typography>
            <Typography variant="body" as="p">
              行内{' '}
              <Typography variant="code" as="code" noMargin>
                npm i
              </Typography>{' '}
              命令
            </Typography>
            <Typography variant="blockquote">blockquote 引用块</Typography>
          </>
        );
      case 3:
        return box(
          <>
            <Typography variant="body" color="default">
              default
            </Typography>
            <Typography variant="body" color="muted">
              muted
            </Typography>
            <Typography variant="body" color="subtle">
              subtle
            </Typography>
            <Typography variant="body" color="emphasis">
              emphasis
            </Typography>
            <Typography variant="body" color="primary">
              primary
            </Typography>
            <Typography variant="body" color="secondary">
              secondary
            </Typography>
            <Typography variant="body" color="info">
              info
            </Typography>
            <Typography variant="body" color="success">
              success
            </Typography>
            <Typography variant="body" color="warning">
              warning
            </Typography>
            <Typography variant="body" color="error">
              error
            </Typography>
            <div
              style={{
                background: '#0f1419',
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Typography variant="body" color="inverse">
                inverse（深色底）
              </Typography>
            </div>
          </>
        );
      case 4:
        return box(
          <>
            <Typography variant="body" weight="normal">
              normal
            </Typography>
            <Typography variant="body" weight="medium">
              medium
            </Typography>
            <Typography variant="body" weight="semibold">
              semibold
            </Typography>
            <Typography variant="body" weight="bold">
              bold
            </Typography>
            <Typography variant="body" textAlign="start">
              textAlign start
            </Typography>
            <Typography variant="body" textAlign="center">
              textAlign center
            </Typography>
            <Typography variant="body" textAlign="end">
              textAlign end
            </Typography>
            <Typography variant="bodySmall" textAlign="justify" noMargin>
              justify 长段两端对齐（中文慎用）。这是一段用于演示 justify
              对齐方式的示例文字，需要足够长度才能看出两端对齐效果。
            </Typography>
          </>
        );
      case 5:
        return box(
          <div className="flex flex-col gap-3 max-w-xs">
            <Typography variant="body" truncate noMargin>
              单行省略：很长很长的文件名或表格单元格
            </Typography>
            <Typography variant="body" lineClamp={2} noMargin>
              多行省略：第二行后省略，第三行不应完整出现。
            </Typography>
            <Typography variant="body" lineClamp={4} noMargin>
              lineClamp=4：第一行第二行第三行第四行，第五行起应被省略。适合卡片摘要等多行展示场景。
            </Typography>
          </div>
        );
      case 6:
        return box(
          <>
            <Typography variant="body" copyable>
              从子节点抽取纯文本复制
            </Typography>
            <Typography
              variant="body"
              copyable={{ text: '固定复制内容', tooltip: '复制' }}
            >
              展示文案可与复制内容不同
            </Typography>
            <Typography variant="caption" copyable={{ text: 'ORDER-2026-001' }}>
              订单号（点复制）
            </Typography>
          </>
        );
      case 7:
        return box(
          <div className="flex flex-col gap-2 items-start">
            <Typography.Link href="https://example.com" external color="info">
              外链 Typography.Link
            </Typography.Link>
            <TypographyLink href="/component/Typography" color="primary">
              站内 TypographyLink
            </TypographyLink>
            <Typography variant="link" as="span">
              link 仅样式（非 a 标签）
            </Typography>
          </div>
        );
      case 8:
        return box(
          <>
            <Typography variant="h2" as="div" role="heading" aria-level={2}>
              视觉像 h2，语义 div（模态标题常用）
            </Typography>
            <Typography variant="caption" as="span" color="muted" title="悬停说明">
              带 title 的小字
            </Typography>
            <Typography variant="body" color="error" role="alert">
              错误提示（本节点已设置 role=&quot;alert&quot;）
            </Typography>
          </>
        );
      case 9:
        return box(
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <Typography variant="bodySmall" noMargin>
                列表项内紧凑
              </Typography>
            </li>
            <li>
              <Typography variant="bodySmall" noMargin>
                第二项
              </Typography>
            </li>
          </ul>
        );
      case 10:
        return box(
          <article>
            <Typography variant="overline">分类</Typography>
            <Typography variant="h1" as="h1">
              文章标题
            </Typography>
            <Typography variant="subtitle">副标题</Typography>
            <Typography variant="lead">摘要 lead。</Typography>
            <Typography variant="body">正文段落。</Typography>
            <Typography variant="bodySmall" color="muted">
              更新日期等元信息
            </Typography>
          </article>
        );
      case 11:
        return box(
          <>
            <Typography variant="h3" className="opacity-90">
              叠加任意 className
            </Typography>
            <Typography variant="body" style={{ maxWidth: '42ch' }}>
              style 限制行长（ch）：较窄段落便于阅读。
            </Typography>
          </>
        );
      default:
        return box(
          <Typography variant="body" color="muted">
            无该示例索引
          </Typography>
        );
    }
  };

  const renderExample = (example: Example, idx: number) => {
    return (
      <div className="example-preview">
        {doc.name === 'Button' && renderButtonExamples(example, idx)}
        {doc.name === 'Input' && (
          <div className="flex flex-col gap-3 max-w-md">
            <Input placeholder="请输入" />
            <Input prefix={<IconSearch size={16} />} placeholder="搜索" />
            <Input type="password" placeholder="密码" />
          </div>
        )}
        {doc.name === 'FormField' && renderFormFieldExamples(example, idx)}
        {doc.name === 'Textarea' && <TextareaDocDemo idx={idx} />}
        {doc.name === 'Select' && <SelectDocDemo idx={idx} />}
        {doc.name === 'Checkbox' && <CheckboxDocDemo idx={idx} />}
        {doc.name === 'Radio' && <RadioDocDemo idx={idx} />}
        {doc.name === 'Switch' && <SwitchDocDemo idx={idx} />}
        {doc.name === 'Form' && <FormDocDemo idx={idx} />}
        {doc.name === 'FormSection' && <FormSectionDocDemo idx={idx} />}
        {doc.name === 'Card' && (
          <div className="max-w-md">
            <Card 
              title="示例卡片" 
              subtitle="这是一个示例"
              footer={<Button size="sm">确认</Button>}
            >
              卡片内容区域
            </Card>
          </div>
        )}
        {doc.name === 'Typography' && renderTypographyExamples(example, idx)}
        {doc.name === 'Divider' && renderDividerExamples(example, idx)}
        {doc.name === 'AspectRatio' && renderAspectRatioExamples(example, idx)}
        {doc.name === 'Layout' && renderLayoutExamples(example, idx)}
        {doc.name === 'Toast' && (
          <div className="flex flex-col gap-4">
            {idx === 0 && (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => toast('默认通知')}>
                  默认
                </Button>
                <Button type="button" color="success" onClick={() => toast.success('操作成功')}>
                  成功
                </Button>
                <Button type="button" color="error" onClick={() => toast.error('操作失败')}>
                  错误
                </Button>
                <Button type="button" color="warning" onClick={() => toast.warning('请注意')}>
                  警告
                </Button>
                <Button type="button" color="info" onClick={() => toast.info('提示信息')}>
                  信息
                </Button>
              </div>
            )}
            {idx === 1 && (
              <Button
                type="button"
                color="primary"
                onClick={() =>
                  toast('已保存', {
                    description: '更改将在下次同步时生效',
                    duration: 6000,
                  })
                }
              >
                带副标题（6 秒）
              </Button>
            )}
            {idx === 2 && (
              <Button
                type="button"
                onClick={() =>
                  toast.promise(
                    new Promise<string>((resolve) =>
                      setTimeout(() => resolve('ok'), 1600)
                    ),
                    {
                      loading: '处理中…',
                      success: '完成',
                      error: '失败',
                    }
                  )
                }
              >
                Promise 演示（约 1.6s）
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="component-page">
      <header className="page-header">
        <h1>{doc.title}</h1>
        <p>{doc.description}</p>
      </header>

      <div className="page-tabs">
        <button 
          className={activeExample === 0 ? 'active' : ''}
          onClick={() => setActiveExample(0)}
        >
          示例预览
        </button>
        <button 
          className={activeExample === 1 ? 'active' : ''}
          onClick={() => setActiveExample(1)}
        >
          AI 使用指南
        </button>
      </div>

      {activeExample === 0 ? (
        <div className="examples-section">
          {doc.examples.map((example, idx) => (
            <div key={idx} className="example-card">
              <h3>{example.title}</h3>
              {renderExample(example, idx)}
              <div className="code-block">
                <pre>{example.code}</pre>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ai-doc-section">
          <div className="info-box">
            <div className="info-box-heading">
              <IconDataNode size={18} className="info-box-heading-icon" aria-hidden />
              <strong>AI 使用提示</strong>
            </div>
            <p>
              此文档位于 <code>{doc.aiDocPath}</code>，
              AI 编码助手可以读取此文件来理解组件用法。
            </p>
          </div>
          <div className="ai-doc-content">
            {renderMarkdown(aiDoc)}
          </div>
        </div>
      )}
    </div>
  );
};
