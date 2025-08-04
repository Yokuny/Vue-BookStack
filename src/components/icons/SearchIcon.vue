<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="['search-icon', className]"
  >
    <path d="m21 21-4.34-4.34" />
    <circle cx="11" cy="11" r="8" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
  strokeWidth?: number | string
  className?: string
}

withDefaults(defineProps<Props>(), {
  size: 24,
  strokeWidth: 2,
  className: '',
})
</script>

<style scoped>
.search-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
