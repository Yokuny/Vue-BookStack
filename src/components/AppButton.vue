<template>
  <button
    :class="[
      'btn',
      {
        'button-outline': variant === 'outline',
        'button-primary': variant === 'primary',
        'button-system': variant === 'system',
      },
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'outline' | 'primary' | 'system'
}

defineProps<Props>()
defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  height: 2rem;
  padding: 1.2rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.button-outline {
  background-color: var(--base);
  border: 1px solid var(--color-border);
}

.button-outline:hover {
  background-color: var(--page-background);
}

.button-primary {
  border: 1px solid transparent;
  background-color: var(--page-background);
}

.button-primary:hover {
  background-color: var(--page-background-hover);
}

.button-system {
  height: 40px;
  background: var(--page-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.button-system:hover {
  border-color: var(--color-border-hover);
}
</style>
