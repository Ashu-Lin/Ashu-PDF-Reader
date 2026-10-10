# 架构说明

## 总览

应用由 Tauri 后端和 Vue 前端组成。后端负责读取用户选择的 PDF 文件；前端负责 PDF 渲染、窗口交互和快捷键。

## 目录

- `src/App.vue`: 应用编排，负责打开文件、快捷键、命令面板和工具栏状态。
- `src/components/reader/PdfReader.vue`: PDF 页面缓存、Canvas 渲染、适配宽度、窗口变化处理。
- `src/components/window/HoverToolbar.vue`: 顶部悬停控制条。
- `src/components/window/WindowResizeHandles.vue`: 无边框窗口的边缘和角落缩放热区。
- `src/components/ui/CommandPalette.vue`: 命令面板。
- `src/composables/usePdfReader.ts`: PDF 文档状态、缩放模式、加载流程。
- `src/composables/useWindowControls.ts`: Tauri 窗口拖动、缩放、最小化、最大化和关闭。
- `src/composables/useKeyboardShortcuts.ts`: 全局快捷键。
- `src-tauri/src/lib.rs`: Tauri 命令和插件注册。
- `src-tauri/tauri.conf.json`: 窗口、打包和应用配置。

## 数据流

1. 应用启动。
2. `App.vue` 调用 Tauri dialog 插件打开系统文件选择器。
3. 用户选择 PDF 后，前端调用 `read_pdf_file`。
4. Rust 后端读取文件字节并返回给前端。
5. `usePdfReader` 创建 PDF.js 文档实例。
6. `PdfReader` 将页面渲染到 Canvas。
7. 窗口尺寸变化时，`PdfReader` 重新计算适配宽度。

## 窗口模型

- `decorations: false`: 使用无边框窗口。
- 顶部悬停条负责拖动、打开文件、缩放和窗口按钮。
- `Alt + 拖动` 可在任意位置移动窗口。
- 四边和四角热区调用 Tauri `startResizeDragging`。

## PDF 渲染

- 使用 `pdfjs-dist`。
- 每个页面一个 Canvas。
- 默认缩放模式为适配宽度。
- 手动缩放后切换到百分比模式。
- `Ctrl+0` 回到适配宽度。
