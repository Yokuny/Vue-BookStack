<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useBooks } from '../composables/useBooks'
import { Button, Card, AppLayout } from '../components'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuth()
const searchTerm = ref('')

const {
  books,
  pagination,
  isLoading: booksLoading,
  error: booksError,
  nextPage,
  prevPage,
  goToPage,
  changeLimit,
  searchBooks,
  clearSearch: clearBooksSearch,
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
        <h3 class="books-title">Meus Livros</h3>

        <div class="search-section">
          <div class="search-container">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por nome, autor, ISBN ou descrição..."
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <Button @click="handleSearch" variant="primary" class="search-btn"> Buscar </Button>
            <Button v-if="searchTerm" @click="clearSearch" variant="outline" class="clear-btn">
              Limpar
            </Button>
          </div>
          <div v-if="searchTerm" class="search-info">
            Buscando por: "<strong>{{ searchTerm }}</strong
            >"
          </div>
        </div>

        <div v-if="booksError" class="message error-message">
          {{ booksError }}
        </div>

        <div v-if="booksLoading" class="loading">
          <p>Carregando livros...</p>
        </div>

        <div v-else-if="books.length === 0" class="no-books">
          <p>Nenhum livro cadastrado ainda.</p>
          <Button
            @click="() => router.push('/add-book')"
            variant="primary"
            class="add-first-book-btn"
          >
            Adicionar Primeiro Livro
          </Button>
        </div>

        <div v-else class="books-list">
          <div class="books-controls">
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
              Mostrando {{ books.length }} de {{ pagination.totalCount }} livros
            </div>
          </div>

          <div class="books-grid">
            <div
              v-for="book in books"
              :key="book.isbn"
              class="book-item"
              @click="() => router.push(`/book/${book.isbn}`)"
            >
              <div class="book-info">
                <h4 class="book-name">{{ book.name }}</h4>
                <p class="book-author">por {{ book.author }}</p>
                <p class="book-details">
                  <span class="book-isbn">ISBN: {{ book.isbn }}</span>
                  <span class="book-stock">Estoque: {{ book.stock }}</span>
                </p>
              </div>
              <div class="click-indicator">Clique para ver detalhes →</div>
            </div>
          </div>

          <div class="pagination">
            <div class="pagination-controls">
              <Button
                @click="prevPage"
                :disabled="!pagination.hasPrevPage"
                variant="outline"
                class="pagination-btn"
              >
                ← Anterior
              </Button>

              <div class="page-numbers">
                <button
                  v-for="page in getVisiblePages()"
                  :key="page"
                  @click="goToPage(page)"
                  :class="['page-number', { active: page === pagination.currentPage }]"
                  :disabled="page === pagination.currentPage"
                >
                  {{ page }}
                </button>
              </div>

              <Button
                @click="nextPage"
                :disabled="!pagination.hasNextPage"
                variant="outline"
                class="pagination-btn"
              >
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
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.books-section {
  margin-top: 2rem;
  width: 100%;
}

.books-title {
  font-family: 'Whisper', cursive;
  font-weight: 400;
  font-style: normal;
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
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

.loading,
.no-books {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.add-first-book-btn {
  margin-top: 1rem;
}

.books-list {
  max-width: 1000px;
  margin: 0 auto;
}

.books-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.items-per-page label {
  font-weight: 500;
  color: #374151;
}

.limit-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
}

.limit-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.books-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.books-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.book-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.book-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.book-item:hover .click-indicator {
  opacity: 1;
}

.book-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.book-author {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
  font-style: italic;
}

.book-details {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
}

.book-isbn,
.book-stock {
  font-weight: 500;
}

.click-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.pagination {
  margin-top: 2rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.pagination-btn {
  min-width: 100px;
  font-weight: 500;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-number {
  min-width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-number:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.page-number.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.page-number:disabled {
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

.search-section {
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 2rem;
}

.search-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fff;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-btn,
.clear-btn {
  white-space: nowrap;
  min-width: 100px;
}

.search-info {
  text-align: center;
  margin-top: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
}

.search-info strong {
  color: #374151;
  font-weight: 600;
}

@media (max-width: 640px) {
  .search-container {
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-input {
    width: 100%;
  }

  .search-btn,
  .clear-btn {
    width: 100%;
  }
}
</style>
