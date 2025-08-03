import { ref } from 'vue'
import { useAuth } from './useAuth'
import { useToast } from './useToast'
import type { Book } from './useBooks'

export const useBookDetail = () => {
  const auth = useAuth()
  const toast = useToast()
  const book = ref<Book | null>(null)
  const isLoading = ref(false)

  const fetchBookByIsbn = async (isbn: string) => {
    isLoading.value = true
    book.value = null

    try {
      const res = await auth.makeAuthenticatedRequest(`/books/${isbn}`, 'GET')

      if (res.success && res.data) {
        book.value = res.data
      } else {
        const errorMessage = res.message || 'Livro não encontrado'
        toast.showError(errorMessage)
      }
    } catch {
      const errorMessage = 'Falha ao carregar o livro. Tente novamente.'
      toast.showError(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  return {
    book,
    isLoading,
    fetchBookByIsbn,
  }
}
