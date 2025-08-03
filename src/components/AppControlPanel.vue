<template>
  <div class="control-panel" :class="{ 'control-panel-hover': hover }">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  hover?: boolean
}

withDefaults(defineProps<Props>(), {
  hover: true,
})
</script>

<style scoped>
.control-panel {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.control-panel-hover:hover {
  background: var(--color-background-mute);
}
</style>
