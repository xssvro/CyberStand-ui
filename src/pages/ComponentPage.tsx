import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { componentDocs, type Example } from '../docs/components';
import { Alert, type AlertVariant } from '../components/Alert';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Callout } from '../components/Callout';
import { Empty } from '../components/Empty';
import { FormField, Label } from '../components/FormField';
import { Checkbox, CheckboxGroup } from '../components/Checkbox';
import { DatePicker } from '../components/DatePicker';
import { DateRangePicker } from '../components/DateRangePicker';
import { TimePicker } from '../components/TimePicker';
import { DateTimePicker } from '../components/DateTimePicker';
import { Input } from '../components/Input';
import { Radio, RadioGroup } from '../components/Radio';
import { Select } from '../components/Select';
import { Textarea } from '../components/Textarea';
import { Spinner } from '../components/Spinner';
import { Switch } from '../components/Switch';
import { Tag } from '../components/Tag';
import { Form } from '../components/Form';
import { FormSection } from '../components/FormSection';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { Modal } from '../components/Modal';
import { Drawer } from '../components/Drawer';
import { Progress } from '../components/Progress';
import { Result } from '../components/Result';
import { Skeleton } from '../components/Skeleton';
import { toast } from '../components/Toast';
import { Tooltip } from '../components/Tooltip';
import { Popover } from '../components/Popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/Tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '../components/Breadcrumb';
import {
  DropdownMenu,
  DropdownMenuDivider,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '../components/DropdownMenu';
import { Typography, TypographyLink } from '../components/Typography';
import { Divider, Separator } from '../components/Divider';
import { AspectRatio } from '../components/AspectRatio';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/Table';
import { Pagination } from '../components/Pagination';
import { Flex, Grid, Space, Stack } from '../components/Layout';
import { IconDataNode, IconPackage, IconSearch } from '../icons';

// 导入 AI 文档内容
import AlertAiMd from '../components/Alert/Alert.ai.md?raw';
import BadgeAiMd from '../components/Badge/Badge.ai.md?raw';
import ButtonAiMd from '../components/Button/Button.ai.md?raw';
import InputAiMd from '../components/Input/Input.ai.md?raw';
import DatePickerAiMd from '../components/DatePicker/DatePicker.ai.md?raw';
import DateRangePickerAiMd from '../components/DateRangePicker/DateRangePicker.ai.md?raw';
import FormFieldAiMd from '../components/FormField/FormField.ai.md?raw';
import CalloutAiMd from '../components/Callout/Callout.ai.md?raw';
import EmptyAiMd from '../components/Empty/Empty.ai.md?raw';
import ResultAiMd from '../components/Result/Result.ai.md?raw';
import CardAiMd from '../components/Card/Card.ai.md?raw';
import ToastAiMd from '../components/Toast/Toast.ai.md?raw';
import TooltipAiMd from '../components/Tooltip/Tooltip.ai.md?raw';
import PopoverAiMd from '../components/Popover/Popover.ai.md?raw';
import TimePickerAiMd from '../components/TimePicker/TimePicker.ai.md?raw';
import DateTimePickerAiMd from '../components/DateTimePicker/DateTimePicker.ai.md?raw';
import TabsAiMd from '../components/Tabs/Tabs.ai.md?raw';
import BreadcrumbAiMd from '../components/Breadcrumb/Breadcrumb.ai.md?raw';
import DropdownMenuAiMd from '../components/DropdownMenu/DropdownMenu.ai.md?raw';
import TypographyAiMd from '../components/Typography/Typography.ai.md?raw';
import DividerAiMd from '../components/Divider/Divider.ai.md?raw';
import LayoutAiMd from '../components/Layout/Layout.ai.md?raw';
import AspectRatioAiMd from '../components/AspectRatio/AspectRatio.ai.md?raw';
import TableAiMd from '../components/Table/Table.ai.md?raw';
import PaginationAiMd from '../components/Pagination/Pagination.ai.md?raw';
import TextareaAiMd from '../components/Textarea/Textarea.ai.md?raw';
import SelectAiMd from '../components/Select/Select.ai.md?raw';
import SpinnerAiMd from '../components/Spinner/Spinner.ai.md?raw';
import CheckboxAiMd from '../components/Checkbox/Checkbox.ai.md?raw';
import RadioAiMd from '../components/Radio/Radio.ai.md?raw';
import SwitchAiMd from '../components/Switch/Switch.ai.md?raw';
import TagAiMd from '../components/Tag/Tag.ai.md?raw';
import FormSectionAiMd from '../components/FormSection/FormSection.ai.md?raw';
import FormAiMd from '../components/Form/Form.ai.md?raw';
import LoadingAiMd from '../components/Loading/Loading.ai.md?raw';
import ModalAiMd from '../components/Modal/Modal.ai.md?raw';
import DrawerAiMd from '../components/Drawer/Drawer.ai.md?raw';
import ProgressAiMd from '../components/Progress/Progress.ai.md?raw';
import SkeletonAiMd from '../components/Skeleton/Skeleton.ai.md?raw';

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

/** Loading 全屏示例：自动关闭，避免挡住文档站 */
function LoadingFullscreenDemo() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!visible) return undefined;
    const id = window.setTimeout(() => setVisible(false), 2200);
    return () => window.clearTimeout(id);
  }, [visible]);
  return (
    <Stack gap="sm" className="max-w-md w-full">
      <Typography variant="bodySmall" color="muted" noMargin>
        全屏层 z-index 为 <code>--su-z-loading</code>，低于 Toast。
      </Typography>
      <Button type="button" color="primary" onClick={() => setVisible(true)}>
        演示全屏加载约 2 秒
      </Button>
      {visible ? <Loading fullscreen tip="请稍候…" /> : null}
    </Stack>
  );
}

const ALERT_DEMO_BY_VARIANT: Record<AlertVariant, { title: string; children: string }> = {
  info: { title: '提示', children: '配置已缓存，刷新页面后生效。' },
  success: { title: '完成', children: '已成功保存草稿。' },
  warning: { title: '注意', children: '免费额度将在 3 天后重置。' },
  error: { title: '错误', children: '无法连接服务器，请稍后重试。' },
};

/** Alert 四种语义：点击按钮后再展示（与 Toast 演示一致，贴近真实「事件后出提示」） */
function AlertDemoFourKinds() {
  const [kind, setKind] = useState<AlertVariant | null>(null);
  return (
    <Stack gap="md" className="max-w-lg w-full">
      <Typography variant="caption" color="muted" noMargin>
        点击下方按钮触发对应语义的 Alert。
      </Typography>
      <Space wrap size="sm">
        <Button type="button" size="sm" variant={kind === 'info' ? 'solid' : 'soft'} color="info" onClick={() => setKind('info')}>
          信息
        </Button>
        <Button type="button" size="sm" variant={kind === 'success' ? 'solid' : 'soft'} color="success" onClick={() => setKind('success')}>
          成功
        </Button>
        <Button type="button" size="sm" variant={kind === 'warning' ? 'solid' : 'soft'} color="warning" onClick={() => setKind('warning')}>
          警告
        </Button>
        <Button type="button" size="sm" variant={kind === 'error' ? 'solid' : 'soft'} color="error" onClick={() => setKind('error')}>
          错误
        </Button>
      </Space>
      {kind ? (
        <Alert variant={kind} title={ALERT_DEMO_BY_VARIANT[kind].title} className="w-full">
          {ALERT_DEMO_BY_VARIANT[kind].children}
        </Alert>
      ) : null}
    </Stack>
  );
}

/** 先点击展示，关闭后需再次点击 */
function AlertDemoClosable() {
  const [visible, setVisible] = useState(false);
  return (
    <Stack gap="sm" className="max-w-lg w-full">
      {!visible ? (
        <Button type="button" size="sm" variant="soft" onClick={() => setVisible(true)}>
          显示可关闭提示
        </Button>
      ) : (
        <Alert
          variant="info"
          closable
          onClose={() => setVisible(false)}
          title="可关闭"
          className="w-full"
        >
          点击右侧 × 关闭；关闭后可再次点击「显示可关闭提示」重新展示。
        </Alert>
      )}
    </Stack>
  );
}

function AlertDemoBanner() {
  const [show, setShow] = useState(false);
  return (
    <Stack gap="sm" className="max-w-lg w-full">
      <Button type="button" size="sm" variant="soft" onClick={() => setShow(true)}>
        显示通栏错误（role=&quot;alert&quot;）
      </Button>
      {show ? (
        <div className="w-full overflow-hidden rounded-md border border-[var(--su-border-subtle)]">
          <Alert variant="error" role="alert" banner title="提交失败">
            请修正标红字段后再试。（仅关键错误使用 alert）
          </Alert>
        </div>
      ) : null}
    </Stack>
  );
}

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
    case 4:
      return (
        <div className="max-w-md w-full">
          <Select
            searchable
            searchPlaceholder="输入城市名筛选"
            placeholder="选择城市"
            options={[
              { value: 'bj', label: '北京' },
              { value: 'sh', label: '上海' },
              { value: 'gz', label: '广州' },
              { value: 'sz', label: '深圳' },
              { value: 'hz', label: '杭州' },
            ]}
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

function DatePickerBasicDemo() {
  const [d, setD] = useState('');
  return (
    <DatePicker
      className="max-w-md w-full"
      value={d}
      onChange={(v) => setD(v)}
      placeholder="选择日期"
    />
  );
}

function DatePickerDocDemo({ idx }: { idx: number }) {
  switch (idx) {
    case 0:
      return <DatePickerBasicDemo />;
    case 1:
      return (
        <Stack gap="md" className="max-w-md w-full">
          <DatePicker min="2026-01-01" max="2026-12-31" placeholder="2026 年内" />
          <DatePicker size="sm" color="primary" placeholder="小号主色环" />
        </Stack>
      );
    case 2:
      return (
        <FormField label="截止日期" required className="max-w-md w-full">
          <DatePicker name="due" placeholder="请选择" />
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

function DateRangePickerDocDemo({ idx }: { idx: number }) {
  const [r, setR] = useState({ start: '', end: '' });
  switch (idx) {
    case 0:
      return (
        <DateRangePicker
          className="max-w-md w-full"
          value={r}
          onChange={(v) => setR(v)}
        />
      );
    case 1:
      return (
        <DateRangePicker
          min="2026-01-01"
          max="2026-12-31"
          startName="from"
          endName="to"
          className="max-w-md w-full"
        />
      );
    default:
      return (
        <Typography variant="body" color="muted">
          无该示例索引
        </Typography>
      );
  }
}

function TimePickerDocDemo({ idx }: { idx: number }) {
  const [t, setT] = useState('');
  switch (idx) {
    case 0:
      return (
        <TimePicker value={t} onChange={(v) => setT(v)} placeholder="选择时间" className="max-w-xs w-full" />
      );
    case 1:
      return <TimePicker minuteStep={15} placeholder="整刻钟" className="max-w-xs w-full" />;
    default:
      return (
        <Typography variant="body" color="muted">
          无该示例索引
        </Typography>
      );
  }
}

function DateTimePickerDocDemo({ idx }: { idx: number }) {
  const [v, setV] = useState('');
  switch (idx) {
    case 0:
      return (
        <DateTimePicker value={v} onChange={(x) => setV(x)} className="max-w-md w-full" />
      );
    case 1:
      return (
        <DateTimePicker min="2026-01-01" max="2026-12-31" className="max-w-md w-full" />
      );
    default:
      return (
        <Typography variant="body" color="muted">
          无该示例索引
        </Typography>
      );
  }
}

function TabsDocDemo({ idx }: { idx: number }) {
  const [tab, setTab] = useState('a');
  switch (idx) {
    case 0:
      return (
        <Tabs value={tab} onValueChange={setTab} className="max-w-lg w-full">
          <TabsList>
            <TabsTrigger value="a">概览</TabsTrigger>
            <TabsTrigger value="b">设置</TabsTrigger>
          </TabsList>
          <TabsContent value="a">
            <Typography variant="bodySmall" noMargin>
              面板 A
            </Typography>
          </TabsContent>
          <TabsContent value="b">
            <Typography variant="bodySmall" noMargin>
              面板 B
            </Typography>
          </TabsContent>
        </Tabs>
      );
    case 1:
      return (
        <Tabs defaultValue="1" variant="line" className="max-w-lg w-full">
          <TabsList>
            <TabsTrigger value="1">第一项</TabsTrigger>
            <TabsTrigger value="2">第二项</TabsTrigger>
          </TabsList>
          <TabsContent value="1">
            <Typography variant="bodySmall" noMargin>
              内容 1
            </Typography>
          </TabsContent>
          <TabsContent value="2">
            <Typography variant="bodySmall" noMargin>
              内容 2
            </Typography>
          </TabsContent>
        </Tabs>
      );
    default:
      return (
        <Typography variant="body" color="muted">
          无该示例索引
        </Typography>
      );
  }
}

function BreadcrumbDocDemo({ idx }: { idx: number }) {
  switch (idx) {
    case 0:
      return (
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">首页</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">项目</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>详情</BreadcrumbItem>
        </Breadcrumb>
      );
    case 1:
      return (
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">文档</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>›</BreadcrumbSeparator>
          <BreadcrumbItem current>本页</BreadcrumbItem>
        </Breadcrumb>
      );
    default:
      return (
        <Typography variant="body" color="muted">
          无该示例索引
        </Typography>
      );
  }
}

function DropdownMenuDocDemo({ idx }: { idx: number }) {
  const [open, setOpen] = useState(false);
  switch (idx) {
    case 0:
      return (
        <div className="example-preview-inner">
          <DropdownMenu
            open={open}
            onOpenChange={setOpen}
            trigger={
              <Button size="sm" type="button" variant="soft">
                操作
              </Button>
            }
          >
            <DropdownMenuLabel>文档</DropdownMenuLabel>
            <DropdownMenuItem type="button">编辑</DropdownMenuItem>
            <DropdownMenuItem type="button">复制</DropdownMenuItem>
            <DropdownMenuDivider />
            <DropdownMenuItem type="button" destructive>
              删除
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      );
    case 1:
      return (
        <div className="example-preview-inner">
          <DropdownMenu
            trigger={
              <Button size="sm" type="button">
                打开
              </Button>
            }
          >
            <DropdownMenuItem type="button">项 1</DropdownMenuItem>
            <DropdownMenuItem type="button" disabled>
              禁用
            </DropdownMenuItem>
          </DropdownMenu>
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

function ModalDocDemo({ idx }: { idx: number }) {
  const [open, setOpen] = useState(false);
  const [openSm, setOpenSm] = useState(false);
  const [openWide, setOpenWide] = useState(false);
  const [openTop, setOpenTop] = useState(false);
  const [openNoMask, setOpenNoMask] = useState(false);

  switch (idx) {
    case 0:
      return (
        <div className="example-preview-inner">
          <Button type="button" onClick={() => setOpen(true)}>
            打开对话框
          </Button>
          <Modal
            open={open}
            onOpenChange={setOpen}
            title="确认操作"
            footer={
              <>
                <Button variant="ghost" size="sm" type="button" onClick={() => setOpen(false)}>
                  取消
                </Button>
                <Button color="primary" size="sm" type="button" onClick={() => setOpen(false)}>
                  确定
                </Button>
              </>
            }
          >
            <Typography variant="body" noMargin>
              确定要执行该操作吗？
            </Typography>
          </Modal>
        </div>
      );
    case 1:
      return (
        <Stack gap="sm" className="max-w-md w-full">
          <Button type="button" size="sm" variant="soft" onClick={() => setOpenSm(true)}>
            小号 Modal
          </Button>
          <Modal open={openSm} onOpenChange={setOpenSm} title="小号" size="sm">
            <Typography variant="bodySmall" color="muted" noMargin>
              size=&quot;sm&quot; 最大宽度约 400px。
            </Typography>
          </Modal>
          <Button type="button" size="sm" variant="soft" onClick={() => setOpenWide(true)}>
            宽度 640px
          </Button>
          <Modal open={openWide} onOpenChange={setOpenWide} title="自定义宽度" width={640}>
            <Typography variant="bodySmall" color="muted" noMargin>
              width=&#123;640&#125;
            </Typography>
          </Modal>
        </Stack>
      );
    case 2:
      return (
        <div className="example-preview-inner">
          <Button type="button" variant="soft" onClick={() => setOpenTop(true)}>
            靠上 + 禁止点遮罩关闭
          </Button>
          <Modal
            open={openTop}
            onOpenChange={setOpenTop}
            title="靠上"
            centered={false}
            maskClosable={false}
          >
            <Typography variant="body" noMargin>
              仅关闭钮或 Esc 可关。
            </Typography>
          </Modal>
        </div>
      );
    case 3:
      return (
        <div className="example-preview-inner">
          <Button type="button" variant="soft" onClick={() => setOpenNoMask(true)}>
            非遮罩模式
          </Button>
          <Modal
            open={openNoMask}
            onOpenChange={setOpenNoMask}
            title="无遮罩"
            mask={false}
            footer={
              <Button size="sm" type="button" onClick={() => setOpenNoMask(false)}>
                知道了
              </Button>
            }
          >
            <Typography variant="bodySmall" color="muted" noMargin>
              无半透明与模糊；仍锁定背后滚动。点面板外空白可关闭。
            </Typography>
          </Modal>
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

function DrawerDocDemo({ idx }: { idx: number }) {
  const [open, setOpen] = useState(false);
  const [openLeft, setOpenLeft] = useState(false);
  const [openTop, setOpenTop] = useState(false);
  const [openNoMask, setOpenNoMask] = useState(false);

  switch (idx) {
    case 0:
      return (
        <div className="example-preview-inner">
          <Button type="button" onClick={() => setOpen(true)}>
            打开抽屉
          </Button>
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
            <Typography variant="bodySmall" color="muted" noMargin>
              抽屉正文，可滚动。
            </Typography>
          </Drawer>
        </div>
      );
    case 1:
      return (
        <Stack gap="sm" className="max-w-md w-full">
          <Button type="button" size="sm" variant="soft" onClick={() => setOpenLeft(true)}>
            左侧 width=320
          </Button>
          <Drawer
            open={openLeft}
            onOpenChange={setOpenLeft}
            title="左侧"
            placement="left"
            width={320}
          >
            <Typography variant="bodySmall" color="muted" noMargin>
              placement=&quot;left&quot;
            </Typography>
          </Drawer>
          <Button type="button" size="sm" variant="soft" onClick={() => setOpenTop(true)}>
            顶部抽屉
          </Button>
          <Drawer
            open={openTop}
            onOpenChange={setOpenTop}
            title="顶部"
            placement="top"
            height="min(36vh, 280px)"
          >
            <Typography variant="bodySmall" color="muted" noMargin>
              placement=&quot;top&quot;
            </Typography>
          </Drawer>
        </Stack>
      );
    case 2:
      return (
        <div className="example-preview-inner">
          <Button type="button" variant="soft" onClick={() => setOpenNoMask(true)}>
            非遮罩模式
          </Button>
          <Drawer open={openNoMask} onOpenChange={setOpenNoMask} title="无遮罩" mask={false}>
            <Typography variant="bodySmall" color="muted" noMargin>
              无暗色底，仍锁定背后滚动；点外侧空白可关闭。
            </Typography>
          </Drawer>
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

function TooltipDocDemo({ idx }: { idx: number }) {
  switch (idx) {
    case 0:
      return (
        <div className="example-preview-inner">
          <Tooltip title="提交当前表单">
            <Button size="sm" color="primary" type="button">
              提交
            </Button>
          </Tooltip>
        </div>
      );
    case 1:
      return (
        <Space wrap size="sm">
          <Tooltip title="上方" placement="top">
            <Button size="sm" variant="soft" type="button">
              top
            </Button>
          </Tooltip>
          <Tooltip title="下方" placement="bottom">
            <Button size="sm" variant="soft" type="button">
              bottom
            </Button>
          </Tooltip>
          <Tooltip title="左侧" placement="left">
            <Button size="sm" variant="soft" type="button">
              left
            </Button>
          </Tooltip>
          <Tooltip title="右侧" placement="right">
            <Button size="sm" variant="soft" type="button">
              right
            </Button>
          </Tooltip>
        </Space>
      );
    case 2:
      return (
        <div className="example-preview-inner">
          <Tooltip title="暂无权限">
            <span style={{ display: 'inline-flex' }}>
              <Button size="sm" disabled style={{ pointerEvents: 'none' }} type="button">
                不可用
              </Button>
            </span>
          </Tooltip>
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

function PopoverDocDemo({ idx }: { idx: number }) {
  const [open, setOpen] = useState(false);
  const [openR, setOpenR] = useState(false);

  switch (idx) {
    case 0:
      return (
        <div className="example-preview-inner">
          <Popover
            open={open}
            onOpenChange={setOpen}
            content={
              <Stack gap="sm">
                <Typography variant="bodySmall" noMargin>
                  可放简短说明或操作
                </Typography>
                <Button size="sm" type="button" onClick={() => setOpen(false)}>
                  关闭
                </Button>
              </Stack>
            }
          >
            <Button type="button" variant="soft" size="sm">
              打开 Popover
            </Button>
          </Popover>
        </div>
      );
    case 1:
      return (
        <div className="example-preview-inner">
          <Popover
            open={openR}
            onOpenChange={setOpenR}
            placement="right"
            content={<Typography variant="bodySmall" noMargin>在右侧</Typography>}
          >
            <Button size="sm" type="button" variant="soft">
              锚点
            </Button>
          </Popover>
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
  const [fieldErrors, setFieldErrors] = useState<{ name?: string }>({});

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
        </Form>
      );
    case 3:
      return (
        <Form disabled className="max-w-md w-full">
          <FormField label="只读项">
            <Input name="ro" defaultValue="不可编辑" />
          </FormField>
        </Form>
      );
    case 4:
      return (
        <Form
          className="max-w-xl w-full"
          onSubmit={(e) => {
            e.preventDefault();
            toast('已拦截提交（演示）');
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
        </Form>
      );
    case 5:
      return (
        <Form
          className="max-w-md w-full"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const name = String(fd.get('name') ?? '').trim();
            if (!name) {
              setFieldErrors({ name: '请填写名称' });
              toast.error('校验未通过');
              return;
            }
            setFieldErrors({});
            toast('校验通过（演示）');
          }}
        >
          <FormField label="名称" required error={fieldErrors.name}>
            <Input
              name="name"
              placeholder="留空点提交可看到下方错误"
              onChange={() => setFieldErrors((prev) => ({ ...prev, name: undefined }))}
            />
          </FormField>
          <Stack direction="row" gap="sm" justify="end">
            <Button type="submit" color="primary" size="sm">
              提交
            </Button>
          </Stack>
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

function TableDocDemo({ idx }: { idx: number }) {
  switch (idx) {
    case 0:
      return (
        <div className="max-w-2xl w-full">
          <Table bordered shadow="sm">
            <TableCaption>最近同步任务</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">名称</TableHead>
                <TableHead scope="col">状态</TableHead>
                <TableHead scope="col">更新时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>订单同步</TableCell>
                <TableCell>进行中</TableCell>
                <TableCell>2026-04-06 10:00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>库存快照</TableCell>
                <TableCell>成功</TableCell>
                <TableCell>2026-04-06 09:30</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    case 1:
      return (
        <div className="max-w-2xl w-full">
          <Table bordered striped hoverable>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">项目</TableHead>
                <TableHead scope="col">负责人</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>官网改版</TableCell>
                <TableCell>张三</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>数据看板</TableCell>
                <TableCell>李四</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>支付对接</TableCell>
                <TableCell>王五</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    case 2:
      return (
        <div className="max-w-xl w-full">
          <Table size="sm" layout="fixed" bordered className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead scope="col">商品</TableHead>
                <TableHead scope="col" align="end" numeric>
                  单价
                </TableHead>
                <TableHead scope="col" align="end" numeric>
                  库存
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>节点 A</TableCell>
                <TableCell align="end" numeric>
                  199.00
                </TableCell>
                <TableCell align="end" numeric>
                  42
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>节点 B</TableCell>
                <TableCell align="end" numeric>
                  2,880.50
                </TableCell>
                <TableCell align="end" numeric>
                  7
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    case 3:
      return (
        <div className="max-w-lg w-full">
          <Table bordered>
            <TableHeader>
              <TableRow>
                <TableHead scope="col" colSpan={2}>
                  合并表头
                </TableHead>
                <TableHead scope="col">备注</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell as="th" scope="row">
                  华东
                </TableCell>
                <TableCell>上海</TableCell>
                <TableCell rowSpan={2}>
                  重点大区
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell as="th" scope="row">
                  华东
                </TableCell>
                <TableCell>杭州</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    case 4:
      return (
        <div className="max-w-lg w-full">
          <Card title="订单列表" subtitle="分页可单独使用 Pagination + 数据 slice">
            <Table bordered striped hoverable shadow="sm">
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">单号</TableHead>
                  <TableHead scope="col" align="end" numeric>
                    金额
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>ORD-1001</TableCell>
                  <TableCell align="end" numeric>
                    99.00
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ORD-1002</TableCell>
                  <TableCell align="end" numeric>
                    1,280.00
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} style={{ fontSize: '0.8125rem', color: 'var(--su-text-muted)' }}>
                    本页小计示例；完整分页见 Pagination 组件
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Card>
        </div>
      );
    case 5:
      return (
        <Stack gap="xl" className="max-w-2xl w-full">
          <Stack gap="sm">
            <Typography variant="caption" color="muted" noMargin>
              loading（遮罩 + Spinner，拦截点击）
            </Typography>
            <Table bordered shadow="sm" loading>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">列 A</TableHead>
                  <TableHead scope="col">列 B</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>占位</TableCell>
                  <TableCell>数据</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Stack>
          <Stack gap="sm">
            <Typography variant="caption" color="muted" noMargin>
              空数据：TableEmpty
            </Typography>
            <Table bordered shadow="sm">
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">名称</TableHead>
                  <TableHead scope="col">状态</TableHead>
                  <TableHead scope="col">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableEmpty colSpan={3} description="暂无记录，试试调整筛选条件" />
              </TableBody>
            </Table>
          </Stack>
        </Stack>
      );
    default:
      return (
        <Typography variant="body" color="muted">
          无该示例索引
        </Typography>
      );
  }
}

const PAGINATION_DEMO_ROWS = Array.from({ length: 23 }, (_, i) => ({
  id: `ORD-${1001 + i}`,
  amt: (99 + i * 17).toFixed(2),
}));

function PaginationDocDemo({ idx }: { idx: number }) {
  const [page, setPage] = useState(1);
  const [pageCtl, setPageCtl] = useState(2);
  const [pageSizeCtl, setPageSizeCtl] = useState(20);

  const sliced = useMemo(
    () => PAGINATION_DEMO_ROWS.slice((page - 1) * 5, page * 5),
    [page],
  );

  switch (idx) {
    case 0:
      return (
        <div className="max-w-3xl w-full">
          <Pagination
            current={page}
            pageSize={10}
            total={127}
            onChange={(p) => setPage(p)}
            showTotal={(range, t) => `第 ${range[0]}-${range[1]} 条，共 ${t} 条`}
          />
        </div>
      );
    case 1:
      return (
        <div className="max-w-3xl w-full">
          <Pagination
            current={pageCtl}
            pageSize={pageSizeCtl}
            total={256}
            onChange={(p, ps) => {
              setPageCtl(p);
              setPageSizeCtl(ps);
            }}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={[10, 20, 50]}
            showTotal={(_, t) => `共 ${t} 条`}
          />
        </div>
      );
    case 2:
      return (
        <Stack gap="lg" className="max-w-xl w-full">
          <Pagination simple total={89} pageSize={10} defaultCurrent={3} />
          <Typography variant="caption" color="muted" noMargin>
            hideOnSinglePage（共 8 条、每页 10 条，整组件不渲染）
          </Typography>
          <div className="min-h-[40px] flex items-center text-sm text-[var(--su-text-muted)]">
            <Pagination total={8} pageSize={10} hideOnSinglePage />
            此处无分页条
          </div>
        </Stack>
      );
    case 3:
      return (
        <Stack gap="md" className="w-full max-w-2xl">
          <Table bordered shadow="sm">
            <TableHeader>
              <TableRow>
                <TableHead scope="col">单号</TableHead>
                <TableHead scope="col" align="end" numeric>
                  金额
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sliced.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell align="end" numeric>
                    {row.amt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            align="end"
            current={page}
            pageSize={5}
            total={PAGINATION_DEMO_ROWS.length}
            onChange={(p) => setPage(p)}
            showTotal={(r, t) => `第 ${r[0]}-${r[1]} 条，共 ${t} 条`}
          />
        </Stack>
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
  Badge,
  Input,
  DatePicker,
  DateRangePicker,
  FormField,
  Card,
  Toast: ToastDocPlaceholder,
  Modal,
  Drawer,
  Tooltip,
  Popover,
  TimePicker,
  DateTimePicker,
  Tabs,
  Breadcrumb,
  DropdownMenu,
  Typography,
  Divider,
  AspectRatio,
  Table,
  Pagination,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Form,
  FormSection,
  Tag,
  Spinner,
  Loading,
  Progress,
  Skeleton,
  Alert,
  Callout,
  Empty,
  Result,
  Layout: LayoutDocPlaceholder,
};

// AI 文档映射
const aiDocMap: Record<string, string> = {
  Button: ButtonAiMd,
  Badge: BadgeAiMd,
  Input: InputAiMd,
  DatePicker: DatePickerAiMd,
  DateRangePicker: DateRangePickerAiMd,
  FormField: FormFieldAiMd,
  Card: CardAiMd,
  Toast: ToastAiMd,
  Modal: ModalAiMd,
  Drawer: DrawerAiMd,
  Tooltip: TooltipAiMd,
  Popover: PopoverAiMd,
  TimePicker: TimePickerAiMd,
  DateTimePicker: DateTimePickerAiMd,
  Tabs: TabsAiMd,
  Breadcrumb: BreadcrumbAiMd,
  DropdownMenu: DropdownMenuAiMd,
  Typography: TypographyAiMd,
  Divider: DividerAiMd,
  AspectRatio: AspectRatioAiMd,
  Table: TableAiMd,
  Pagination: PaginationAiMd,
  Textarea: TextareaAiMd,
  Select: SelectAiMd,
  Checkbox: CheckboxAiMd,
  Radio: RadioAiMd,
  Switch: SwitchAiMd,
  FormSection: FormSectionAiMd,
  Form: FormAiMd,
  Tag: TagAiMd,
  Spinner: SpinnerAiMd,
  Loading: LoadingAiMd,
  Progress: ProgressAiMd,
  Skeleton: SkeletonAiMd,
  Alert: AlertAiMd,
  Callout: CalloutAiMd,
  Empty: EmptyAiMd,
  Result: ResultAiMd,
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

  const doc = useMemo(
    () => (name ? componentDocs.find((d) => d.name.toLowerCase() === name.toLowerCase()) : undefined),
    [name],
  );
  const mapKey = doc?.name ?? '';
  const Component = mapKey ? componentMap[mapKey] : null;
  const aiDoc = mapKey ? aiDocMap[mapKey] || '' : '';

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
          <div className="example-preview-inner max-w-md w-full">
            {idx === 0 && <Input placeholder="请输入内容" />}
            {idx === 1 && (
              <Stack gap="md">
                <Input prefix={<IconSearch size={16} />} placeholder="搜索..." />
                <Input suffix="@" placeholder="邮箱" />
              </Stack>
            )}
            {idx === 2 && (
              <Stack gap="md">
                <Input size="sm" placeholder="小尺寸" />
                <Input size="md" placeholder="中尺寸" />
                <Input size="lg" placeholder="大尺寸" />
              </Stack>
            )}
            {idx === 3 && (
              <Stack gap="md">
                <Input type="password" placeholder="密码" />
                <Input type="email" placeholder="邮箱" />
                <Input type="number" placeholder="数字" />
              </Stack>
            )}
            {idx === 4 && (
              <Stack gap="md" className="w-full">
                <Input type="date" name="demo-day" />
                <Input type="datetime-local" name="demo-at" />
                <Input type="date" min="2026-01-01" max="2026-12-31" name="demo-range" />
              </Stack>
            )}
          </div>
        )}
        {doc.name === 'FormField' && renderFormFieldExamples(example, idx)}
        {doc.name === 'Textarea' && <TextareaDocDemo idx={idx} />}
        {doc.name === 'Select' && <SelectDocDemo idx={idx} />}
        {doc.name === 'DatePicker' && <DatePickerDocDemo idx={idx} />}
        {doc.name === 'DateRangePicker' && <DateRangePickerDocDemo idx={idx} />}
        {doc.name === 'TimePicker' && <TimePickerDocDemo idx={idx} />}
        {doc.name === 'DateTimePicker' && <DateTimePickerDocDemo idx={idx} />}
        {doc.name === 'Tabs' && <TabsDocDemo idx={idx} />}
        {doc.name === 'Breadcrumb' && <BreadcrumbDocDemo idx={idx} />}
        {doc.name === 'DropdownMenu' && <DropdownMenuDocDemo idx={idx} />}
        {doc.name === 'Modal' && <ModalDocDemo idx={idx} />}
        {doc.name === 'Drawer' && <DrawerDocDemo idx={idx} />}
        {doc.name === 'Tooltip' && <TooltipDocDemo idx={idx} />}
        {doc.name === 'Popover' && <PopoverDocDemo idx={idx} />}
        {doc.name === 'Checkbox' && <CheckboxDocDemo idx={idx} />}
        {doc.name === 'Radio' && <RadioDocDemo idx={idx} />}
        {doc.name === 'Switch' && <SwitchDocDemo idx={idx} />}
        {doc.name === 'Form' && <FormDocDemo key={idx} idx={idx} />}
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
        {doc.name === 'Table' && <TableDocDemo idx={idx} />}
        {doc.name === 'Pagination' && <PaginationDocDemo key={idx} idx={idx} />}
        {doc.name === 'Layout' && renderLayoutExamples(example, idx)}
        {doc.name === 'Badge' && (
          <div className="example-preview-inner flex flex-col gap-4 max-w-xl">
            {idx === 0 && (
              <div className="flex flex-wrap gap-4 items-center">
                <Badge count={5}>
                  <Button size="sm" variant="ghost" aria-label="通知">
                    铃
                  </Button>
                </Badge>
                <Badge count={0} showZero>
                  <Button size="sm" variant="ghost" aria-label="草稿">
                    稿
                  </Button>
                </Badge>
              </div>
            )}
            {idx === 1 && (
              <div className="flex flex-wrap gap-4 items-center">
                <Badge dot color="error">
                  <span>任务</span>
                </Badge>
                <Badge count={120} max={99} aria-label="未读 99+" />
              </div>
            )}
            {idx === 2 && (
              <Stack direction="row" gap="sm" className="flex-wrap items-center">
                <Badge count={2} color="primary">
                  <Button size="sm" variant="ghost">
                    主色
                  </Button>
                </Badge>
                <Badge count={3} color="success">
                  <Button size="sm" variant="ghost">
                    成功
                  </Button>
                </Badge>
                <Badge dot color="warning">
                  <Button size="sm" variant="ghost">
                    警告点
                  </Button>
                </Badge>
              </Stack>
            )}
          </div>
        )}
        {doc.name === 'Tag' && (
          <div className="example-preview-inner flex flex-col gap-4 max-w-xl">
            {idx === 0 && (
              <Space wrap size="sm">
                <Tag>soft 默认</Tag>
                <Tag variant="solid" color="primary">
                  solid
                </Tag>
                <Tag variant="outlined" color="info">
                  outlined
                </Tag>
              </Space>
            )}
            {idx === 1 && (
              <Tag closable onClose={() => undefined}>
                筛选：已发布
              </Tag>
            )}
            {idx === 2 && (
              <Space wrap size="sm" align="center">
                <Typography variant="caption" color="muted" noMargin>
                  已选
                </Typography>
                <Tag closable color="primary">
                  类型 A
                </Tag>
                <Tag closable>标签 B</Tag>
              </Space>
            )}
          </div>
        )}
        {doc.name === 'Spinner' && (
          <div className="example-preview-inner flex flex-col gap-4">
            {idx === 0 && (
              <Space wrap size="md" align="center">
                <Spinner size="xs" />
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </Space>
            )}
            {idx === 1 && (
              <Space wrap size="md" align="center">
                <Spinner color="primary" />
                <Spinner color="success" />
                <Spinner color="warning" />
                <Spinner color="error" />
              </Space>
            )}
            {idx === 2 && (
              <Typography variant="h4" className="flex items-center gap-2">
                <Spinner size="inherit" color="current" aria-hidden />
                加载标题旁
              </Typography>
            )}
          </div>
        )}
        {doc.name === 'Loading' && (
          <div className="example-preview-inner flex flex-col gap-4 max-w-xl w-full">
            {idx === 0 && (
              <Loading spinning tip="正在同步…">
                <Card title="列表示意" className="min-h-[100px] w-full max-w-md">
                  <Typography variant="bodySmall" color="muted" noMargin>
                    遮罩盖在卡片上方
                  </Typography>
                </Card>
              </Loading>
            )}
            {idx === 1 && (
              <div className="max-w-md w-full">
                <Loading spinning />
              </div>
            )}
            {idx === 2 && (
              <Loading spinning={false}>
                <Card className="max-w-md">spinning=false 时不显示遮罩</Card>
              </Loading>
            )}
            {idx === 3 && <LoadingFullscreenDemo />}
          </div>
        )}
        {doc.name === 'Progress' && (
          <div className="example-preview-inner flex flex-col gap-4 max-w-md w-full">
            {idx === 0 && (
              <Stack gap="md" className="w-full">
                <Progress value={0} />
                <Progress value={35} />
                <Progress value={100} color="success" />
              </Stack>
            )}
            {idx === 1 && (
              <Stack gap="md" className="w-full">
                <Progress value={48} size="sm" showLabel />
                <Progress value={64} size="md" showLabel color="info" />
                <Progress value={82} size="lg" showLabel color="warning" />
              </Stack>
            )}
            {idx === 2 && (
              <Stack gap="md" className="w-full">
                <Progress value={55} striped color="primary" />
                <Progress indeterminate aria-label="正在上传" />
              </Stack>
            )}
          </div>
        )}
        {doc.name === 'Skeleton' && (
          <div className="example-preview-inner flex flex-col gap-4 max-w-md w-full">
            {idx === 0 && (
              <Stack gap="md" className="w-full">
                <Skeleton variant="text" />
                <Skeleton variant="text" rows={3} />
              </Stack>
            )}
            {idx === 1 && (
              <Flex gap="md" align="start" className="w-full">
                <Skeleton variant="circle" width={44} height={44} />
                <Stack gap="sm" className="min-w-0 flex-1">
                  <Skeleton variant="text" width="55%" />
                  <Skeleton variant="text" rows={2} />
                </Stack>
              </Flex>
            )}
            {idx === 2 && (
              <Stack gap="md" className="w-full">
                <Skeleton variant="rect" height={96} rounded />
                <Skeleton variant="rect" height={40} active={false} />
              </Stack>
            )}
          </div>
        )}
        {doc.name === 'Alert' && (
          <div className="example-preview-inner flex flex-col gap-4 max-w-lg w-full">
            {idx === 0 && <AlertDemoFourKinds />}
            {idx === 1 && <AlertDemoClosable />}
            {idx === 2 && <AlertDemoBanner />}
          </div>
        )}
        {doc.name === 'Callout' && (
          <div className="example-preview-inner flex flex-col gap-4 max-w-lg w-full">
            {idx === 0 && (
              <Stack gap="sm" className="w-full">
                <Callout intent="default" title="说明">
                  中性补充，不参与表单校验反馈。
                </Callout>
                <Callout intent="info" title="提示">
                  该字段会展示在公开资料页。
                </Callout>
                <Callout intent="warning" title="注意">
                  删除后 30 天内可从回收站恢复。
                </Callout>
              </Stack>
            )}
            {idx === 1 && (
              <Callout intent="success" className="w-full">
                纯正文说明块，左侧仍为成功色强调条。
              </Callout>
            )}
            {idx === 2 && (
              <Stack gap="md" className="w-full">
                <Typography variant="body" noMargin>
                  下文为接口约定摘要。
                </Typography>
                <Callout intent="info" title="API">
                  <Typography variant="bodySmall" noMargin>
                    所有时间戳均为 UTC ISO-8601。
                  </Typography>
                </Callout>
              </Stack>
            )}
          </div>
        )}
        {doc.name === 'Empty' && (
          <div className="example-preview-inner flex flex-col gap-6 max-w-lg w-full">
            {idx === 0 && (
              <Card className="w-full">
                <Empty title="暂无数据" description="请调整筛选或稍后再试。">
                  <Button color="primary" size="sm">
                    新建
                  </Button>
                </Empty>
              </Card>
            )}
            {idx === 1 && (
              <Card className="w-full">
                <Empty
                  title="仓库为空"
                  description="导入依赖或从模板创建项目。"
                  image={<IconPackage size={72} />}
                >
                  <Button size="sm" variant="soft">
                    导入
                  </Button>
                </Empty>
              </Card>
            )}
            {idx === 2 && (
              <Card className="w-full">
                <Empty title="筛选结果为空" description="当前条件下没有匹配项。" image={null} />
              </Card>
            )}
          </div>
        )}
        {doc.name === 'Result' && (
          <div className="example-preview-inner flex flex-col gap-8 max-w-lg w-full">
            {idx === 0 && (
              <Card className="w-full">
                <Result
                  status="success"
                  title="提交成功"
                  subTitle="我们已收到申请，将在 1～3 个工作日内处理。"
                  extra={<Button color="primary" size="sm">返回首页</Button>}
                />
              </Card>
            )}
            {idx === 1 && (
              <Card className="w-full">
                <Result
                  status="error"
                  title="支付失败"
                  subTitle="银行返回超时，请重试或更换支付方式。"
                  extra={
                    <Stack direction="row" gap="sm">
                      <Button size="sm" variant="soft">
                        联系客服
                      </Button>
                      <Button size="sm" color="primary">
                        重新支付
                      </Button>
                    </Stack>
                  }
                />
              </Card>
            )}
            {idx === 2 && (
              <Card className="w-full">
                <Result
                  status="404"
                  title="页面不存在"
                  subTitle="链接可能已失效，或内容已被移除。"
                  extra={
                    <Button size="sm" variant="soft">
                      返回上一页
                    </Button>
                  }
                >
                  错误码 404 · 如需帮助请联系管理员
                </Result>
              </Card>
            )}
          </div>
        )}
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
