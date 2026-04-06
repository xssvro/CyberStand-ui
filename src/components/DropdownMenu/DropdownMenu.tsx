import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Popover } from '../Popover';
import type { PopperPlacement } from '../Popover';
import styles from './DropdownMenu.module.css';

function join(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

type DropdownMenuContextValue = { close: () => void };

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu(component: string): DropdownMenuContextValue {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) throw new Error(`${component} must be used within <DropdownMenu>`);
  return ctx;
}

export interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: PopperPlacement;
  trigger: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  zIndex?: number;
  className?: string;
  panelClassName?: string;
  keyboard?: boolean;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  trigger,
  children,
  disabled = false,
  zIndex,
  className,
  panelClassName,
  keyboard = true,
}) => {
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? openProp! : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const close = useCallback(() => setOpen(false), [setOpen]);

  const ctx = useMemo(() => ({ close }), [close]);

  if (disabled) {
    return <span className={styles.triggerDisabled}>{trigger}</span>;
  }

  return (
    <DropdownMenuContext.Provider value={ctx}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        placement={placement}
        zIndex={zIndex}
        className={className}
        panelClassName={join(styles.panel, panelClassName)}
        panelRole="menu"
        ariaHasPopup="menu"
        keyboard={keyboard}
        content={children}
      >
        {trigger}
      </Popover>
    </DropdownMenuContext.Provider>
  );
};

DropdownMenu.displayName = 'DropdownMenu';

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  function DropdownMenuItem(
    { className, destructive, disabled, onClick, type = 'button', ...rest },
    ref,
  ) {
    const { close } = useDropdownMenu('DropdownMenuItem');
    return (
      <button
        ref={ref}
        type={type}
        role="menuitem"
        disabled={disabled}
        className={join(styles.item, destructive && styles.destructive, className)}
        onClick={(e) => {
          if (disabled) return;
          onClick?.(e);
          if (!e.defaultPrevented) close();
        }}
        {...rest}
      />
    );
  },
);

DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuLabel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => <div className={join(styles.label, className)} role="presentation" {...rest} />;

DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuDivider: React.FC = () => (
  <div className={styles.divider} role="separator" />
);

DropdownMenuDivider.displayName = 'DropdownMenuDivider';
