/**
 * CyberStand UI - Core Design System
 * 
 * 面向 AI 的通用 UI 框架核心配置（多端共用 token 与类型）
 * 所有组件样式基于CSS Variables，便于主题覆盖
 */

// 组件尺寸
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 颜色主题
export type Color = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info';

// 变体类型
export type Variant = 'solid' | 'soft' | 'outlined' | 'ghost' | 'link';

// 圆角
export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

// 通用组件Props
export interface StandProps {
  /** 尺寸大小 */
  size?: Size;
  /** 颜色主题 */
  color?: Color;
  /** 样式变体 */
  variant?: Variant;
  /** 圆角大小 */
  radius?: Radius;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

// 获取尺寸CSS变量
export const getSizeVars = (size: Size = 'md'): Record<string, string> => {
  const sizes: Record<Size, Record<string, string>> = {
    xs: { '--su-padding': '4px 8px', '--su-font-size': '12px', '--su-height': '24px' },
    sm: { '--su-padding': '6px 12px', '--su-font-size': '14px', '--su-height': '32px' },
    md: { '--su-padding': '8px 16px', '--su-font-size': '14px', '--su-height': '40px' },
    lg: { '--su-padding': '12px 20px', '--su-font-size': '16px', '--su-height': '48px' },
    xl: { '--su-padding': '16px 24px', '--su-font-size': '18px', '--su-height': '56px' },
  };
  return sizes[size];
};

// 获取圆角CSS变量
export const getRadiusVar = (radius: Radius = 'md'): string => {
  const radiusMap: Record<Radius, string> = {
    'none': '0',
    'sm': '4px',
    'md': '8px',
    'lg': '12px',
    'xl': '16px',
    'full': '9999px',
  };
  return radiusMap[radius];
};
