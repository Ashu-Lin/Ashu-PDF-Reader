<script setup lang="ts">
import { computed, nextTick, shallowRef, useTemplateRef, watch } from "vue";

interface CommandItem {
  id: string;
  label: string;
  shortcut: string;
}

const props = defineProps<{
  open: boolean;
  items: CommandItem[];
}>();

const emit = defineEmits<{
  close: [];
  select: [id: string];
}>();

const query = shallowRef("");
const activeIndex = shallowRef(0);
const inputRef = useTemplateRef<HTMLInputElement>("command-input");

const filteredItems = computed(() => {
  const keyword = query.value.trim().toLowerCase();
  if (!keyword) {
    return props.items;
  }

  return props.items.filter((item) =>
    `${item.label} ${item.shortcut}`.toLowerCase().includes(keyword),
  );
});

watch(
  () => props.open,
  async (open) => {
    if (!open) {
      return;
    }

    query.value = "";
    activeIndex.value = 0;
    await nextTick();
    inputRef.value?.focus();
  },
);

watch(query, () => {
  activeIndex.value = 0;
});

function selectActive() {
  const item = filteredItems.value[activeIndex.value];
  if (item) {
    emit("select", item.id);
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    emit("close");
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeIndex.value = Math.min(activeIndex.value + 1, filteredItems.value.length - 1);
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    selectActive();
  }
}
</script>

<template>
  <Transition name="command-fade">
    <div v-if="props.open" class="command-overlay" @pointerdown.self="emit('close')">
      <section class="command-panel" aria-label="命令面板" @keydown="handleKeydown">
        <div class="command-search">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="9" cy="9" r="5" />
            <path d="M13 13l4 4" />
          </svg>
          <input
            ref="command-input"
            v-model="query"
            placeholder="搜索命令或输入快捷键"
            aria-label="搜索命令"
          />
        </div>

        <div v-if="filteredItems.length" class="command-list">
          <button
            v-for="(item, index) in filteredItems"
            :key="item.id"
            class="command-item"
            :class="{ active: index === activeIndex }"
            type="button"
            @mouseenter="activeIndex = index"
            @click="emit('select', item.id)"
          >
            <span>{{ item.label }}</span>
            <kbd>{{ item.shortcut }}</kbd>
          </button>
        </div>

        <p v-else class="command-empty">没有匹配的命令</p>
      </section>
    </div>
  </Transition>
</template>

<style scoped>
.command-overlay {
  position: fixed;
  z-index: 40;
  inset: 0;
  display: flex;
  justify-content: center;
  padding-top: 13vh;
  background: rgba(8, 10, 9, 0.58);
}

.command-panel {
  width: min(620px, calc(100% - 48px));
  align-self: flex-start;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 10px;
  color: #f4f2eb;
  background: var(--panel);
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.44);
}

.command-search {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.command-search svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: rgba(255, 255, 255, 0.42);
  stroke-linecap: round;
  stroke-width: 1.6;
}

.command-search input {
  width: 100%;
  border: 0;
  outline: 0;
  color: #f4f2eb;
  background: transparent;
  font-size: 15px;
}

.command-search input::placeholder {
  color: rgba(255, 255, 255, 0.42);
}

.command-list {
  max-height: 360px;
  overflow: auto;
  padding: 8px;
}

.command-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  width: 100%;
  min-height: 48px;
  padding: 8px 10px;
  border: 0;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.78);
  background: transparent;
  text-align: left;
}

.command-item.active {
  color: #161a17;
  background: var(--accent);
}

kbd {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 7px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 4px;
  color: inherit;
  background: rgba(255, 255, 255, 0.07);
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1;
}

.command-item.active kbd {
  border-color: rgba(0, 0, 0, 0.18);
  background: rgba(0, 0, 0, 0.08);
}

.command-empty {
  padding: 24px 18px;
  color: rgba(255, 255, 255, 0.54);
  font-size: 14px;
}

.command-fade-enter-active,
.command-fade-leave-active {
  transition: opacity 180ms ease;
}

.command-fade-enter-active .command-panel,
.command-fade-leave-active .command-panel {
  transition: transform 180ms ease;
}

.command-fade-enter-from,
.command-fade-leave-to {
  opacity: 0;
}

.command-fade-enter-from .command-panel,
.command-fade-leave-to .command-panel {
  transform: scale(0.985);
}

@media (prefers-reduced-motion: reduce) {
  .command-fade-enter-active,
  .command-fade-leave-active,
  .command-fade-enter-active .command-panel,
  .command-fade-leave-active .command-panel {
    transition: opacity 120ms linear;
  }

  .command-fade-enter-from .command-panel,
  .command-fade-leave-to .command-panel {
    transform: none;
  }
}
</style>

