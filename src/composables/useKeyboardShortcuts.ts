import { onBeforeUnmount, onMounted } from "vue";
import type { ReaderShortcutActions } from "../types/pdf";

export function useKeyboardShortcuts(actions: ReaderShortcutActions) {
  function handleKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    const modifier = event.ctrlKey || event.metaKey;

    if (key === "escape") {
      actions.closeOverlay();
      return;
    }

    if (key === "f1" || (modifier && event.shiftKey && key === "p")) {
      event.preventDefault();
      actions.toggleCommands();
      return;
    }

    if (!modifier) {
      return;
    }

    if (key === "o") {
      event.preventDefault();
      actions.openFile();
      return;
    }

    if (key === "0") {
      event.preventDefault();
      actions.fitWidth();
      return;
    }

    if (key === "=" || key === "+") {
      event.preventDefault();
      actions.zoomIn();
      return;
    }

    if (key === "-" || key === "_") {
      event.preventDefault();
      actions.zoomOut();
    }
  }

  onMounted(() => window.addEventListener("keydown", handleKeyDown));
  onBeforeUnmount(() => window.removeEventListener("keydown", handleKeyDown));
}
