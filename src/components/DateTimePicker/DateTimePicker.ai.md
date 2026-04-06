# DateTimePicker — AI 使用指南

- **值**：`yyyy-mm-ddTHH:mm`（`withSeconds` 时带秒）；与 `datetime-local` 字符串形式兼容。
- **布局**：弹层内**左侧日历、右侧时间滚轮**（窄屏下自动改为上下堆叠）。
- **交互**：选日不关闭面板，便于再调时间；点外部或 Esc 关闭。
- **日历**：与 DatePicker 共用 `CalendarPanel` 与 `dateUtils`。
