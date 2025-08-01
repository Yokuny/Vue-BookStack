<template>
  <div class="switch-container">
    <div class="switch" @click="toggleSwitch">
      <span class="switch-option left" :class="{ active: !isRight }">
        {{ leftLabel }}
      </span>
      <span class="switch-option right" :class="{ active: isRight }">
        {{ rightLabel }}
      </span>
      <div class="switch-slider" :class="{ 'slide-right': isRight }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  leftLabel: string
  rightLabel: string
  modelValue?: boolean
}

interface Emits {
  'update:modelValue': [value: boolean]
  toggle: [value: boolean]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const emit = defineEmits<Emits>()

const isRight = computed(() => props.modelValue)

const toggleSwitch = () => {
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('toggle', newValue)
}
</script>

<style scoped>
.switch-container {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.switch {
  position: relative;
  width: 200px;
  height: 40px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.switch:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
}

.switch-option {
  position: relative;
  flex: 1;
  text-align: center;
  color: var(--color-text);
  opacity: 0.8;
  font-weight: 500;
  transition: all 0.3s ease;
  z-index: 2;
  padding: 0 10px;
  white-space: nowrap;
  font-size: 0.85rem;
}

.switch-option.active {
  opacity: 1;
  font-weight: 600;
}

.switch-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(50% - 2px);
  height: calc(100% - 4px);
  background: var(--page-background);
  border: 1px solid var(--color-border-hover);
  border-radius: 18px;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.switch-slider.slide-right {
  transform: translateX(100%);
}
</style>
