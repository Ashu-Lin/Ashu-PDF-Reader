<script setup lang="ts">
import type { ResizeDirection } from "../../composables/useWindowControls";

const emit = defineEmits<{
  resize: [direction: ResizeDirection];
}>();

const directions: ResizeDirection[] = [
  "North",
  "South",
  "East",
  "West",
  "NorthEast",
  "NorthWest",
  "SouthEast",
  "SouthWest",
];
</script>

<template>
  <div class="resize-layer" aria-hidden="true">
    <button
      v-for="direction in directions"
      :key="direction"
      class="resize-zone"
      :class="`zone-${direction}`"
      type="button"
      tabindex="-1"
      @pointerdown.prevent="emit('resize', direction)"
    />
  </div>
</template>

<style scoped>
.resize-layer {
  position: fixed;
  z-index: 30;
  inset: 0;
  pointer-events: none;
}

.resize-zone {
  position: absolute;
  padding: 0;
  border: 0;
  background: transparent;
  pointer-events: auto;
}

.zone-North,
.zone-South {
  right: 10px;
  left: 10px;
  height: 6px;
  cursor: ns-resize;
}

.zone-North {
  top: 0;
}

.zone-South {
  bottom: 0;
}

.zone-East,
.zone-West {
  top: 10px;
  bottom: 10px;
  width: 6px;
  cursor: ew-resize;
}

.zone-East {
  right: 0;
}

.zone-West {
  left: 0;
}

.zone-NorthEast,
.zone-NorthWest,
.zone-SouthEast,
.zone-SouthWest {
  width: 14px;
  height: 14px;
}

.zone-NorthEast {
  top: 0;
  right: 0;
  cursor: nesw-resize;
}

.zone-NorthWest {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}

.zone-SouthEast {
  right: 0;
  bottom: 0;
  cursor: nwse-resize;
}

.zone-SouthWest {
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}
</style>

