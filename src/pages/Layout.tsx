import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { componentDocs } from '../docs/components';
import { Toaster } from '../components/Toast';
import { IconHome } from '../icons';
import './docs.css';

export const Layout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="docs-layout">
      <aside className="docs-sidebar">
        <div className="docs-logo">
          <h1 className="docs-logo-title">CyberStand UI</h1>
          <p>面向 AI 的通用 UI 框架 · 多端共用同一套理念</p>
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
          {componentDocs.map(doc => (
            <Link
              key={doc.name}
              to={`/component/${doc.name}`}
              className={currentPath === `/component/${doc.name}` ? 'active' : ''}
            >
              {doc.title}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="docs-main">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};
