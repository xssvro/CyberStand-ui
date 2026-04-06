import React from 'react';
import type { Color } from '../../core/stand';
import styles from './Progress.module.css';

export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 0–100；与 `indeterminate` 互斥时以不确定态为准 */
  value?: number;
  /** 不确定进度（加载中） */
  indeterminate?: boolean;
  size?: ProgressSize;
  color?: Color;
  /** 实色条上轻微脉动（仅确定态，替代斜向条纹） */
  striped?: boolean;
  /** 右侧显示百分比文案 */
  showLabel?: boolean;
  /** `role="progressbar"` 辅助名称 */
  'aria-label'?: string;
}

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value = 0,
    indeterminate = false,
    size = 'md',
    color = 'primary',
    striped = false,
    showLabel = false,
    className = '',
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const pct = clampPct(value);
  const isIndeterminate = indeterminate === true;
  const showStripes = striped && !isIndeterminate;

  const a11yProps: React.HTMLAttributes<HTMLDivElement> = isIndeterminate
    ? {
        'aria-valuetext': '加载中',
      }
    : {
        'aria-valuenow': Math.round(pct),
        'aria-valuemin': 0,
        'aria-valuemax': 100,
      };

  return (
    <div
      ref={ref}
      role="progressbar"
      className={join(styles.root, className)}
      {...rest}
      {...a11yProps}
      aria-label={ariaLabel}
    >
      <div
        className={join(
          styles.track,
          size === 'sm' && styles.sizeSm,
          size === 'md' && styles.sizeMd,
          size === 'lg' && styles.sizeLg,
        )}
      >
        <div
          className={join(
            styles.fill,
            styles[color],
            showStripes && styles.striped,
            isIndeterminate && styles.indeterminate,
          )}
          style={
            isIndeterminate
              ? undefined
              : ({
                  width: `${pct}%`,
                } as React.CSSProperties)
          }
        />
      </div>
      {showLabel && !isIndeterminate ? (
        <span className={styles.label} aria-hidden>
          {Math.round(pct)}%
        </span>
      ) : null}
    </div>
  );
});

Progress.displayName = 'Progress';
