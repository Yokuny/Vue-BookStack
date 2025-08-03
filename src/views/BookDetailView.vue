<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookDetail } from '../composables/useBookDetail'
import { useToast } from '../composables/useToast'
import { Button, Card, AppLayout, Modal, Loading, DisplayTitle, Heading, Text, Caption } from '../components'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { book, isLoading, fetchBookByIsbn } = useBookDetail()

const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

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
}

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
}

const handleDeleteBook = async () => {
  if (!book.value) return

  isDeleting.value = true

  try {
    const { useAuth } = await import('../composables/useAuth')
    const auth = useAuth()

    const res = await auth.makeAuthenticatedRequest(`/books/${book.value.isbn}`, 'DELETE')

    if (res.success) {
      toast.showSuccess(res.message || 'Livro deletado com sucesso!')
      closeDeleteConfirm()
      router.push('/app')
    } else {
      toast.showError(res.message || 'Erro ao deletar livro')
    }
  } catch {
    toast.showError('Falha ao deletar livro. Tente novamente.')
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
        <Loading v-if="isLoading" message="Carregando detalhes do livro..." />

        <div v-else-if="book" class="book-detail">
          <div class="book-header">
            <div class="title-container">
              <DisplayTitle tag="h1" size="medium">{{ book.name }}</DisplayTitle>
              <button
                v-if="book.isFavorite !== undefined"
                class="favorite-indicator"
                :class="{ 'favorite-active': book.isFavorite }"
                :title="book.isFavorite ? 'Livro favoritado' : 'Livro não favoritado'"
              >
                <span class="star-icon">★</span>
              </button>
            </div>
            <Text tag="p" size="lg" variant="secondary" italic>por {{ book.author }}</Text>
            <Text v-if="book.description" tag="div" size="lg" class="book-description">
              {{ book.description }}
            </Text>
          </div>

          <div class="book-info-grid">
            <div class="info-card">
              <Heading tag="h3" size="xs" variant="muted">ISBN</Heading>
              <Text tag="p" size="xl" weight="bold">{{ book.isbn }}</Text>
            </div>

            <div class="info-card">
              <Heading tag="h3" size="xs" variant="muted">Estoque</Heading>
              <Text tag="p" size="xl" weight="bold" :class="{ 'low-stock': book.stock < 5 }">
                {{ book.stock }} {{ book.stock === 1 ? 'unidade' : 'unidades' }}
              </Text>
            </div>

            <div v-if="book.createdAt" class="info-card">
              <Heading tag="h3" size="xs" variant="muted">Data de Cadastro</Heading>
              <Text tag="p" size="lg">{{ formatDate(book.createdAt) }}</Text>
            </div>

            <div v-if="book.updatedAt && book.updatedAt !== book.createdAt" class="info-card">
              <Heading tag="h3" size="xs" variant="muted">Última Atualização</Heading>
              <Text tag="p" size="lg">{{ formatDate(book.updatedAt) }}</Text>
            </div>
          </div>
        </div>

        <div v-else-if="!isLoading" class="not-found">
          <Heading tag="h2" size="xl">Livro não encontrado</Heading>
          <Text tag="p" size="lg">
            O livro com o ISBN fornecido não foi encontrado ou você não tem permissão para
            visualizá-lo.
          </Text>
          <Button @click="goBack" variant="primary"> Voltar à Lista </Button>
        </div>
      </div>

      <Modal v-model="showDeleteConfirm" title="Confirmar Exclusão" @close="closeDeleteConfirm">
        <Text tag="p" size="lg">
          Tem certeza que deseja excluir o livro
          <Text tag="strong" size="lg" weight="semibold">"{{ book?.name }}"</Text>?
        </Text>

        <template #actions>
          <Button @click="closeDeleteConfirm" variant="system" :disabled="isDeleting">
            Cancelar
          </Button>
          <Button @click="handleDeleteBook" variant="system" :disabled="isDeleting">
            {{ isDeleting ? 'Deletando...' : 'Deletar' }}
          </Button>
        </template>
      </Modal>
    </Card>
  </AppLayout>
</template>

<style scoped>
.book-detail-section {
  margin-top: 2rem;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.book-detail {
  background: var(--color-gray-50);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid var(--color-gray-200);
}

.book-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-gray-200);
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
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
  color: var(--color-gray-300);
  transition: color 0.2s ease;
  user-select: none;
}

.favorite-indicator.favorite-active .star-icon {
  color: var(--color-warning);
}

.book-description {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--color-white);
  border-radius: 0.75rem;
  border: 1px solid var(--color-gray-200);
  text-align: left;
}

.book-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.info-card {
  background: var(--color-white);
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-gray-300);
  text-align: center;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.low-stock {
  color: var(--color-error) !important;
}

.book-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.not-found {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
}

@media (max-width: 640px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
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
}
</style>
