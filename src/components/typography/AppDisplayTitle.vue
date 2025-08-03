<template>
  <component :is="tag" :class="['display-title', sizeClass]">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'h1',
  size: 'large',
})

const sizeClass = computed(() => {
  return `display-title--${props.size}`
})
</script>

<script lang="ts">
import { computed } from 'vue'
</script>

<style scoped>
.display-title {
  font-family: 'Whisper', cursive;
  font-weight: 400;
  font-style: normal;
  margin: 0;
  line-height: 1.2;
  text-align: center;
}

.display-title--large {
  font-size: 4rem;
  margin-bottom: 2rem;
}

.display-title--medium {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.display-title--small {
  font-size: 2rem;
  margin-bottom: 1rem;
}

@media (max-width: 640px) {
  .display-title--large {
    font-size: 3rem;
  }

  .display-title--medium {
    font-size: 2.5rem;
  }

  .display-title--small {
    font-size: 1.75rem;
  }
}
</style>
