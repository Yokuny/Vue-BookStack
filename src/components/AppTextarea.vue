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
  color: #374151;
}

.required-mark {
  color: #dc2626;
  margin-left: 0.125rem;
}

.app-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  width: 100%;
  transition: border-color 0.2s ease-in-out;
  font-family: inherit;
  font-size: 1rem;
  background: #fff;
  resize: vertical;
  min-height: 100px;
}

.app-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.app-textarea.disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
  color: #6b7280;
}

.app-textarea::placeholder {
  color: #9ca3af;
}
</style>
