# Product

## Summary

Ashu PDF Reader is a Windows-first desktop PDF reader for focused reading. It opens the native file picker immediately, enters an almost chrome-free reading surface after selection, and keeps all optional controls behind shortcuts or hover-only UI.

## Platform

- Primary: Windows desktop
- Stack: Tauri 2 + Vue 3 + TypeScript + Vite + PDF.js
- Package manager: pnpm
- Distribution target: GitHub source and Windows installer

## Primary User

A person who wants to read a local PDF with as little interface noise as possible. The expected situation is a desktop reading session where the document matters more than the app.

## Core Flow

1. Launch the app.
2. The native file picker opens.
3. Cancel: exit the app.
4. Select a PDF: switch the same window into reading mode.
5. Only the PDF is visible by default.
6. Shortcuts or hover controls reveal optional actions.

## v0.1 Scope

- Native file picker on launch
- Cancel exits
- Single-window reader
- PDF rendering
- Scroll and page navigation
- Zoom in, zoom out, fit width
- Automatic fit-width on window resize
- Frameless window with hover top controls
- Alt + drag anywhere to move the window
- Edge and corner resize zones
- Keyboard shortcuts for core actions
- AI-friendly documentation and version history

## Non-Goals for v0.1

- Tabs or multiple documents
- Editing, annotation, signatures, or forms
- Cloud sync or accounts
- PDF creation or conversion
- OCR
- macOS and Linux polish; architecture should allow later support

## Interaction Rules

- `Ctrl+O`: open another PDF
- `Ctrl+F`: search
- `Ctrl+B`: table of contents
- `Ctrl+=`: zoom in
- `Ctrl+-`: zoom out
- `Ctrl+0`: fit width
- `F1` or `Ctrl+Shift+P`: command panel
- `Esc`: close overlay
- `Alt + drag`: move window
- Edge or corner drag: resize window

## Constraints

- UI language: Chinese first
- App name: Ashu PDF Reader
- Planned identifier: `com.ashu.pdfreader`
- Planned license: MIT
- No native title bar; use a frameless window
- Native Windows resizing should remain stable
- Reading surface must remain usable by keyboard only

## Assumptions

These assumptions are inferred from the confirmed brief and can be adjusted before implementation:

- Hover controls appear only near the top edge.
- The PDF page uses a warm paper surface against a dark neutral desk.
- Search and table of contents are planned shortcuts but can be disabled placeholders if v0.1 must stay minimal.
