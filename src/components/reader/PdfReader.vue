<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from "vue";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

const props = defineProps<{
  pdfDocument: PDFDocumentProxy | null;
  scale: number;
  isLoading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  (event: "fitScaleChange", scale: number): void;
  (event: "zoomIn"): void;
  (event: "zoomOut"): void;
}>();

const viewportRef = useTemplateRef<HTMLElement>("viewport");
const pages = shallowRef<PDFPageProxy[]>([]);
const renderTasks: Array<{ cancel: () => void }> = [];
let renderToken = 0;
let resizeFrame = 0;
let resizeObserver: ResizeObserver | null = null;
let lastWheelZoomAt = 0;

function clampScale(value: number) {
  return Math.min(4, Math.max(0.2, value));
}

async function updateFitScale() {
  const viewportElement = viewportRef.value;
  const firstPage = pages.value[0];

  if (!viewportElement || !firstPage) {
    return;
  }

  const baseViewport = firstPage.getViewport({ scale: 1 });
  const availableWidth = Math.max(120, viewportElement.clientWidth);
  emit("fitScaleChange", clampScale(availableWidth / baseViewport.width));
}

function scheduleFitScale() {
  window.cancelAnimationFrame(resizeFrame);
  resizeFrame = window.requestAnimationFrame(() => {
    void updateFitScale();
  });
}

function handleWheel(event: WheelEvent) {
  if (!(event.ctrlKey || event.metaKey) || pages.value.length === 0) {
    return;
  }

  event.preventDefault();

  const now = performance.now();
  if (now - lastWheelZoomAt < 70) {
    return;
  }

  lastWheelZoomAt = now;

  if (event.deltaY < 0) {
    emit("zoomIn");
    return;
  }

  emit("zoomOut");
}

function cancelRendering() {
  renderToken += 1;
  for (const task of renderTasks.splice(0)) {
    task.cancel();
  }
}

async function renderPages() {
  const viewportElement = viewportRef.value;
  if (!viewportElement || pages.value.length === 0) {
    return;
  }

  cancelRendering();
  const token = renderToken;
  await nextTick();

  const canvases = Array.from(
    viewportElement.querySelectorAll<HTMLCanvasElement>("canvas[data-page-number]"),
  );

  for (const canvas of canvases) {
    if (token !== renderToken) {
      return;
    }

    const pageNumber = Number(canvas.dataset.pageNumber);
    const page = pages.value.find((item) => item.pageNumber === pageNumber);

    if (!page) {
      continue;
    }

    const viewport = page.getViewport({ scale: props.scale });
    const outputScale = window.devicePixelRatio || 1;
    const pixelWidth = Math.floor(viewport.width * outputScale);
    const pixelHeight = Math.floor(viewport.height * outputScale);
    const cssWidth = `${Math.floor(viewport.width)}px`;
    const cssHeight = `${Math.floor(viewport.height)}px`;

    const stagingCanvas = document.createElement("canvas");
    stagingCanvas.width = pixelWidth;
    stagingCanvas.height = pixelHeight;
    const stagingContext = stagingCanvas.getContext("2d");

    if (!stagingContext) {
      continue;
    }

    const renderTask = page.render({
      canvas: stagingCanvas,
      viewport,
      transform:
        outputScale === 1
          ? undefined
          : [outputScale, 0, 0, outputScale, 0, 0],
    });

    renderTasks.push(renderTask);

    try {
      await renderTask.promise;
    } catch (renderError) {
      if (renderError instanceof Error && renderError.name === "RenderingCancelledException") {
        return;
      }

      throw renderError;
    }

    if (token !== renderToken) {
      return;
    }

    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    canvas.style.width = cssWidth;
    canvas.style.height = cssHeight;

    const context = canvas.getContext("2d");
    context?.drawImage(stagingCanvas, 0, 0);
  }
}

async function prepareDocument(pdfDocument: PDFDocumentProxy | null) {
  cancelRendering();
  pages.value = [];

  if (!pdfDocument) {
    return;
  }

  const nextPages: PDFPageProxy[] = [];
  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
    nextPages.push(await pdfDocument.getPage(pageNumber));
  }

  pages.value = nextPages;
  await nextTick();
  await updateFitScale();
  await nextTick();
  await renderPages();
}

watch(
  () => props.pdfDocument,
  (pdfDocument) => {
    void prepareDocument(pdfDocument);
  },
  { immediate: true },
);

watch(
  () => props.scale,
  () => {
    void renderPages();
  },
);

onMounted(() => {
  const viewportElement = viewportRef.value;
  if (viewportElement) {
    resizeObserver = new ResizeObserver(scheduleFitScale);
    resizeObserver.observe(viewportElement);
  }
});

onBeforeUnmount(() => {
  cancelRendering();
  resizeObserver?.disconnect();
  window.cancelAnimationFrame(resizeFrame);
});
</script>

<template>
  <section ref="viewport" class="pdf-reader" aria-label="PDF 阅读区" @wheel="handleWheel">
    <div v-if="props.error" class="reader-state reader-state-error">
      <strong>无法打开 PDF</strong>
      <span>{{ props.error }}</span>
      <kbd>Ctrl O</kbd>
    </div>

    <div v-else-if="props.isLoading && !props.pdfDocument" class="reader-state">
      <strong>正在打开 PDF</strong>
      <span>请稍候</span>
    </div>

    <div v-else-if="pages.length" class="reader-pages">
      <canvas
        v-for="page in pages"
        :key="page.pageNumber"
        class="pdf-page"
        :data-page-number="page.pageNumber"
        :aria-label="`第 ${page.pageNumber} 页`"
      />
    </div>

    <div v-else class="reader-state">
      <strong>等待文件</strong>
      <span>启动时会自动打开系统文件选择器</span>
    </div>
  </section>
</template>

<style scoped>
.pdf-reader {
  position: fixed;
  inset: 0;
  overflow: auto;
  background: linear-gradient(180deg, #151a18 0%, var(--desk) 100%);
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.reader-pages {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  width: 100%;
  min-width: 0;
  padding: 24px 0 40px;
}

.pdf-reader::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.pdf-page {
  display: block;
  flex: 0 0 auto;
  border: 1px solid var(--paper-edge);
  border-radius: 2px;
  background: var(--paper);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.24);
}

.reader-state {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  gap: 8px;
  padding: 40px;
  color: rgba(255, 255, 255, 0.68);
  text-align: center;
}

.reader-state strong {
  color: rgba(255, 255, 255, 0.88);
  font-size: 18px;
  font-weight: 650;
}

.reader-state span {
  font-size: 13px;
}

.reader-state-error strong {
  color: #f0b6b6;
}

.reader-state kbd {
  justify-self: center;
  margin-top: 10px;
  padding: 5px 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.76);
  background: rgba(255, 255, 255, 0.07);
  font-family: var(--mono);
  font-size: 12px;
}
</style>





