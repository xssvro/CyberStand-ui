import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { componentDocs, type Example } from '../docs/components';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { toast } from '../components/Toast';
import { Typography, TypographyLink } from '../components/Typography';
import { IconDataNode, IconSearch } from '../icons';

// 导入 AI 文档内容
import ButtonAiMd from '../components/Button/Button.ai.md?raw';
import InputAiMd from '../components/Input/Input.ai.md?raw';
import CardAiMd from '../components/Card/Card.ai.md?raw';
import ToastAiMd from '../components/Toast/Toast.ai.md?raw';
import TypographyAiMd from '../components/Typography/Typography.ai.md?raw';

/** Toast 为命令式 API，无预览组件，仅占位以通过文档路由校验 */
const ToastDocPlaceholder: React.FC = () => null;

// 动态导入组件
const componentMap: Record<string, React.ComponentType<any>> = {
  Button,
  Input,
  Card,
  Toast: ToastDocPlaceholder,
  Typography,
};

// AI 文档映射
const aiDocMap: Record<string, string> = {
  Button: ButtonAiMd,
  Input: InputAiMd,
  Card: CardAiMd,
  Toast: ToastAiMd,
  Typography: TypographyAiMd,
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
            <Input prefix={<IconSearch size={18} />} placeholder="搜索" />
            <Input type="password" placeholder="密码" />
          </div>
        )}
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
