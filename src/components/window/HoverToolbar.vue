<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  fileName: string;
  scaleLabel: string;
}>();

const emit = defineEmits<{
  open: [];
  zoomIn: [];
  zoomOut: [];
  fitWidth: [];
  minimize: [];
  toggleMaximize: [];
  close: [];
  drag: [];
  doubleClick: [];
}>();

const title = computed(() => props.fileName || "未打开文件");
</script>

<template>
  <header
    class="hover-toolbar"
    @pointerdown="emit('drag')"
    @dblclick="emit('doubleClick')"
  >
    <div class="toolbar-file">
      <span class="drag-grip" aria-hidden="true">⋮⋮</span>
      <span class="toolbar-title">{{ title }}</span>
    </div>

    <div class="toolbar-actions" @pointerdown.stop>
      <button class="toolbar-button" type="button" aria-label="打开文件" @click="emit('open')">
        打开
      </button>
      <button class="toolbar-button icon-only" type="button" aria-label="缩小" @click="emit('zoomOut')">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10h10" /></svg>
      </button>
      <button class="toolbar-button" type="button" @click="emit('fitWidth')">
        {{ props.scaleLabel }}
      </button>
      <button class="toolbar-button icon-only" type="button" aria-label="放大" @click="emit('zoomIn')">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 5v10M5 10h10" /></svg>
      </button>
    </div>

    <div class="window-actions" @pointerdown.stop>
      <button class="window-button" type="button" aria-label="最小化" @click="emit('minimize')">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10h10" /></svg>
      </button>
      <button class="window-button" type="button" aria-label="最大化或还原" @click="emit('toggleMaximize')">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 6h8v8H6z" /></svg>
      </button>
      <button class="window-button close" type="button" aria-label="关闭" @click="emit('close')">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" /></svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.hover-toolbar {
  position: fixed;
  z-index: 20;
  top: 0;
  right: 0;
  left: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  height: var(--toolbar-height);
  padding: 0 12px;
  color: rgba(255, 255, 255, 0.84);
  background: rgba(15, 19, 17, 0.82);
  border-bottom: 1px solid var(--panel-line);
  backdrop-filter: blur(16px);
  user-select: none;
}

.toolbar-file {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

.drag-grip {
  color: rgba(255, 255, 255, 0.32);
  letter-spacing: 2px;
  transform: rotate(90deg);
}

.toolbar-title {
  overflow: hidden;
  color: rgba(255, 255, 255, 0.68);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.045);
}

.toolbar-button,
.window-button {
  display: inline-grid;
  place-items: center;
  min-width: 32px;
  height: 30px;
  padding: 0 9px;
  border: 0;
  border-radius: 5px;
  color: inherit;
  background: transparent;
  font-size: 12px;
}

.toolbar-button:hover,
.window-button:hover {
  background: rgba(255, 255, 255, 0.09);
}

.window-button.close:hover {
  color: #ffffff;
  background: rgba(216, 117, 117, 0.88);
}

.icon-only svg,
.window-button svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.window-actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

@media (max-width: 760px) {
  .hover-toolbar {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .window-actions {
    display: none;
  }
}
@media (max-width: 520px) {
  .hover-toolbar {
    grid-template-columns: 1fr;
  }

  .toolbar-file {
    display: none;
  }

  .toolbar-actions {
    justify-self: center;
  }
}
</style>


