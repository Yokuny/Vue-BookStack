<script setup lang="ts">
import { FavoriteButton } from './index'

interface Book {
  isbn: string
  name: string
  description?: string
  author: string
  stock: number
  isFavorite: boolean
  createdAt?: string
  updatedAt?: string
}

interface Props {
  books: Book[]
}

interface Emits {
  'book-click': [book: Book]
  'toggle-favorite': [isbn: string]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleBookClick = (book: Book) => {
  emit('book-click', book)
}

const handleToggleFavorite = (isbn: string) => {
  emit('toggle-favorite', isbn)
}
</script>

<template>
  <div class="books-grid">
    <div v-for="book in books" :key="book.isbn" class="book-item" @click="handleBookClick(book)">
      <div class="book-content">
        <div class="book-info">
          <h4 class="book-name">{{ book.name }}</h4>
          <p class="book-author">por {{ book.author }}</p>
          <div class="book-details">
            <span class="book-isbn">ISBN: {{ book.isbn }}</span>
            <span class="book-stock" :class="{ 'low-stock': book.stock < 5 }">
              Estoque: {{ book.stock }}
            </span>
          </div>
        </div>
        <FavoriteButton :is-favorite="book.isFavorite" @toggle="handleToggleFavorite(book.isbn)" />
      </div>
      <div class="click-indicator">Clique para ver detalhes →</div>
    </div>
  </div>
</template>

<style scoped>
.books-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.book-item {
  background: var(--base);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
}

.book-item:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.book-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.book-info {
  flex: 1;
  min-width: 0;
}

.book-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 1rem;
  color: var(--color-text);
  margin: 0 0 1rem 0;
  font-style: italic;
  opacity: 0.8;
}

.book-details {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  font-size: 0.875rem;
}

.book-isbn {
  color: var(--color-text);
  opacity: 0.7;
}

.book-stock {
  color: var(--color-text);
  font-weight: 500;
}

.book-stock.low-stock {
  color: var(--color-error);
  font-weight: 600;
}

.click-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-background-soft);
  color: var(--color-text);
  font-size: 0.75rem;
  text-align: center;
  padding: 0.5rem;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.2s ease;
  border-top: 1px solid var(--color-border);
}

.book-item:hover .click-indicator {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 640px) {
  .book-item {
    padding: 1rem;
  }

  .book-content {
    flex-direction: column;
    gap: 0.75rem;
  }

  .favorite-btn {
    align-self: flex-end;
  }

  .click-indicator {
    position: static;
    opacity: 1;
    transform: none;
    margin-top: 0.75rem;
    border-top: none;
    background: transparent;
    font-size: 0.8rem;
  }
}
</style>
