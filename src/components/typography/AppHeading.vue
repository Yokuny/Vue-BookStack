<template>
  <component :is="tag" :class="['heading', sizeClass, variantClass]">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'default' | 'secondary' | 'muted'
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'h2',
  size: 'md',
  variant: 'default',
})

const sizeClass = computed(() => {
  return `heading--${props.size}`
})

const variantClass = computed(() => {
  return `heading--${props.variant}`
})
</script>

<script lang="ts">
import { computed } from 'vue'
</script>

<style scoped>
.heading {
  margin: 0;
  line-height: 1.3;
  font-weight: 600;
}

.heading--xs {
  font-size: 0.875rem;
}

.heading--sm {
  font-size: 1rem;
}

.heading--md {
  font-size: 1.25rem;
}

.heading--lg {
  font-size: 1.5rem;
}

.heading--xl {
  font-size: 1.875rem;
}

.heading--2xl {
  font-size: 2.25rem;
}

/* Variants */
.heading--default {
  color: var(--color-heading);
}

.heading--secondary {
  color: var(--color-text);
}

.heading--muted {
  color: var(--color-text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 640px) {
  .heading--2xl {
    font-size: 1.875rem;
  }

  .heading--xl {
    font-size: 1.5rem;
  }

  .heading--lg {
    font-size: 1.25rem;
  }
}
</style>
