import React from 'react';
import { Link } from 'react-router-dom';
import { getComponentDocsGrouped } from '../docs/components';
import { IconAiChip, IconBraces, IconPackage, IconPalette } from '../icons';

const inspirations = [
  {
    id: 'blade-runner',
    hint: '雨雾 · 霓虹',
    desc: '环境极暗，光源极少且语义明确——多层深色底上只点亮关键操作。',
    titleZh: '银翼杀手',
    titleEn: 'BLADE RUNNER',
    titleJa: 'ブレードランナー',
    year: '1982',
  },
  {
    id: 'blade-runner-2049',
    hint: '橙雾 · 废土',
    desc: '低饱和世界里，琥珀色块成为叙事锚点。',
    titleZh: '银翼杀手 2049',
    titleEn: 'BLADE RUNNER 2049',
    titleJa: 'ブレードランナー 2049',
    year: '2017',
  },
  {
    id: 'akira',
    hint: '警示 · 暴走',
    desc: '高饱和红只留给危险与临界状态；冷色底上珊瑚与错误色保持克制。',
    titleZh: '阿基拉',
    titleEn: 'AKIRA',
    titleJa: 'アキラ',
    year: '1988',
  },
  {
    id: 'ghost-in-the-shell',
    hint: 'HUD · 叠层',
    desc: '冷色描边与信息密度——正文 slate、半透明边界与可叠层级。',
    titleZh: '攻壳机动队',
    titleEn: 'GHOST IN THE SHELL',
    titleJa: '攻殻機動隊',
    year: '1995',
  },
  {
    id: 'gunnm',
    hint: '粉色 · 机体',
    desc: '废铁与肉机并置；粉与金属的反差可作危险与梦的隐喻。',
    titleZh: '铳梦',
    titleEn: 'GUNNM',
    titleJa: '銃夢',
    year: '1990',
  },
  {
    id: 'cp2077',
    hint: '夜之城 · UI',
    desc: '黄与洋红、青蓝分工；界面即世界观，品牌锚点不淹没正文。',
    titleZh: '赛博朋克 2077',
    titleEn: 'CYBERPUNK 2077',
    titleJa: 'サイバーパンク 2077',
    year: '2020',
  },
] as const;

export const Home: React.FC = () => {
  return (
    <div className="docs-home">
      <section className="hero">
        <h1 className="docs-logo-title">CyberStand UI</h1>
        <p className="subtitle">专为 AI 与多端开发优化的通用 UI 框架</p>
        <p className="description">
          每个组件都配有详细的 AI 使用文档，让 AI 能够精准识别和生成代码。
          <br />
          样式完全通过 CSS Variables 控制，易于覆盖和自定义。
        </p>
        <div className="actions">
          <Link to="/component/Button" className="btn-primary">
            开始使用
          </Link>
          <a
            href="https://github.com/your-org/stand-ui"
            className="btn-secondary"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </section>

      <section className="inspiration-section" aria-labelledby="inspiration-heading">
        <h2 id="inspiration-heading">灵感来源</h2>
        <p className="inspiration-intro">
          视觉气质借赛博朋克影像与游戏传统：深色冷底、霓虹锚点、可读优先。 完整设计说明见仓库根目录{' '}
          <strong className="inspiration-doc-ref">DESIGN.md</strong>。
        </p>
        <div className="inspiration-grid">
          {inspirations.map((item) => (
            <article key={item.id} className={`inspire-card inspire-card--${item.id}`}>
              <p className="inspire-card__hint">{item.hint}</p>
              <div className={`inspire-card__titles inspire-card__titles--${item.id}`}>
                <span className="inspire-card__zh">{item.titleZh}</span>
                <span className="inspire-card__en" lang="en">
                  {item.titleEn}
                </span>
                <span className="inspire-card__ja" lang="ja">
                  {item.titleJa}
                </span>
              </div>
              <p className="inspire-card__year">{item.year}</p>
              <p className="inspire-card__desc">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="features">
        <h2>核心特性</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon" aria-hidden>
              <IconAiChip size={40} />
            </div>
            <h3>AI 优先</h3>
            <p>每个组件配有 .ai.md 文档，AI 可直接理解组件用法</p>
          </div>
          <div className="feature-card">
            <div className="icon" aria-hidden>
              <IconPalette size={40} />
            </div>
            <h3>样式可控</h3>
            <p>基于 CSS Variables，支持全局和局部样式覆盖</p>
          </div>
          <div className="feature-card">
            <div className="icon" aria-hidden>
              <IconPackage size={40} />
            </div>
            <h3>按需引入</h3>
            <p>组件独立，可按需引入，无冗余代码</p>
          </div>
          <div className="feature-card">
            <div className="icon" aria-hidden>
              <IconBraces size={40} />
            </div>
            <h3>TypeScript</h3>
            <p>完整类型支持，开发体验更佳</p>
          </div>
        </div>
      </section>

      <section className="components-preview">
        <h2>组件列表</h2>
        <p className="components-preview-hint">
          侧栏与下方列表均来自 <code>src/docs/components.ts</code>。日期场景可查看{' '}
          <Link to="/component/DatePicker">DatePicker</Link>（自研月历弹层）与{' '}
          <Link to="/component/Input">Input</Link> 的 <code>type=&quot;date&quot;</code>
          （无原生日历图标，纯输入）对照示例； 悬停说明见{' '}
          <Link to="/component/Tooltip">Tooltip</Link>。
        </p>
        <div className="component-list-grouped">
          {getComponentDocsGrouped().map((group) => (
            <div key={group.category} className="component-category-block">
              <h3 className="component-category-title">{group.category}</h3>
              <div className="component-list">
                {group.docs.map((doc) => (
                  <Link key={doc.name} to={`/component/${doc.name}`} className="component-item">
                    <h4 className="component-item-title">{doc.title}</h4>
                    <p>{doc.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ai-usage">
        <h2>AI 使用示例</h2>
        <div className="code-block">
          <pre>{`# 告诉 AI：使用 CyberStand UI 的 Button 组件

"帮我创建一个登录表单，使用 CyberStand UI 的组件：
- 使用 Card 作为容器，带阴影
- 两个 Input，分别用于邮箱和密码
- 一个 Button，作为主要操作按钮"

AI 会自动查找 Button.ai.md、Input.ai.md、Card.ai.md
然后生成符合规范的代码。`}</pre>
        </div>
      </section>
    </div>
  );
};
