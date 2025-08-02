import { ref, onMounted } from 'vue'
import { useAuth } from './useAuth'

export interface Book {
  isbn: string
  name: string
  description?: string
  author: string
  stock: number
  createdAt?: string
  updatedAt?: string
}

export interface BooksPagination {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface BooksResponse {
  books: Book[]
  pagination: BooksPagination
}

export const useBooks = () => {
  const auth = useAuth()
  const books = ref<Book[]>([])
  const pagination = ref<BooksPagination>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const clearError = () => {
    error.value = null
  }

  const fetchBooks = async (page: number = 1, limit: number = 10) => {
    isLoading.value = true
    clearError()

    try {
      const res = await auth.makeAuthenticatedRequest(`/books?page=${page}&limit=${limit}`, 'GET')

      if (res.success && res.data) {
        books.value = res.data.books

        pagination.value = {
          ...res.data.pagination,
          currentPage:
            typeof res.data.pagination.currentPage === 'string'
              ? parseInt(res.data.pagination.currentPage, 10)
              : res.data.pagination.currentPage,
          limit: limit,
        }
      } else {
        error.value = res.message || 'Erro ao carregar livros'
      }
    } catch (err) {
      error.value = 'Falha ao carregar livros. Tente novamente.'
    } finally {
      isLoading.value = false
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.value.totalPages) {
      fetchBooks(page, pagination.value.limit)
    }
  }

  const nextPage = () => {
    if (pagination.value.hasNextPage) {
      goToPage(pagination.value.currentPage + 1)
    }
  }

  const prevPage = () => {
    if (pagination.value.hasPrevPage) {
      goToPage(pagination.value.currentPage - 1)
    }
  }

  const refreshBooks = () => {
    fetchBooks(pagination.value.currentPage, pagination.value.limit)
  }

  const changeLimit = (newLimit: number) => {
    pagination.value.limit = newLimit
    fetchBooks(1, newLimit)
  }

  onMounted(() => {
    fetchBooks()
  })

  return {
    books,
    pagination,
    isLoading,
    error,
    clearError,
    fetchBooks,
    goToPage,
    nextPage,
    prevPage,
    refreshBooks,
    changeLimit,
  }
}
