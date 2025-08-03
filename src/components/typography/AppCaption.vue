<template>
  <component :is="tag" :class="['caption', variantClass, transformClass]">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: 'span' | 'div' | 'p' | 'label'
  variant?: 'default' | 'muted' | 'subtle' | 'hint'
  uppercase?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'span',
  variant: 'default',
  uppercase: false,
})

const variantClass = computed(() => {
  return `caption--${props.variant}`
})

const transformClass = computed(() => {
  return props.uppercase ? 'caption--uppercase' : ''
})
</script>

<script lang="ts">
import { computed } from 'vue'
</script>

<style scoped>
.caption {
  font-size: 0.75rem;
  line-height: 1.4;
  margin: 0;
}

.caption--default {
  color: var(--color-text);
  font-weight: 500;
}

.caption--muted {
  color: var(--color-text-secondary);
  font-weight: 400;
}

.caption--subtle {
  color: var(--color-text-muted);
  font-weight: 400;
}

.caption--hint {
  color: var(--color-text-muted);
  font-weight: 400;
  font-style: italic;
}

.caption--uppercase {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

@media (max-width: 640px) {
  .caption {
    font-size: 0.7rem;
  }
}
</style>
