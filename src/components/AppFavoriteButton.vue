<template>
  <button
    type="button"
    @click.stop="handleClick"
    class="favorite-btn"
    :class="{ 'favorite-active': isFavorite }"
    :disabled="disabled"
    :title="title"
  >
    <span class="star-icon">★</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isFavorite: boolean
  disabled?: boolean
}

interface Emits {
  toggle: []
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<Emits>()

const title = computed(() => {
  return props.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
})

const handleClick = () => {
  if (!props.disabled) {
    emit('toggle')
  }
}
</script>

<style scoped>
.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  background-color: var(--color-background-soft);
}

.favorite-btn:hover:not(:disabled) {
  background-color: var(--color-background-mute);
  transform: scale(1.1);
}

.favorite-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.star-icon {
  font-size: 1.25rem;
  color: var(--background-white-hover);
  transition: color 0.2s ease;
  user-select: none;
}

.favorite-btn.favorite-active .star-icon {
  color: var(--color-warning);
}

.favorite-btn:hover:not(:disabled) .star-icon {
  color: var(--color-warning);
}
</style>
