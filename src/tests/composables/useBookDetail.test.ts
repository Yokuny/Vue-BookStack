import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockMakeAuthenticatedRequest = vi.fn()
vi.mock('../../composables/useAuth', () => ({
  useAuth: () => ({
    makeAuthenticatedRequest: mockMakeAuthenticatedRequest,
  }),
}))

const mockShowError = vi.fn()
vi.mock('../../composables/useToast', () => ({
  useToast: () => ({
    showError: mockShowError,
  }),
}))

describe('useBookDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Estado Inicial', () => {
    it('deve ter estado inicial correto', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, isLoading } = useBookDetail()

      expect(book.value).toBe(null)
      expect(isLoading.value).toBe(false)
    })
  })

  describe('fetchBookByIsbn - Sucesso', () => {
    it('deve buscar livro com sucesso', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, isLoading, fetchBookByIsbn } = useBookDetail()

      const mockBook = {
        isbn: '9783161484100',
        name: 'Livro de Teste',
        description: 'Descrição do livro de teste',
        author: 'Autor Teste',
        stock: 10,
        isFavorite: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: mockBook,
      })

      await fetchBookByIsbn('9783161484100')

      expect(book.value).toEqual(mockBook)
      expect(isLoading.value).toBe(false)
      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books/9783161484100', 'GET')
    })

    it('deve limpar livro anterior antes de buscar novo', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, fetchBookByIsbn } = useBookDetail()

      book.value = {
        isbn: '1111111111111',
        name: 'Livro Antigo',
        author: 'Autor Antigo',
        stock: 5,
        isFavorite: true,
      }

      const newMockBook = {
        isbn: '9783161484100',
        name: 'Livro Novo',
        author: 'Autor Novo',
        stock: 15,
        isFavorite: false,
      }

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: newMockBook,
      })

      await fetchBookByIsbn('9783161484100')

      expect(book.value).toEqual(newMockBook)
    })

    it('deve processar livro sem campos opcionais', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, fetchBookByIsbn } = useBookDetail()

      const mockBook = {
        isbn: '9783161484100',
        name: 'Livro Simples',
        author: 'Autor Simples',
        stock: 1,
        isFavorite: false,
      }

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: mockBook,
      })

      await fetchBookByIsbn('9783161484100')

      expect(book.value).toEqual(mockBook)
      expect(book.value?.description).toBeUndefined()
      expect(book.value?.createdAt).toBeUndefined()
    })
  })

  describe('fetchBookByIsbn - Falhas', () => {
    it('deve tratar resposta de erro do servidor', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, isLoading, fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: false,
        message: 'Livro não encontrado',
      })

      await fetchBookByIsbn('9999999999999')

      expect(book.value).toBe(null)
      expect(isLoading.value).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Livro não encontrado')
    })

    it('deve usar mensagem padrão quando não há mensagem de erro', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: false,
      })

      await fetchBookByIsbn('9999999999999')

      expect(book.value).toBe(null)
      expect(mockShowError).toHaveBeenCalledWith('Livro não encontrado')
    })

    it('deve tratar resposta com success true mas sem data', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: null,
      })

      await fetchBookByIsbn('9783161484100')

      expect(book.value).toBe(null)
      expect(mockShowError).toHaveBeenCalledWith('Livro não encontrado')
    })

    it('deve tratar resposta com success true mas data undefined', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: undefined,
      })

      await fetchBookByIsbn('9783161484100')

      expect(book.value).toBe(null)
      expect(mockShowError).toHaveBeenCalledWith('Livro não encontrado')
    })

    it('deve tratar exceções de rede', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, isLoading, fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockRejectedValue(new Error('Network error'))

      await fetchBookByIsbn('9783161484100')

      expect(book.value).toBe(null)
      expect(isLoading.value).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Falha ao carregar o livro. Tente novamente.')
    })

    it('deve tratar erro de timeout', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockRejectedValue(new Error('Request timeout'))

      await fetchBookByIsbn('9783161484100')

      expect(book.value).toBe(null)
      expect(mockShowError).toHaveBeenCalledWith('Falha ao carregar o livro. Tente novamente.')
    })
  })

  describe('Estados de Loading', () => {
    it('deve gerenciar loading durante busca com sucesso', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { isLoading, fetchBookByIsbn } = useBookDetail()

      expect(isLoading.value).toBe(false)

      mockMakeAuthenticatedRequest.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true, data: {} }), 50)),
      )

      const fetchPromise = fetchBookByIsbn('9783161484100')
      expect(isLoading.value).toBe(true)

      await fetchPromise
      expect(isLoading.value).toBe(false)
    })

    it('deve gerenciar loading durante busca com erro', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { isLoading, fetchBookByIsbn } = useBookDetail()

      expect(isLoading.value).toBe(false)

      mockMakeAuthenticatedRequest.mockImplementation(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Error')), 50)),
      )

      const fetchPromise = fetchBookByIsbn('9783161484100')
      expect(isLoading.value).toBe(true)

      await fetchPromise
      expect(isLoading.value).toBe(false)
    })

    it('deve garantir que loading seja false mesmo com múltiplas chamadas', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { isLoading, fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { isbn: '123', name: 'Test', author: 'Author', stock: 1, isFavorite: false },
      })

      await Promise.all([
        fetchBookByIsbn('9783161484100'),
        fetchBookByIsbn('9783161484101'),
        fetchBookByIsbn('9783161484102'),
      ])

      expect(isLoading.value).toBe(false)
    })
  })

  describe('Diferentes ISBN Formats', () => {
    it('deve funcionar com ISBN-10', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { isbn: '0123456789', name: 'Test', author: 'Author', stock: 1, isFavorite: false },
      })

      await fetchBookByIsbn('0123456789')

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books/0123456789', 'GET')
    })

    it('deve funcionar com ISBN-13', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: {
          isbn: '9783161484100',
          name: 'Test',
          author: 'Author',
          stock: 1,
          isFavorite: false,
        },
      })

      await fetchBookByIsbn('9783161484100')

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books/9783161484100', 'GET')
    })

    it('deve funcionar com ISBN com hífens', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: {
          isbn: '978-3-16-148410-0',
          name: 'Test',
          author: 'Author',
          stock: 1,
          isFavorite: false,
        },
      })

      await fetchBookByIsbn('978-3-16-148410-0')

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books/978-3-16-148410-0', 'GET')
    })
  })

  describe('Cenários de Uso Real', () => {
    it('deve buscar livro favorito', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, fetchBookByIsbn } = useBookDetail()

      const favoriteBook = {
        isbn: '9783161484100',
        name: 'Meu Livro Favorito',
        description: 'Um livro incrível que eu amo',
        author: 'Autor Favorito',
        stock: 5,
        isFavorite: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T12:30:00Z',
      }

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: favoriteBook,
      })

      await fetchBookByIsbn('9783161484100')

      expect(book.value).toEqual(favoriteBook)
      expect(book.value?.isFavorite).toBe(true)
    })

    it('deve buscar livro com estoque baixo', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, fetchBookByIsbn } = useBookDetail()

      const lowStockBook = {
        isbn: '9783161484100',
        name: 'Livro Raro',
        author: 'Autor Exclusivo',
        stock: 1,
        isFavorite: false,
      }

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: lowStockBook,
      })

      await fetchBookByIsbn('9783161484100')

      expect(book.value?.stock).toBe(1)
    })

    it('deve buscar livro sem estoque', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, fetchBookByIsbn } = useBookDetail()

      const outOfStockBook = {
        isbn: '9783161484100',
        name: 'Livro Esgotado',
        author: 'Autor Popular',
        stock: 0,
        isFavorite: false,
      }

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: outOfStockBook,
      })

      await fetchBookByIsbn('9783161484100')

      expect(book.value?.stock).toBe(0)
    })

    it('deve buscar livro recém-criado', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, fetchBookByIsbn } = useBookDetail()

      const newBook = {
        isbn: '9783161484100',
        name: 'Livro Novo',
        description: 'Acabou de ser adicionado',
        author: 'Autor Estreante',
        stock: 100,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: newBook,
      })

      await fetchBookByIsbn('9783161484100')

      expect(book.value).toEqual(newBook)
      expect(book.value?.createdAt).toBeDefined()
      expect(book.value?.updatedAt).toBeDefined()
    })
  })

  describe('Integração com Auth', () => {
    it('deve usar o método de requisição autenticada correto', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { isbn: '123', name: 'Test', author: 'Author', stock: 1, isFavorite: false },
      })

      await fetchBookByIsbn('9783161484100')

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books/9783161484100', 'GET')
      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledTimes(1)
    })

    it('deve tratar erro de autenticação', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: false,
        message: 'Token expirado',
      })

      await fetchBookByIsbn('9783161484100')

      expect(book.value).toBe(null)
      expect(mockShowError).toHaveBeenCalledWith('Token expirado')
    })
  })

  describe('Casos Extremos', () => {
    it('deve funcionar com ISBN vazio', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: false,
        message: 'ISBN inválido',
      })

      await fetchBookByIsbn('')

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books/', 'GET')
      expect(mockShowError).toHaveBeenCalledWith('ISBN inválido')
    })

    it('deve funcionar com caracteres especiais no ISBN', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { fetchBookByIsbn } = useBookDetail()

      const specialIsbn = '978-3-16-148410-0@#$'

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: false,
        message: 'ISBN inválido',
      })

      await fetchBookByIsbn(specialIsbn)

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith(`/books/${specialIsbn}`, 'GET')
    })

    it('deve resetar estado corretamente a cada busca', async () => {
      const { useBookDetail } = await import('../../composables/useBookDetail')
      const { book, fetchBookByIsbn } = useBookDetail()

      mockMakeAuthenticatedRequest.mockResolvedValueOnce({
        success: true,
        data: { isbn: '111', name: 'Livro 1', author: 'Autor 1', stock: 1, isFavorite: false },
      })

      await fetchBookByIsbn('111')
      expect(book.value?.isbn).toBe('111')

      mockMakeAuthenticatedRequest.mockResolvedValueOnce({
        success: false,
        message: 'Não encontrado',
      })

      await fetchBookByIsbn('222')
      expect(book.value).toBe(null)
    })
  })
})
