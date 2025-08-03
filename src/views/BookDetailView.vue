<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookDetail } from '../composables/useBookDetail'
import { Button, Card, AppLayout } from '../components'

const route = useRoute()
const router = useRouter()
const { book, isLoading, error, fetchBookByIsbn } = useBookDetail()

const showDeleteConfirm = ref(false)
const isDeleting = ref(false)
const deleteError = ref<string | null>(null)

const loadBook = async () => {
  const isbn = route.params.isbn as string
  if (isbn) {
    await fetchBookByIsbn(isbn)
  }
}

const goBack = () => {
  router.push('/app')
}

const openDeleteConfirm = () => {
  showDeleteConfirm.value = true
  deleteError.value = null
}

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  deleteError.value = null
}

const handleDeleteBook = async () => {
  if (!book.value) return

  isDeleting.value = true
  deleteError.value = null

  try {
    const { useAuth } = await import('../composables/useAuth')
    const auth = useAuth()

    const res = await auth.makeAuthenticatedRequest(`/books/${book.value.isbn}`, 'DELETE')

    if (res.success) {
      // Fechar modal e redirecionar para lista
      closeDeleteConfirm()
      router.push('/app')
    } else {
      deleteError.value = res.message || 'Erro ao deletar livro'
    }
  } catch (err) {
    deleteError.value = 'Falha ao deletar livro. Tente novamente.'
  } finally {
    isDeleting.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  loadBook()
})

watch(
  () => route.params.isbn,
  () => {
    loadBook()
  },
)
</script>

<template>
  <AppLayout>
    <template #actions>
      <div v-if="book" class="book-actions">
        <Button @click="() => router.push(`/book/${book!.isbn}/edit`)" variant="system">
          Editar Livro
        </Button>
        <Button @click="openDeleteConfirm" variant="system" class="delete-btn">
          Deletar Livro
        </Button>
        <Button @click="goBack" variant="system">Voltar</Button>
      </div>
      <Button v-else @click="goBack" variant="system">Voltar</Button>
    </template>

    <Card>
      <div class="book-detail-section">
        <div v-if="error" class="message error-message">
          {{ error }}
          <Button @click="loadBook" variant="outline" class="retry-btn"> Tentar Novamente </Button>
        </div>

        <div v-if="isLoading" class="loading">
          <div class="loading-spinner"></div>
          <p>Carregando detalhes do livro...</p>
        </div>

        <div v-else-if="book" class="book-detail">
          <div class="book-header">
            <div class="title-container">
              <h1 class="book-title">{{ book.name }}</h1>
              <button
                v-if="book.isFavorite !== undefined"
                class="favorite-indicator"
                :class="{ 'favorite-active': book.isFavorite }"
                :title="book.isFavorite ? 'Livro favoritado' : 'Livro não favoritado'"
              >
                <span class="star-icon">★</span>
              </button>
            </div>
            <p class="book-author">por {{ book.author }}</p>
            <div v-if="book.description" class="book-description">
              <p>{{ book.description }}</p>
            </div>
          </div>

          <div class="book-info-grid">
            <div class="info-card">
              <h3 class="info-label">ISBN</h3>
              <p class="info-value">{{ book.isbn }}</p>
            </div>

            <div class="info-card">
              <h3 class="info-label">Estoque</h3>
              <p class="info-value stock-value" :class="{ 'low-stock': book.stock < 5 }">
                {{ book.stock }} {{ book.stock === 1 ? 'unidade' : 'unidades' }}
              </p>
            </div>

            <div v-if="book.createdAt" class="info-card">
              <h3 class="info-label">Data de Cadastro</h3>
              <p class="info-value date-value">{{ formatDate(book.createdAt) }}</p>
            </div>

            <div v-if="book.updatedAt && book.updatedAt !== book.createdAt" class="info-card">
              <h3 class="info-label">Última Atualização</h3>
              <p class="info-value date-value">{{ formatDate(book.updatedAt) }}</p>
            </div>
          </div>
        </div>

        <div v-else-if="!isLoading && !error" class="not-found">
          <h2>Livro não encontrado</h2>
          <p>
            O livro com o ISBN fornecido não foi encontrado ou você não tem permissão para
            visualizá-lo.
          </p>
          <Button @click="goBack" variant="primary"> Voltar à Lista </Button>
        </div>
      </div>

      <div v-if="showDeleteConfirm" class="modal-overlay" @click="closeDeleteConfirm">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Confirmar Exclusão</h3>
            <button @click="closeDeleteConfirm" class="modal-close">×</button>
          </div>

          <div class="modal-body">
            <div v-if="deleteError" class="message error-message">
              {{ deleteError }}
            </div>

            <p class="confirm-text">
              Tem certeza que deseja excluir o livro
              <strong>"{{ book?.name }}"</strong>?
            </p>
          </div>

          <div class="modal-actions">
            <Button @click="closeDeleteConfirm" variant="system" :disabled="isDeleting">
              Cancelar
            </Button>
            <Button @click="handleDeleteBook" variant="system" :disabled="isDeleting">
              {{ isDeleting ? 'Deletando...' : 'Deletar' }}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </AppLayout>
</template>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  font-family: 'Whisper', cursive;
  font-weight: 400;
  font-style: normal;
  font-size: 2rem;
  margin: 0;
  text-align: center;
}

.book-detail-section {
  margin-top: 2rem;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.message {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.retry-btn {
  max-width: 200px;
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

.book-detail {
  background: #f9fafb;
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid #e5e7eb;
}

.book-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.book-title {
  font-family: 'Whisper', cursive;
  font-size: 3rem;
  font-weight: 400;
  margin: 0;
  color: #1f2937;
  line-height: 1.2;
}

.favorite-indicator {
  background: none;
  border: none;
  cursor: default;
  padding: 0.5rem;
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.favorite-indicator .star-icon {
  font-size: 2rem;
  color: #d1d5db;
  transition: color 0.2s ease;
  user-select: none;
}

.favorite-indicator.favorite-active .star-icon {
  color: #fbbf24;
}

.book-author {
  font-size: 1.25rem;
  color: #6b7280;
  margin: 0;
  font-style: italic;
}

.book-description {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  text-align: left;
}

.book-description p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #374151;
  margin: 0;
}

.book-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #d1d5db;
  text-align: center;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.stock-value.low-stock {
  color: #dc2626;
}

.date-value {
  font-size: 1.125rem;
}

.book-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  line-height: 1;
}

.modal-close:hover {
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
}

.confirm-text {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: #374151;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
}

.delete-confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.not-found {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.not-found h2 {
  font-size: 1.875rem;
  margin-bottom: 1rem;
  color: #374151;
}

.not-found p {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .book-title {
    font-size: 2rem;
  }

  .book-detail {
    padding: 1.5rem;
  }

  .book-info-grid {
    grid-template-columns: 1fr;
  }

  .book-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
