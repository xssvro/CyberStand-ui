import React, { useLayoutEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { getComponentDocsGrouped } from '../docs/components';
import { Toaster } from '../components/Toast';
import { applyTheme, getStoredTheme, type ThemeMode } from '../core/theme';
import { IconHome } from '../icons';
import './docs.css';

export const Layout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="docs-layout">
      <aside className="docs-sidebar">
        <div className="docs-logo">
          <h1 className="docs-logo-title">CyberStand UI</h1>
          <p>面向 AI 的通用 UI 框架 · 多端共用同一套理念</p>
        </div>
        <div className="docs-theme-bar">
          <span className="docs-theme-bar__label" id="theme-label">
            外观
          </span>
          <button
            type="button"
            className={`docs-theme-switch${theme === 'dark' ? ' docs-theme-switch--on' : ''}`}
            role="switch"
            aria-checked={theme === 'dark'}
            aria-labelledby="theme-label"
            aria-label={theme === 'dark' ? '当前为深色，切换为浅色' : '当前为浅色，切换为深色'}
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          >
            <span className="docs-theme-switch__thumb" aria-hidden />
          </button>
          <span className="docs-theme-bar__value">{theme === 'light' ? '浅色' : '深色'}</span>
        </div>
        <nav className="docs-nav">
          <Link 
            to="/" 
            className={currentPath === '/' ? 'active' : ''}
          >
            <IconHome className="docs-nav-icon" size={18} aria-hidden />
            首页
          </Link>
          <div className="nav-section">组件</div>
          {getComponentDocsGrouped().map((group) => (
            <React.Fragment key={group.category}>
              <div className="docs-nav-category">{group.category}</div>
              {group.docs.map((doc) => (
                <Link
                  key={doc.name}
                  to={`/component/${doc.name}`}
                  className={currentPath === `/component/${doc.name}` ? 'active' : ''}
                >
                  {doc.title}
                </Link>
              ))}
            </React.Fragment>
          ))}
        </nav>
      </aside>
      <main className="docs-main" data-su-scroll-lock>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};
