<script setup lang="ts">
interface Props {
  modelValue: string | number
  label?: string
  type?: 'text' | 'password' | 'number' | 'email'
  placeholder?: string
  disabled?: boolean
  required?: boolean
  min?: string | number
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'input', event: Event): void
  (e: 'keyup', event: KeyboardEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<Emits>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
  emit('input', event)
}

const handleKeyup = (event: KeyboardEvent) => {
  emit('keyup', event)
}
</script>

<template>
  <div class="input-group">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      @input="handleInput"
      @keyup="handleKeyup"
      class="app-input"
      :class="{ disabled: disabled }"
    />
  </div>
</template>

<style scoped>
.input-group {
  margin-bottom: 1rem;
  width: 100%;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.required-mark {
  color: #dc2626;
  margin-left: 0.125rem;
}

.app-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 100%;
  transition: border-color 0.2s ease-in-out;
  font-family: inherit;
  font-size: 1rem;
  background: #fff;
}

.app-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.app-input.disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
  color: #6b7280;
}

.app-input::placeholder {
  color: #9ca3af;
}
</style>
