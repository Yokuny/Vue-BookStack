import { ref } from 'vue'
import { useAuth } from './useAuth'
import type { Book } from './useBooks'

export const useBookDetail = () => {
  const auth = useAuth()
  const book = ref<Book | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const clearError = () => {
    error.value = null
  }

  const fetchBookByIsbn = async (isbn: string) => {
    isLoading.value = true
    clearError()
    book.value = null

    try {
      const res = await auth.makeAuthenticatedRequest(`/books/${isbn}`, 'GET')

      if (res.success && res.data) {
        book.value = res.data
      } else {
        error.value = res.message || 'Livro não encontrado'
      }
    } catch {
      error.value = 'Falha ao carregar o livro. Tente novamente.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    book,
    isLoading,
    error,
    clearError,
    fetchBookByIsbn,
  }
}
