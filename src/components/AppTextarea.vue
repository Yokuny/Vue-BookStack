<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  rows?: number
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'input', event: Event): void
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  rows: 4,
})

const emit = defineEmits<Emits>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', event)
}
</script>

<template>
  <div class="textarea-group">
    <label v-if="label" class="textarea-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      @input="handleInput"
      class="app-textarea"
      :class="{ disabled: disabled }"
    />
  </div>
</template>

<style scoped>
.textarea-group {
  margin-bottom: 1rem;
  width: 100%;
}

.textarea-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.required-mark {
  color: var(--color-error);
  margin-left: 0.125rem;
}

.app-textarea {
  padding: 0.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 0.375rem;
  width: 100%;
  transition: border-color 0.2s ease-in-out;
  font-family: inherit;
  font-size: 1rem;
  background: var(--color-white);
  resize: vertical;
  min-height: 100px;
}

.app-textarea:focus {
  outline: none;
  border-color: var(--color-focus);
  box-shadow: var(--shadow-focus);
}

.app-textarea.disabled {
  background-color: var(--color-gray-50);
  cursor: not-allowed;
  color: var(--color-text-secondary);
}

.app-textarea::placeholder {
  color: var(--color-text-muted);
}
</style>
