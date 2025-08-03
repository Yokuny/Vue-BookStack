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
  padding: 1.2rem 1.6rem;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.button-outline {
  background-color: #fff;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 1.35rem 1.6rem;
  transition: border-color 0.2s ease-in-out;
}

.button-outline:hover {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.button-outline:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.button-primary {
  border: 1px solid transparent;
  padding: 1.35rem 1.6rem;
  background-color: var(--page-background);
}

.button-primary:hover {
  background-color: var(--page-background-hover);
}

.button-system {
  height: 40px;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.button-system:hover {
  background-color: var(--background-secondary);
}
</style>
