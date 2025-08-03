<template>
  <component :is="tag" :class="['text', sizeClass, variantClass, weightClass]">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: 'p' | 'span' | 'div' | 'strong' | 'em'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'secondary' | 'muted' | 'accent'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  italic?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'p',
  size: 'md',
  variant: 'default',
  weight: 'normal',
  italic: false,
})

const sizeClass = computed(() => {
  return `text--${props.size}`
})

const variantClass = computed(() => {
  return `text--${props.variant}`
})

const weightClass = computed(() => {
  const classes = [`text--${props.weight}`]
  if (props.italic) classes.push('text--italic')
  return classes.join(' ')
})
</script>

<script lang="ts">
import { computed } from 'vue'
</script>

<style scoped>
.text {
  margin: 0;
  line-height: 1.6;
}

.text--xs {
  font-size: 0.75rem;
}

.text--sm {
  font-size: 0.875rem;
}

.text--md {
  font-size: 1rem;
}

.text--lg {
  font-size: 1.125rem;
}

.text--xl {
  font-size: 1.25rem;
}

.text--default {
  color: var(--color-text);
}

.text--secondary {
  color: var(--color-text-secondary);
}

.text--muted {
  color: var(--color-text-muted);
}

.text--accent {
  color: var(--color-focus);
}

.text--normal {
  font-weight: 400;
}

.text--medium {
  font-weight: 500;
}

.text--semibold {
  font-weight: 600;
}

.text--bold {
  font-weight: 700;
}

.text--italic {
  font-style: italic;
}
</style>
