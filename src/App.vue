<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import PdfReader from "./components/reader/PdfReader.vue";
import CommandPalette from "./components/ui/CommandPalette.vue";
import HoverToolbar from "./components/window/HoverToolbar.vue";
import WindowResizeHandles from "./components/window/WindowResizeHandles.vue";
import { useKeyboardShortcuts } from "./composables/useKeyboardShortcuts";
import { usePdfReader } from "./composables/usePdfReader";
import { useWindowControls } from "./composables/useWindowControls";

interface CommandItem {
  id: string;
  label: string;
  shortcut: string;
}

const {
  document: pdfDocument,
  fileName,
  isLoading,
  error,
  renderScale,
  scaleLabel,
  setFitScale,
  zoomIn,
  zoomOut,
  fitWidth,
  loadFromBytes,
  clearError,
} = usePdfReader();

const { startDragging, startResize, minimize, toggleMaximize, close } = useWindowControls();

const showCommands = shallowRef(false);
const toolbarVisible = shallowRef(false);

const commands = computed<CommandItem[]>(() => [
  { id: "open", label: "打开另一个 PDF", shortcut: "Ctrl O" },
  { id: "fit", label: "适配窗口宽度", shortcut: "Ctrl 0" },
  { id: "zoom-in", label: "放大页面", shortcut: "Ctrl +" },
  { id: "zoom-out", label: "缩小页面", shortcut: "Ctrl -" },
  { id: "close-commands", label: "关闭命令面板", shortcut: "Esc" },
]);

function selectedFileName(path: string) {
  return path.split(/[\\/]/).pop() || "未命名.pdf";
}

async function openPdf() {
  const path = await open({
    multiple: false,
    directory: false,
    filters: [{ name: "PDF 文档", extensions: ["pdf"] }],
  });

  if (!path || Array.isArray(path)) {
    return false;
  }

  clearError();
  const bytes = await invoke<number[]>("read_pdf_file", { path });
  await loadFromBytes(new Uint8Array(bytes), selectedFileName(path));
  return true;
}

async function openInitialPdf() {
  try {
    const opened = await openPdf();
    if (!opened) {
      await close();
    }
  } catch (openError) {
    clearError();
    await close();
    console.error("Failed to open initial PDF", openError);
  }
}

function closeOverlay() {
  showCommands.value = false;
}

function toggleCommands() {
  showCommands.value = !showCommands.value;
}

function runCommand(id: string) {
  showCommands.value = false;

  switch (id) {
    case "open":
      void openPdf();
      break;
    case "fit":
      fitWidth();
      break;
    case "zoom-in":
      zoomIn();
      break;
    case "zoom-out":
      zoomOut();
      break;
    default:
      break;
  }
}

function handlePointerMove(event: PointerEvent) {
  if (event.clientY <= 56) {
    toolbarVisible.value = true;
    return;
  }

  if (event.clientY > 104) {
    toolbarVisible.value = false;
  }
}

function handleToolbarDrag() {
  void startDragging();
}

function handleToolbarDoubleClick() {
  void toggleMaximize();
}

useKeyboardShortcuts({
  openFile: () => void openPdf(),
  zoomIn,
  zoomOut,
  fitWidth,
  toggleCommands,
  closeOverlay,
});

onMounted(() => {
  window.addEventListener("pointermove", handlePointerMove);
  void openInitialPdf();
});

onBeforeUnmount(() => {
  window.removeEventListener("pointermove", handlePointerMove);
});
</script>

<template>
  <main class="app-shell">
    <PdfReader
      :pdf-document="pdfDocument"
      :scale="renderScale"
      :is-loading="isLoading"
      :error="error"
      @fit-scale-change="setFitScale"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
    />

    <Transition name="toolbar-fade">
      <HoverToolbar
        v-if="toolbarVisible && !showCommands"
        :file-name="fileName"
        :scale-label="scaleLabel"
        @open="openPdf"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
        @fit-width="fitWidth"
        @minimize="minimize"
        @toggle-maximize="toggleMaximize"
        @close="close"
        @drag="handleToolbarDrag"
        @double-click="handleToolbarDoubleClick"
      />
    </Transition>

    <CommandPalette
      :open="showCommands"
      :items="commands"
      @close="closeOverlay"
      @select="runCommand"
    />

    <WindowResizeHandles @resize="startResize" />
  </main>
</template>

<style scoped>
.app-shell {
  position: fixed;
  inset: 0;
  background: var(--desk);
}

.toolbar-fade-enter-active,
.toolbar-fade-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.toolbar-fade-enter-from,
.toolbar-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .toolbar-fade-enter-active,
  .toolbar-fade-leave-active {
    transition: opacity 120ms linear;
  }

  .toolbar-fade-enter-from,
  .toolbar-fade-leave-to {
    transform: none;
  }
}
</style>



