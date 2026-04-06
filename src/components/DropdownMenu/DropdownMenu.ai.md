# DropdownMenu — AI 使用指南

- **实现**：内部 `Popover`，`panelRole="menu"`、`aria-haspopup="menu"`；菜单项为 `menu` 的直接子节点。
- **项**：`DropdownMenuItem` 为 `role="menuitem"`，点击后 `close()`（除非 `preventDefault`）。
- **受控**：`open` / `onOpenChange` 与 Popover 一致；支持 `defaultOpen` 非受控。
