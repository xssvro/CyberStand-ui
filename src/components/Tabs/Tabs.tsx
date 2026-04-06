import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './Tabs.module.css';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

type TabsVariant = 'pills' | 'line';

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
  variant: TabsVariant;
  tabRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`${component} must be used within <Tabs>`);
  return ctx;
}

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  variant = 'pills',
  className,
  children,
}) => {
  const baseId = useId().replace(/:/g, '');
  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = isControlled ? valueProp! : uncontrolled;
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const setValue = useCallback(
    (v: string) => {
      if (!isControlled) setUncontrolled(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange],
  );

  const ctx = useMemo(
    () => ({ value, setValue, baseId, variant, tabRefs }),
    [value, setValue, baseId, variant],
  );

  return (
    <TabsContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.displayName = 'Tabs';

export interface TabsListProps extends React.HTMLAttributes<HTMLUListElement> {
  'aria-label'?: string;
}

export const TabsList = React.forwardRef<HTMLUListElement, TabsListProps>(function TabsList(
  { className, 'aria-label': ariaLabel = '标签', ...rest },
  ref,
) {
  const { variant } = useTabsContext('TabsList');
  return (
    <ul
      ref={ref}
      role="tablist"
      aria-label={ariaLabel}
      className={join(variant === 'line' ? styles.listLine : styles.list, className)}
      {...rest}
    />
  );
});

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ className, value, children, disabled, onKeyDown, ...rest }, ref) {
    const { value: selected, setValue, baseId, variant, tabRefs } = useTabsContext('TabsTrigger');
    const active = selected === value;
    const tabId = `${baseId}-tab-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    const mergeRef = useCallback(
      (node: HTMLButtonElement | null) => {
        if (node) tabRefs.current.set(value, node);
        else tabRefs.current.delete(value);
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref, tabRefs, value],
    );

    const focusSibling = (dir: 1 | -1) => {
      const keys = Array.from(tabRefs.current.keys());
      const i = keys.indexOf(value);
      if (i < 0) return;
      const next = keys[(i + dir + keys.length) % keys.length];
      tabRefs.current.get(next)?.focus();
    };

    return (
      <li
        className={join(variant === 'line' ? styles.tabLine : styles.tab)}
        role="presentation"
      >
        <button
          {...rest}
          ref={mergeRef}
          type="button"
          role="tab"
          id={tabId}
          data-tab-value={value}
          aria-selected={active}
          aria-controls={panelId}
          tabIndex={active ? 0 : -1}
          disabled={disabled}
          className={join(styles.trigger, active && styles.active, className)}
          onClick={() => !disabled && setValue(value)}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (disabled || e.defaultPrevented) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault();
              focusSibling(1);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault();
              focusSibling(-1);
            } else if (e.key === 'Home') {
              e.preventDefault();
              const keys = Array.from(tabRefs.current.keys()).sort();
              tabRefs.current.get(keys[0])?.focus();
            } else if (e.key === 'End') {
              e.preventDefault();
              const keys = Array.from(tabRefs.current.keys()).sort();
              tabRefs.current.get(keys[keys.length - 1])?.focus();
            }
          }}
        >
          {children}
        </button>
      </li>
    );
  },
);

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ className, value, children, forceMount, hidden, ...rest }, ref) {
    const { value: selected, baseId } = useTabsContext('TabsContent');
    const active = selected === value;
    const tabId = `${baseId}-tab-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    if (!forceMount && !active) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        hidden={hidden ?? !active}
        className={join(styles.panel, className)}
        tabIndex={0}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

TabsContent.displayName = 'TabsContent';
