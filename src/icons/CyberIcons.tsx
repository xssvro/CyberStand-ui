import React from 'react';

export type CyberIconProps = React.SVGProps<SVGSVGElement> & {
  /** 视口边长（px） */
  size?: number;
};

const hud = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
};

/**
 * 线框 HUD 风格图标（参考夜之城界面：直角、细描边、无填充）
 */
export function IconHome({ size = 24, className, ...rest }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      {...rest}
    >
      <g {...hud}>
        <path d="M3 10.5 L12 3 L21 10.5" />
        <path d="M5 10.5 V20 H19 V10.5" />
        <path d="M10 20 V14 H14 V20" opacity={0.85} />
        <path d="M1 12 h1.5 M21.5 12 h1.5" strokeWidth={1} opacity={0.45} />
      </g>
    </svg>
  );
}

/** 神经芯片 / AI */
export function IconAiChip({ size = 24, className, ...rest }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      {...rest}
    >
      <g {...hud}>
        <path d="M4 7 L7 4 H17 L20 7 V17 L17 20 H7 L4 17 Z" />
        <path d="M12 7 V17 M7 12 H17" opacity={0.45} />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

/** 样式 / 色条均衡器 */
export function IconPalette({ size = 24, className, ...rest }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      {...rest}
    >
      <g {...hud}>
        <path d="M3 18 V8 H5 V18" />
        <path d="M9.5 18 V4 H11.5 V18" />
        <path d="M16 18 V11 H18 V18" />
        <path d="M2 19.5 H22" strokeWidth={1} opacity={0.35} />
      </g>
    </svg>
  );
}

/** 用户轮廓 — HUD 线框（Avatar 默认占位等） */
export function IconUserHud({ size = 24, className, ...rest }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      {...rest}
    >
      <g {...hud}>
        <circle cx="12" cy="8.75" r="3.35" />
        <path d="M6.25 19.5c0-4.1 2.55-6.25 5.75-6.25s5.75 2.15 5.75 6.25" />
        <path d="M3.5 3.5h2.75M17.75 3.5H20.5M3.5 20.5h2.75M17.75 20.5H20.5" strokeWidth={1} opacity={0.38} />
      </g>
    </svg>
  );
}

/** 等距货箱 */
export function IconPackage({ size = 24, className, ...rest }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      {...rest}
    >
      <g {...hud}>
        <path d="M4 9 L12 5 L20 9 L12 13 Z" />
        <path d="M4 9 L12 13 V21 L4 17 Z" />
        <path d="M20 9 L12 13 V21 L20 17 Z" />
        <path d="M12 13 V21" opacity={0.35} />
      </g>
    </svg>
  );
}

/** 花括号 — 类型 / 代码 */
export function IconBraces({ size = 24, className, ...rest }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      {...rest}
    >
      <g {...hud}>
        <path d="M8 4 V8 H5 V16 H8 V20" />
        <path d="M16 4 V8 H19 V16 H16 V20" />
        <path d="M10 12 H14" opacity={0.5} strokeWidth={1} />
      </g>
    </svg>
  );
}

/** 搜索 — 圆镜 + 斜向探针 */
export function IconSearch({ size = 24, className, ...rest }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      {...rest}
    >
      <g {...hud}>
        <circle cx="10" cy="10" r="4.5" />
        <path d="M14 14 L19.5 19.5" />
        <path d="M18.5 19.5 L19.5 20.5 L20.5 19.5" strokeWidth={1} opacity={0.45} />
      </g>
    </svg>
  );
}

/** 数据节点 — 提示 / 信息 */
export function IconDataNode({ size = 24, className, ...rest }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      {...rest}
    >
      <g {...hud}>
        <path d="M12 3 L21 12 L12 21 L3 12 Z" />
        <path d="M12 9 V15 M9 12 H15" opacity={0.4} strokeWidth={1} />
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
