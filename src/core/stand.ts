import type { CSSProperties } from 'react';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type Color = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export type Variant = 'solid' | 'soft' | 'outlined' | 'ghost' | 'link';

export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface StandProps {
  size?: Size;
  color?: Color;
  variant?: Variant;
  radius?: Radius;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const getSizeVars = (size: Size = 'md'): Record<string, string> => {
  const sizes: Record<Size, Record<string, string>> = {
    xs: { '--su-padding': '3px 7px', '--su-font-size': '12px', '--su-height': '22px' },
    sm: { '--su-padding': '5px 10px', '--su-font-size': '14px', '--su-height': '30px' },
    md: { '--su-padding': '7px 12px', '--su-font-size': '14px', '--su-height': '36px' },
    lg: { '--su-padding': '10px 16px', '--su-font-size': '16px', '--su-height': '44px' },
    xl: { '--su-padding': '12px 20px', '--su-font-size': '18px', '--su-height': '52px' },
  };
  return sizes[size];
};

export const getRadiusVar = (radius: Radius = 'md'): string => {
  const radiusMap: Record<Radius, string> = {
    none: '0',
    sm: '3px',
    md: '5px',
    lg: '7px',
    xl: '10px',
    full: '9999px',
  };
  return radiusMap[radius];
};
