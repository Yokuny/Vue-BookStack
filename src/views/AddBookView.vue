<script setup lang="ts">
import { ref } from 'vue'
import { Card, Button, AppLayout, Input, Textarea } from '../components'
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
  } catch {
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
  <AppLayout>
    <template #actions>
      <Button @click="handleBack" variant="system">Voltar</Button>
    </template>

    <Card>
      <div class="form">
        <div class="form-group form-group-size">
          <h3 class="form-title">Adicionar Livro</h3>

          <div v-if="error" class="message error-message">
            {{ error }}
          </div>
          <div v-if="success" class="message success-message">
            {{ success }}
          </div>

          <Input
            v-model="bookData.isbn"
            label="ISBN"
            type="text"
            placeholder="Ex: 978-0-123456-47-2"
            :disabled="isLoading"
            @input="clearMessages"
            required
          />

          <Input
            v-model="bookData.name"
            label="Nome do Livro"
            type="text"
            placeholder="Digite o nome do livro"
            :disabled="isLoading"
            @input="clearMessages"
            required
          />

          <Input
            v-model="bookData.author"
            label="Autor"
            type="text"
            placeholder="Digite o nome do autor"
            :disabled="isLoading"
            @input="clearMessages"
            required
          />

          <Textarea
            v-model="bookData.description"
            label="Descrição"
            placeholder="Digite uma breve descrição do livro"
            :disabled="isLoading"
            @input="clearMessages"
            :rows="4"
          />

          <Input
            v-model="bookData.stock"
            label="Estoque"
            type="number"
            min="0"
            placeholder="0"
            :disabled="isLoading"
            @input="clearMessages"
          />

          <Button
            style="width: 100%"
            @click="handleAddBook"
            variant="primary"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Adicionando...' : 'Adicionar Livro' }}
          </Button>
        </div>
      </div>
    </Card>
  </AppLayout>
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
</style>
