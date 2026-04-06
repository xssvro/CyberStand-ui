import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { formatISOTime, parseISOTime } from '../DatePicker/dateUtils';
import styles from './TimePicker.module.css';

function joinClasses(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** 滚停后：视口垂直中线最近的一格 */
function valueAtColumnCenter(col: HTMLElement): number | null {
  const rect = col.getBoundingClientRect();
  const cy = rect.top + rect.height / 2;
  const nodes = col.querySelectorAll<HTMLElement>('[data-time-col-value]');
  let best: number | null = null;
  let bestD = Infinity;
  nodes.forEach((node) => {
    const r = node.getBoundingClientRect();
    const mid = r.top + r.height / 2;
    const d = Math.abs(mid - cy);
    if (d < bestD) {
      bestD = d;
      const raw = node.dataset.timeColValue;
      if (raw != null) best = Number(raw);
    }
  });
  return best;
}

const SCROLL_SETTLE_MS = 175;

type TimeColumnProps = {
  colRef: React.RefObject<HTMLDivElement | null>;
  activeRef: React.RefObject<HTMLButtonElement | null>;
  values: number[];
  selected: number;
  onSelect: (v: number) => void;
  /** 每次点击格子后调用（与值是否变化无关），用于 TimePicker 关弹层 */
  afterItemClick?: () => void;
};

/**
 * 单列：原生滚动 + 点击选中；滚轮/触控滑动停止后再根据中线同步一次（不与点击抢逻辑）。
 */
function TimeColumn({
  colRef,
  activeRef,
  values,
  selected,
  onSelect,
  afterItemClick,
}: TimeColumnProps) {
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClickRef = useRef(false);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const flushScrollSelection = useCallback(() => {
    const el = colRef.current;
    if (!el) return;
    const v = valueAtColumnCenter(el);
    if (v === null) return;
    if (v !== selectedRef.current) onSelectRef.current(v);
  }, [colRef]);

  const scheduleFlush = useCallback(() => {
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    settleTimerRef.current = setTimeout(() => {
      settleTimerRef.current = null;
      flushScrollSelection();
    }, SCROLL_SETTLE_MS);
  }, [flushScrollSelection]);

  useEffect(() => {
    const el = colRef.current;
    if (!el) return;

    const onScroll = () => {
      scheduleFlush();
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, [colRef, scheduleFlush]);

  useEffect(() => {
    const el = colRef.current;
    if (!el) return;

    const drag = {
      active: false,
      captured: false,
      pointerId: -1,
      startY: 0,
      startScroll: 0,
      moved: false,
    };

    const onPointerDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      drag.active = true;
      drag.captured = false;
      drag.pointerId = ev.pointerId;
      drag.startY = ev.clientY;
      drag.startScroll = el.scrollTop;
      drag.moved = false;
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (!drag.active || ev.pointerId !== drag.pointerId) return;
      const delta = ev.clientY - drag.startY;
      if (!drag.captured) {
        if (Math.abs(delta) <= 5) return;
        drag.captured = true;
        drag.moved = true;
        try {
          el.setPointerCapture(ev.pointerId);
        } catch {}
      }
      el.scrollTop = drag.startScroll + (drag.startY - ev.clientY);
      ev.preventDefault();
    };

    const onPointerEnd = (ev: PointerEvent) => {
      if (!drag.active || ev.pointerId !== drag.pointerId) return;
      const didDrag = drag.moved;
      if (drag.captured) {
        try {
          el.releasePointerCapture(ev.pointerId);
        } catch {}
      }
      drag.active = false;
      drag.captured = false;
      drag.moved = false;
      if (didDrag) {
        suppressClickRef.current = true;
        setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
        flushScrollSelection();
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove, { passive: false });
    el.addEventListener('pointerup', onPointerEnd);
    el.addEventListener('pointercancel', onPointerEnd);
    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerEnd);
      el.removeEventListener('pointercancel', onPointerEnd);
    };
  }, [colRef, flushScrollSelection, scheduleFlush]);

  /* 仅在外部值变化导致未对齐时再 scrollIntoView，避免滚轮停稳后又把列表拽回导致卡顿 */
  useLayoutEffect(() => {
    const col = colRef.current;
    const btn = activeRef.current;
    if (!col || !btn) return;
    const cr = col.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const cMid = cr.top + cr.height / 2;
    const bMid = br.top + br.height / 2;
    if (Math.abs(bMid - cMid) < 3) return;
    btn.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
  }, [selected, activeRef, colRef]);

  return (
    <div className={styles.spinnerColWrap}>
      <div ref={colRef} className={styles.spinnerCol}>
        {values.map((v) => (
          <button
            key={v}
            ref={selected === v ? activeRef : undefined}
            type="button"
            data-time-col-value={v}
            className={joinClasses(styles.spinnerBtn, selected === v && styles.active)}
            aria-pressed={selected === v}
            onClick={() => {
              if (suppressClickRef.current) return;
              if (v !== selected) onSelect(v);
              afterItemClick?.();
            }}
          >
            {v.toString().padStart(2, '0')}
          </button>
        ))}
      </div>
      <div className={styles.spinnerColFadeTop} aria-hidden />
      <div className={styles.spinnerColFadeBottom} aria-hidden />
    </div>
  );
}

export interface TimeSpinnerProps {
  value: string;
  onChange: (next: string) => void;
  withSeconds?: boolean;
  minuteStep?: number;
  className?: string;
  onPickComplete?: () => void;
}

export const TimeSpinner: React.FC<TimeSpinnerProps> = ({
  value,
  onChange,
  withSeconds = false,
  minuteStep = 1,
  className,
  onPickComplete,
}) => {
  const parsed = useMemo(() => parseISOTime(value) ?? { h: 0, m: 0, sec: 0 }, [value]);
  const hourBtnRef = useRef<HTMLButtonElement>(null);
  const minBtnRef = useRef<HTMLButtonElement>(null);
  const secBtnRef = useRef<HTMLButtonElement>(null);
  const hourColRef = useRef<HTMLDivElement>(null);
  const minColRef = useRef<HTMLDivElement>(null);
  const secColRef = useRef<HTMLDivElement>(null);

  const minutes = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < 60; i += minuteStep) out.push(i);
    return out;
  }, [minuteStep]);

  const setPart = useCallback(
    (patch: Partial<{ h: number; m: number; sec: number }>) => {
      const h = patch.h ?? parsed.h;
      let m = patch.m ?? parsed.m;
      let sec = patch.sec ?? parsed.sec;
      if (minutes.length && !minutes.includes(m)) {
        m = minutes.reduce((prev, cur) => (Math.abs(cur - m) < Math.abs(prev - m) ? cur : prev));
      }
      onChange(formatISOTime(h, m, sec, withSeconds));
    },
    [minutes, onChange, parsed.h, parsed.m, parsed.sec, withSeconds],
  );

  const pickHour = useCallback((v: number) => setPart({ h: v }), [setPart]);
  const pickMinute = useCallback((v: number) => setPart({ m: v }), [setPart]);
  const pickSec = useCallback((v: number) => setPart({ sec: v }), [setPart]);

  const hourValues = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const secValues = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  return (
    <div
      className={joinClasses(
        styles.spinnerBoard,
        withSeconds && styles.spinnerBoardSeconds,
        className,
      )}
      role="group"
      aria-label="选择时间"
    >
      <TimeColumn
        colRef={hourColRef}
        activeRef={hourBtnRef}
        values={hourValues}
        selected={parsed.h}
        onSelect={pickHour}
      />
      <span className={styles.spinnerSepCell} aria-hidden>
        :
      </span>
      <TimeColumn
        colRef={minColRef}
        activeRef={minBtnRef}
        values={minutes}
        selected={parsed.m}
        onSelect={pickMinute}
        afterItemClick={!withSeconds ? onPickComplete : undefined}
      />
      {withSeconds ? (
        <>
          <span className={styles.spinnerSepCell} aria-hidden>
            :
          </span>
          <TimeColumn
            colRef={secColRef}
            activeRef={secBtnRef}
            values={secValues}
            selected={parsed.sec}
            onSelect={pickSec}
            afterItemClick={onPickComplete}
          />
        </>
      ) : null}
    </div>
  );
};

TimeSpinner.displayName = 'TimeSpinner';
