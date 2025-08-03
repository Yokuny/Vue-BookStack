<template>
  <component :is="tag" class="brand-text">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p'
}

withDefaults(defineProps<Props>(), {
  tag: 'h1',
})
</script>

<style scoped>
.brand-text {
  font-family: 'Luckiest Guy', cursive;
  font-weight: 400;
  font-style: normal;
  font-size: 2rem;
  margin: 0;
  line-height: 1.2;
}

@media (max-width: 640px) {
  .brand-text {
    font-size: 1.5rem;
  }
}
</style>
