# AI 协作说明

## 项目目标

Ashu PDF Reader 是一个 Windows 优先的极简 PDF 阅读器。启动时选择文件，取消则退出；进入阅读后只展示 PDF，其他功能通过快捷键或顶部悬停条打开。

## 技术栈

- Tauri 2
- Vue 3 + TypeScript
- Vite
- PDF.js
- pnpm

## 代码约定

- Vue 组件使用 `<script setup lang="ts">`。
- 根组件只做编排；功能逻辑放到 composables。
- 组件按 feature 分目录。
- 状态尽量用 `shallowRef`，派生值用 `computed`。
- 不把业务逻辑塞进模板。
- 修改功能时同步更新 `docs/FEATURES.md`。
- 修改架构时同步更新 `docs/ARCHITECTURE.md`。
- 发布版本时同步更新 `CHANGELOG.md`。

## 常用命令

```powershell
pnpm install
pnpm build
pnpm tauri dev
pnpm tauri build
```

## 验收原则

- 默认界面必须极简。
- 键盘操作必须优先可用。
- Windows 窗口拖动、缩放、关闭必须可靠。
- PDF 默认适配窗口宽度。
- 不引入多余菜单和常驻工具栏。

## GitHub 提交流程

- 通用 Git 与版本规范使用 `git-workflow-and-versioning`。
- 提交信息与暂存使用 `git-commit`。
- 本项目发布流程使用 `ashu-github-release`。
- GitHub-bound 改动必须完成验证、更新文档、提交、推送、Tag 和 Release 资产校验。


