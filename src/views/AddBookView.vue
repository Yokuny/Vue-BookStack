<script setup lang="ts">
import { ref } from 'vue'
import { Card, Button } from '../components'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const auth = useAuth()

const bookData = ref({
  isbn: '',
  name: '',
  description: '',
  author: '',
  stock: 0,
})

const isLoading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const clearMessages = () => {
  error.value = null
  success.value = null
}

const handleAddBook = async () => {
  if (!bookData.value.isbn || !bookData.value.name || !bookData.value.author) {
    error.value = 'Por favor, preencha todos os campos obrigatórios'
    return
  }

  isLoading.value = true
  clearMessages()

  try {
    const res = await auth.makeAuthenticatedRequest('/books', 'POST', bookData.value)

    if (res.success) {
      success.value = res.message || 'Livro adicionado com sucesso!'
      bookData.value = {
        isbn: '',
        name: '',
        description: '',
        author: '',
        stock: 0,
      }

      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      error.value = res.message || 'Erro ao adicionar livro'
    }
  } catch (err) {
    error.value = 'Falha ao adicionar livro. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

const handleBack = () => {
  router.push('/')
}
</script>

<template>
  <Card>
    <template #header>
      <p class="logo">Book Stack</p>
      <div class="navigation-controls">
        <Button @click="handleBack" variant="system">Voltar</Button>
      </div>
    </template>

    <div class="form">
      <div class="form-group form-group-size">
        <h3 class="form-title">Adicionar Livro</h3>

        <div v-if="error" class="message error-message">
          {{ error }}
        </div>
        <div v-if="success" class="message success-message">
          {{ success }}
        </div>

        <div class="input-group input-size">
          <label>ISBN: *</label>
          <input
            v-model="bookData.isbn"
            type="text"
            placeholder="Ex: 978-0-123456-47-2"
            :disabled="isLoading"
            @input="clearMessages"
          />
        </div>

        <div class="input-group input-size">
          <label>Nome do Livro: *</label>
          <input
            v-model="bookData.name"
            type="text"
            placeholder="Digite o nome do livro"
            :disabled="isLoading"
            @input="clearMessages"
          />
        </div>

        <div class="input-group input-size">
          <label>Autor: *</label>
          <input
            v-model="bookData.author"
            type="text"
            placeholder="Digite o nome do autor"
            :disabled="isLoading"
            @input="clearMessages"
          />
        </div>

        <div class="input-group input-size">
          <label>Breve Descrição:</label>
          <textarea
            v-model="bookData.description"
            placeholder="Digite uma breve descrição do livro"
            :disabled="isLoading"
            @input="clearMessages"
            rows="4"
          />
        </div>

        <div class="input-group input-size">
          <label>Estoque:</label>
          <input
            v-model.number="bookData.stock"
            type="number"
            min="0"
            placeholder="0"
            :disabled="isLoading"
            @input="clearMessages"
          />
        </div>

        <Button class="input-size" @click="handleAddBook" variant="primary" :disabled="isLoading">
          {{ isLoading ? 'Adicionando...' : 'Adicionar Livro' }}
        </Button>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.form {
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  min-height: 50vh;
  height: 100%;
  padding: 1rem;
}

.form-title {
  font-family: 'Whisper', cursive;
  font-weight: 400;
  font-style: normal;
  font-size: 4rem;
  margin-bottom: 2rem;
}

.form-group-size {
  display: flex;
  align-items: center;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
}

.input-size {
  width: 100%;
}

.navigation-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.message {
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  width: 100%;
  text-align: center;
  font-weight: 500;
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.success-message {
  background-color: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.input-group input:disabled,
.input-group textarea:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-group input,
.input-group textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  width: 100%;
  transition: border-color 0.2s ease-in-out;
  font-family: inherit;
}

.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-group {
  margin-bottom: 1rem;
}

.input-group textarea {
  resize: vertical;
  min-height: 100px;
}
</style>
