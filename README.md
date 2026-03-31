# CyberStand UI

专为 AI 与多端开发优化的通用 UI 框架。

## 核心理念

CyberStand UI（本仓库）是一个**完全面向 AI** 的通用 UI 组件库：同一套设计理念与 token 可延伸到 Web、原生等多端。每个组件都配有详细的 `.ai.md` 文档，让 AI 编码助手能够快速准确地理解和使用组件。

## 特性

- 🤖 **AI 优先** - 每个组件都有详细的 AI 使用文档
- 🎨 **样式可控** - 基于 CSS Variables，支持全局和局部样式覆盖
- 📦 **按需引入** - 组件独立，可按需引入
- 🔧 **TypeScript** - 完整类型支持

## 快速开始

### 开发模式（预览文档）

```bash
npm install
npm run dev
```

### 使用组件

```tsx
import { Button, Input, Card } from 'stand-ui/components';

function App() {
  return (
    <Card title="示例">
      <Input placeholder="请输入" />
      <Button color="primary">提交</Button>
    </Card>
  );
}
```

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── Button/         # Button 组件
│   │   ├── Button.tsx      # 组件源码
│   │   ├── Button.module.css # 样式
│   │   ├── Button.ai.md    # AI 使用文档（关键！）
│   │   └── index.ts        # 组件入口
│   ├── Input/
│   ├── Card/
│   └── index.ts        # 组件总入口
├── core/               # 核心配置
│   ├── stand.ts        # 类型定义和工具函数
│   ├── vars.css        # CSS 变量
│   └── index.ts
├── docs/               # 文档配置
│   └── components.ts   # 组件注册表
├── pages/              # 文档站点页面
│   ├── Layout.tsx
│   ├── Home.tsx
│   ├── ComponentPage.tsx
│   └── docs.css
└── main.tsx
```

## 组件开发规范

完整路径、色彩约定、文档站注册、AI 文档结构与自检清单见 **[COMPONENT_DEVELOPMENT.md](./COMPONENT_DEVELOPMENT.md)**。

### 1. 创建新组件

每个组件目录结构：

```
MyComponent/
├── MyComponent.tsx      # 组件实现
├── MyComponent.module.css # 样式
├── MyComponent.ai.md    # AI 使用文档（必须！）
└── index.ts             # 入口
```

### 2. AI 文档规范

`Button.ai.md` 示例：

```markdown
# Button 组件 - AI 使用指南

## 快速开始
\`\`\`tsx
import { Button } from 'stand-ui/components/Button';
<Button>点击我</Button>
\`\`\`

## Props 完整说明
| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| size | 'sm' \| 'md' \| 'lg' | 'md' | 尺寸 |

## 常用组合示例
\`\`\`tsx
<Button color="primary" variant="solid">主要按钮</Button>
\`\`\`

## 样式覆盖指南
...
```

### 3. 注册组件

在 `src/docs/components.ts` 中注册，文档站点会自动展示。

## 样式系统

### CSS Variables

全局样式变量定义在 `src/core/vars.css`，可被覆盖：

```css
:root {
  --su-primary-600: #3b82f6;
  --su-primary-700: #2563eb;
}
```

### 组件级样式

每个组件使用 CSS Modules，样式通过 Props 控制：

```tsx
<Button size="lg" color="error" variant="outlined">
  危险操作
</Button>
```

## 文档站点

开发模式下，文档站点提供：

1. **组件预览** - 交互式查看组件效果
2. **代码示例** - 复制即可使用
3. **AI 文档** - 查看 .ai.md 完整内容

## 许可证

MIT
