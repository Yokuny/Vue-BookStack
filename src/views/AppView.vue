<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useBooks } from '../composables/useBooks'
import {
  Button,
  Card,
  AppLayout,
  Input,
  BookList,
  ControlPanel,
  Loading,
  DisplayTitle,
  Text,
  Caption,
} from '../components'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuth()
const searchTerm = ref('')

const {
  books,
  pagination,
  isLoading: booksLoading,
  nextPage,
  prevPage,
  goToPage,
  changeLimit,
  searchBooks,
  clearSearch: clearBooksSearch,
  toggleFavorite,
} = useBooks()

const handleLogout = async () => {
  await auth.logout()
  router.push('/')
}

const handleSearch = () => {
  if (searchTerm.value.trim()) {
    searchBooks(searchTerm.value.trim())
  }
}

const clearSearch = () => {
  searchTerm.value = ''
  clearBooksSearch()
}

const handleToggleFavorite = async (isbn: string) => {
  try {
    await toggleFavorite(isbn)
  } catch (error) {
    console.error('Erro ao favoritar livro:', error)
  }
}

const getVisiblePages = () => {
  const current = pagination.value.currentPage
  const total = pagination.value.totalPages
  const delta = 2

  let start = Math.max(1, current - delta)
  let end = Math.min(total, current + delta)

  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4)
    } else {
      start = Math.max(1, end - 4)
    }
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
}
</script>

<template>
  <AppLayout>
    <template #actions>
      <Button @click="() => router.push('/add-book')" variant="system">Adicionar Livro</Button>
      <Button @click="handleLogout" variant="system">Sair</Button>
    </template>

    <Card>
      <div class="books-section">
        <DisplayTitle tag="h3" size="medium">Meus Livros</DisplayTitle>

        <div class="search-section">
          <div class="search-container">
            <Input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por nome, autor, ISBN ou descrição..."
              @keyup.enter="handleSearch"
            />
            <Button @click="clearSearch" variant="outline"> Limpar </Button>
            <Button @click="handleSearch" variant="primary"> Buscar </Button>
          </div>
          <div v-if="searchTerm" class="search-info">
            <Text size="sm" variant="secondary" italic>
              Buscando por: "<Text tag="strong" size="sm" variant="default">{{ searchTerm }}</Text>"
            </Text>
          </div>
        </div>

        <Loading v-if="booksLoading" message="Carregando livros..." />

        <div v-else-if="books.length === 0" class="no-books">
          <p>Nenhum livro encontrado, adicione mais livros a sua biblioteca.</p>
          <Button @click="() => router.push('/add-book')" variant="primary">
            Adicionar Primeiro Livro
          </Button>
        </div>

        <div v-else class="books-list">
          <ControlPanel class="books-controls-wrapper">
            <div class="items-per-page">
              <label for="limit-select">Itens por página:</label>
              <select
                id="limit-select"
                :value="pagination.limit"
                @change="changeLimit(parseInt(($event.target as HTMLSelectElement).value))"
                class="limit-select"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
              </select>
            </div>

            <div class="books-info">
              <Caption variant="muted">
                Mostrando {{ books.length }} de {{ pagination.totalCount }} livros
              </Caption>
            </div>
          </ControlPanel>

          <BookList
            :books="books"
            @book-click="(book) => router.push(`/book/${book.isbn}`)"
            @toggle-favorite="handleToggleFavorite"
          />

          <div class="pagination">
            <div class="pagination-controls">
              <Button @click="prevPage" :disabled="!pagination.hasPrevPage" variant="outline">
                ← Anterior
              </Button>

              <div class="page-numbers">
                <Button
                  v-for="page in getVisiblePages()"
                  :key="page"
                  @click="goToPage(page)"
                  :variant="page === pagination.currentPage ? 'primary' : 'outline'"
                  :disabled="page === pagination.currentPage"
                >
                  {{ page }}
                </Button>
              </div>

              <Button @click="nextPage" :disabled="!pagination.hasNextPage" variant="outline">
                Próxima →
              </Button>
            </div>

            <div class="pagination-info">
              Página {{ pagination.currentPage }} de {{ pagination.totalPages }} ({{
                pagination.totalCount
              }}
              livros total)
            </div>
          </div>
        </div>
      </div>
    </Card>
  </AppLayout>
</template>

<style scoped>
.search-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
}

.search-container {
  display: flex;
  gap: 1rem;
  align-items: baseline;
  max-width: 800px;
  margin: 0 auto;
}

.search-info {
  text-align: center;
  margin-top: 1rem;
}

.books-section {
  margin-top: 2rem;
  width: 100%;
}

.no-books {
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--color-text-secondary);
}

.books-list {
  max-width: 1000px;
  margin: 0 auto;
}

.books-controls-wrapper {
  margin-bottom: 2rem;
  justify-content: space-between;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.items-per-page label {
  font-weight: 500;
  color: var(--color-text);
}

.limit-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 0.375rem;
  background: var(--color-white);
  font-size: 0.875rem;
  cursor: pointer;
}

.limit-select:focus {
  outline: none;
  border-color: var(--color-focus);
  box-shadow: var(--shadow-focus);
}

.pagination {
  margin-top: 2rem;
  padding: 1.5rem;
  border-top: 1px solid var(--color-gray-200);
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-align: center;
}
</style>
