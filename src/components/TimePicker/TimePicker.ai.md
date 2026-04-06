# TimePicker — AI 使用指南

- **值**：`HH:mm`；`withSeconds` 时为 `HH:mm:ss`；隐藏域 `name` 与 DatePicker 一致。
- **交互**：选「分钟」后自动关闭弹层（含秒时选「秒」后关闭）；外部点击、Esc 关闭。
- **TimeSpinner**：固定窄列（约 36px×2+11px 等）、视口约 5 行（24×120）；`width: fit-content` + 水平居中；**滚动条隐藏**，靠上下渐隐提示；面板 `shadow-sm` + 圆角与 token 一致；选中行用 `primary-50` 底 + 内描边。
