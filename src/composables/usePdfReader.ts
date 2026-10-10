import { computed, shallowRef } from "vue";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { ZoomMode } from "../types/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const MIN_SCALE = 0.25;
const MAX_SCALE = 4;

export function usePdfReader() {
  const document = shallowRef<PDFDocumentProxy | null>(null);
  const fileName = shallowRef("");
  const pageCount = shallowRef(0);
  const isLoading = shallowRef(false);
  const error = shallowRef("");
  const zoomMode = shallowRef<ZoomMode>("fit");
  const fitScale = shallowRef(1);
  const manualScale = shallowRef(1);

  let loadSequence = 0;

  const renderScale = computed(() =>
    zoomMode.value === "fit" ? fitScale.value : manualScale.value,
  );

  const scaleLabel = computed(() =>
    zoomMode.value === "fit"
      ? "适配宽度"
      : `${Math.round(renderScale.value * 100)}%`,
  );

  function clampScale(value: number) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
  }

  function setFitScale(value: number) {
    fitScale.value = clampScale(value);
  }

  function zoomIn() {
    manualScale.value = clampScale(renderScale.value + 0.15);
    zoomMode.value = "manual";
  }

  function zoomOut() {
    manualScale.value = clampScale(renderScale.value - 0.15);
    zoomMode.value = "manual";
  }

  function fitWidth() {
    zoomMode.value = "fit";
  }

  async function loadFromBytes(bytes: Uint8Array, selectedName: string) {
    const sequence = ++loadSequence;
    isLoading.value = true;
    error.value = "";

    try {
      document.value?.destroy();
      const task = pdfjsLib.getDocument({ data: bytes });
      const nextDocument = await task.promise;

      if (sequence !== loadSequence) {
        await nextDocument.destroy();
        return;
      }

      document.value = nextDocument;
      fileName.value = selectedName;
      pageCount.value = nextDocument.numPages;
      zoomMode.value = "fit";
      manualScale.value = 1;
    } catch (loadError) {
      error.value = loadError instanceof Error ? loadError.message : "无法打开 PDF";
      document.value = null;
      pageCount.value = 0;
    } finally {
      if (sequence === loadSequence) {
        isLoading.value = false;
      }
    }
  }

  function clearError() {
    error.value = "";
  }

  return {
    document,
    fileName,
    pageCount,
    isLoading,
    error,
    zoomMode,
    fitScale,
    renderScale,
    scaleLabel,
    setFitScale,
    zoomIn,
    zoomOut,
    fitWidth,
    loadFromBytes,
    clearError,
  };
}
