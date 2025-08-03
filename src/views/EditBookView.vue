<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, Button, AppLayout, Input, Textarea } from '../components'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useBookDetail } from '../composables/useBookDetail'

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const { book, fetchBookByIsbn } = useBookDetail()

const bookData = ref({
  name: '',
  description: '',
  author: '',
  stock: 0,
  isFavorite: false,
})

const isLoading = ref(false)
const isLoadingBook = ref(true)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const clearMessages = () => {
  error.value = null
  success.value = null
}

const loadBookData = async () => {
  const isbn = route.params.isbn as string
  if (isbn) {
    isLoadingBook.value = true
    await fetchBookByIsbn(isbn)

    if (book.value) {
      bookData.value = {
        name: book.value.name,
        description: book.value.description || '',
        author: book.value.author,
        stock: book.value.stock,
        isFavorite: book.value.isFavorite || false,
      }
    }
    isLoadingBook.value = false
  }
}

const handleUpdateBook = async () => {
  if (!bookData.value.name || !bookData.value.author) {
    error.value = 'Por favor, preencha todos os campos obrigatórios'
    return
  }

  const isbn = route.params.isbn as string
  if (!isbn) {
    error.value = 'ISBN não encontrado'
    return
  }

  isLoading.value = true
  clearMessages()

  try {
    const res = await auth.makeAuthenticatedRequest(`/books/${isbn}`, 'PUT', bookData.value)

    if (res.success) {
      success.value = res.message || 'Livro atualizado com sucesso!'

      setTimeout(() => {
        router.push(`/book/${isbn}`)
      }, 1500)
    } else {
      error.value = res.message || 'Erro ao atualizar livro'
    }
  } catch {
    error.value = 'Falha ao atualizar livro. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

const handleBack = () => {
  const isbn = route.params.isbn as string
  router.push(`/book/${isbn}`)
}

onMounted(() => {
  loadBookData()
})
</script>

<template>
  <AppLayout>
    <template #actions>
      <Button @click="handleBack" variant="system">Voltar</Button>
    </template>

    <Card>
      <div class="form">
        <div class="form-group form-group-size">
          <h3 class="form-title">Editar Livro</h3>

          <div v-if="isLoadingBook" class="loading">
            <div class="loading-spinner"></div>
            <p>Carregando dados do livro...</p>
          </div>

          <template v-else-if="book">
            <div v-if="error" class="message error-message">
              {{ error }}
            </div>
            <div v-if="success" class="message success-message">
              {{ success }}
            </div>

            <div class="isbn-field input-size">
              <div class="isbn-header">
                <label class="isbn-label">ISBN:</label>
                <p class="isbn-note">O ISBN não pode ser alterado</p>
              </div>
              <input class="isbn-value" :value="book.isbn" disabled />
            </div>

            <Input
              v-model="bookData.name"
              label="Nome do Livro"
              type="text"
              placeholder="Digite o nome do livro"
              :disabled="isLoading"
              @input="clearMessages"
              required
              class="input-size"
            />

            <Input
              v-model="bookData.author"
              label="Autor"
              type="text"
              placeholder="Digite o nome do autor"
              :disabled="isLoading"
              @input="clearMessages"
              required
              class="input-size"
            />

            <Textarea
              v-model="bookData.description"
              label="Descrição"
              placeholder="Digite uma breve descrição do livro"
              :disabled="isLoading"
              @input="clearMessages"
              :rows="4"
              class="input-size"
            />

            <Input
              v-model="bookData.stock"
              label="Estoque"
              type="number"
              min="0"
              placeholder="0"
              :disabled="isLoading"
              @input="clearMessages"
              class="input-size"
            />

            <div class="input-group input-size">
              <div class="favorite-container">
                <button
                  type="button"
                  @click="bookData.isFavorite = !bookData.isFavorite"
                  class="favorite-btn"
                  :class="{ 'favorite-active': bookData.isFavorite }"
                  :disabled="isLoading"
                  :title="bookData.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                >
                  <span class="star-icon">★</span>
                </button>
                <span class="favorite-status">
                  {{ bookData.isFavorite ? 'Livro favoritado' : 'Livro não favoritado' }}
                </span>
              </div>
            </div>

            <Button
              class="input-size"
              @click="handleUpdateBook"
              variant="primary"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Atualizando...' : 'Atualizar Livro' }}
            </Button>
          </template>

          <div v-else class="error-state">
            <h4>Livro não encontrado</h4>
            <p>Não foi possível carregar os dados do livro para edição.</p>
            <Button @click="() => router.push('/app')" variant="primary"> Voltar à Lista </Button>
          </div>
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

.loading {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Estilos removidos - agora usando componentes AppInput e AppTextarea */

.isbn-field {
  margin-bottom: 1rem;
}

.isbn-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.isbn-label {
  font-weight: 500;
  color: #374151;
}

.isbn-note {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
  margin: 0;
}

.isbn-value {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  width: 100%;
  background-color: #f9fafb;
  cursor: not-allowed;
  color: #6b7280;
  font-family: inherit;
  font-size: 1rem;
}

.error-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.error-state h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #374151;
}

.error-state p {
  margin-bottom: 2rem;
  line-height: 1.6;
}

.logo {
  font-family: 'Whisper', cursive;
  font-weight: 400;
  font-style: normal;
  font-size: 2rem;
  margin: 0;
}

.favorite-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.favorite-container:hover {
  background: #f3f4f6;
}

.favorite-label {
  font-weight: 500;
  color: #374151;
  margin: 0;
  min-width: fit-content;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.favorite-btn:hover:not(:disabled) {
  background-color: rgba(59, 130, 246, 0.1);
  transform: scale(1.1);
}

.favorite-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.star-icon {
  font-size: 1.5rem;
  color: #d1d5db;
  transition: color 0.2s ease;
  user-select: none;
}

.favorite-btn.favorite-active .star-icon {
  color: #fbbf24;
}

.favorite-btn:hover:not(:disabled) .star-icon {
  color: #fbbf24;
}

.favorite-status {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
  flex: 1;
}

@media (max-width: 640px) {
  .book-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-title {
    font-size: 3rem;
  }

  .title-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .book-title {
    font-size: 2.5rem;
  }
}
</style>
