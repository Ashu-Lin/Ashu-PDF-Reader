# Ashu PDF Reader

[English](README.md) | [简体中文](README.zh-CN.md)

[![Release](https://img.shields.io/github/v/release/Ashu-Lin/Ashu-PDF-Reader?sort=semver&label=release)](https://github.com/Ashu-Lin/Ashu-PDF-Reader/releases)
[![License](https://img.shields.io/github/license/Ashu-Lin/Ashu-PDF-Reader)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows-0078D4)](https://github.com/Ashu-Lin/Ashu-PDF-Reader/releases)

一个 Windows 优先的极简 PDF 阅读器。  
基于 Tauri 2、Vue 3、TypeScript、Vite 和 PDF.js。

![无干扰阅读界面](docs/github-preview.png)

*无干扰阅读界面*

![键盘优先命令面板](docs/github-command-palette.png)

*键盘优先命令面板（F1 / Ctrl+Shift+P）*

如果这个项目符合你的阅读方式，欢迎点一个 Star，让更多人发现它。

Ashu PDF Reader 面向只想安静阅读本地 PDF 的用户。启动后直接选择文件，取消则退出；选中 PDF 后，窗口只展示文档。没有常驻工具栏，没有复杂菜单，所有功能都通过快捷键或顶部悬停控制条唤起。

## 下载与安装

不需要自己编译源码，直接下载 Windows 安装包即可使用。

| 安装包 | 建议 | 下载 |
| --- | --- | --- |
| Windows 安装器（`.exe`） | 推荐 | [下载 v0.1.3](https://github.com/Ashu-Lin/Ashu-PDF-Reader/releases/download/v0.1.3/Ashu.PDF.Reader_0.1.3_x64-setup.exe) |
| Windows MSI（`.msi`） | 备用 | [下载 v0.1.3](https://github.com/Ashu-Lin/Ashu-PDF-Reader/releases/download/v0.1.3/Ashu.PDF.Reader_0.1.3_x64_en-US.msi) |

[查看全部 Release](https://github.com/Ashu-Lin/Ashu-PDF-Reader/releases)

### Windows 安装步骤

1. 下载 `.exe` 安装器，优先推荐它。
2. 关闭正在运行的旧版 Ashu PDF Reader。
3. 运行安装器，按提示完成安装。
4. 如果出现 Windows SmartScreen，选择 **更多信息** -> **仍要运行**。当前版本暂未购买代码签名证书。
5. 从开始菜单或桌面快捷方式启动 **Ashu PDF Reader**。
6. 选择一个 PDF。如果取消选择，应用会直接退出。

更新时关闭正在运行的应用，然后安装新版本即可，通常不需要先卸载旧版。

## 特点

- 本地优先：不需要账号，不上传文件。
- 极简默认状态：打开 PDF 后只看到文档。
- 键盘优先：核心操作都有快捷键。
- Windows 优先：针对 Windows 桌面使用习惯设计。
- 无边框窗口：保留移动、缩放、最小化、最大化、关闭等直觉。
- 启动即选择文件：取消选择则退出应用。
- 适配宽度：默认让 PDF 贴合窗口内容区。
- 无可见滚动条：仍支持鼠标滚轮和触控板滚动。
- `Ctrl + 滚轮`：快速放大缩小。
- 原创图标：深色底、暖白纸张、金色书签。

## 功能

- Windows 原生文件选择器
- 取消选择后退出
- 单窗口 PDF 阅读
- PDF.js 渲染
- 默认适配窗口宽度
- 窗口变化后自动重新适配
- 放大、缩小、重置适配宽度
- `Ctrl + 滚轮` 缩放
- 隐藏滚动条但保留滚动能力
- 无边框窗口
- 顶部悬停控制条
- `Alt + 拖动` 移动窗口
- 四边和四角缩放
- 命令面板
- 快捷键操作

## 快捷键

| 操作 | 快捷键 |
|---|---|
| 打开另一个 PDF | `Ctrl+O` |
| 适配宽度 | `Ctrl+0` |
| 放大 | `Ctrl+=`、`Ctrl++`、`Ctrl+滚轮向上` |
| 缩小 | `Ctrl+-`、`Ctrl+_`、`Ctrl+滚轮向下` |
| 命令面板 | `F1` 或 `Ctrl+Shift+P` |
| 关闭浮层 | `Esc` |
| 移动窗口 | `Alt + 拖动` |
| 调整大小 | 拖动四边或四角 |

## 开发

```powershell
pnpm install
pnpm tauri dev
```

## 构建

```powershell
pnpm build
pnpm tauri build
```

安装包输出目录：

```text
src-tauri/target/release/bundle/
```

## 许可证

MIT










