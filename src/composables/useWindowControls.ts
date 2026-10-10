import { onBeforeUnmount, onMounted, shallowRef } from "vue";
import { getCurrentWindow } from "@tauri-apps/api/window";

export type ResizeDirection =
  | "North"
  | "South"
  | "East"
  | "West"
  | "NorthEast"
  | "NorthWest"
  | "SouthEast"
  | "SouthWest";

export function useWindowControls() {
  const isAltPressed = shallowRef(false);
  let appWindow: ReturnType<typeof getCurrentWindow> | null = null;

  function currentWindow() {
    appWindow ??= getCurrentWindow();
    return appWindow;
  }

  async function startDragging() {
    await currentWindow().startDragging();
  }

  async function startResize(direction: ResizeDirection) {
    await currentWindow().startResizeDragging(direction);
  }

  async function minimize() {
    await currentWindow().minimize();
  }

  async function toggleMaximize() {
    await currentWindow().toggleMaximize();
  }

  async function close() {
    await currentWindow().close();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Alt") {
      isAltPressed.value = true;
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === "Alt") {
      isAltPressed.value = false;
    }
  }

  function handlePointerDown(event: PointerEvent) {
    if (!isAltPressed.value || event.button !== 0) {
      return;
    }

    const target = event.target;
    if (target instanceof HTMLElement && target.closest("button, input")) {
      return;
    }

    event.preventDefault();
    void startDragging();
  }

  function handleWindowBlur() {
    isAltPressed.value = false;
  }

  onMounted(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("pointerdown", handlePointerDown, true);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("blur", handleWindowBlur);
    window.removeEventListener("pointerdown", handlePointerDown, true);
  });

  return {
    isAltPressed,
    startDragging,
    startResize,
    minimize,
    toggleMaximize,
    close,
  };
}
