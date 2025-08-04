import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onMounted: vi.fn(),
  }
})

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

describe('useBooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Estado Inicial', () => {
    it('deve ter estado inicial correto', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { books, pagination, isLoading, currentSearch } = useBooks()

      expect(books.value).toEqual([])
      expect(currentSearch.value).toBe('')
      expect(isLoading.value).toBe(false)
      expect(pagination.value).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
      })
    })
  })

  describe('fetchBooks - Sucesso', () => {
    it('deve buscar livros com sucesso', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { books, pagination, fetchBooks } = useBooks()

      const mockResponse = {
        success: true,
        data: {
          books: [
            {
              isbn: '9783161484100',
              name: 'Livro 1',
              author: 'Autor 1',
              stock: 10,
              isFavorite: false,
            },
            {
              isbn: '9783161484101',
              name: 'Livro 2',
              author: 'Autor 2',
              stock: 5,
              isFavorite: true,
            },
          ],
          pagination: {
            currentPage: 1,
            totalPages: 3,
            totalCount: 25,
            hasNextPage: true,
            hasPrevPage: false,
          },
        },
      }

      mockMakeAuthenticatedRequest.mockResolvedValue(mockResponse)

      await fetchBooks(1, 10, '')

      expect(books.value).toEqual(mockResponse.data.books)
      expect(pagination.value.currentPage).toBe(1)
      expect(pagination.value.totalPages).toBe(3)
      expect(pagination.value.totalCount).toBe(25)
      expect(pagination.value.limit).toBe(10)
      expect(pagination.value.hasNextPage).toBe(true)
      expect(pagination.value.hasPrevPage).toBe(false)
    })

    it('deve buscar livros com paginação customizada', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { fetchBooks } = useBooks()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: {
          books: [],
          pagination: {
            currentPage: 2,
            totalPages: 5,
            totalCount: 50,
            hasNextPage: true,
            hasPrevPage: true,
          },
        },
      })

      await fetchBooks(2, 15, '')

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books?page=2&limit=15', 'GET')
    })

    it('deve buscar livros com termo de pesquisa', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { fetchBooks, currentSearch } = useBooks()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: {
          books: [
            {
              isbn: '9783161484100',
              name: 'JavaScript: The Good Parts',
              author: 'Douglas Crockford',
              stock: 3,
              isFavorite: false,
            },
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
      })

      await fetchBooks(1, 10, 'JavaScript')

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith(
        '/books?page=1&limit=10&search=JavaScript',
        'GET',
      )
    })

    it('deve converter currentPage string para number', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { pagination, fetchBooks } = useBooks()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: {
          books: [],
          pagination: {
            currentPage: '3',
            totalPages: 5,
            totalCount: 50,
            hasNextPage: true,
            hasPrevPage: true,
          },
        },
      })

      await fetchBooks(3, 10, '')

      expect(pagination.value.currentPage).toBe(3)
      expect(typeof pagination.value.currentPage).toBe('number')
    })

    it('deve buscar lista vazia sem erro', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { books, fetchBooks } = useBooks()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: {
          books: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
      })

      await fetchBooks()

      expect(books.value).toEqual([])
      expect(mockShowError).not.toHaveBeenCalled()
    })
  })

  describe('fetchBooks - Falhas', () => {
    it('deve tratar erro do servidor', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { books, fetchBooks } = useBooks()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: false,
        message: 'Erro de autenticação',
      })

      await fetchBooks()

      expect(books.value).toEqual([])
      expect(mockShowError).toHaveBeenCalledWith('Erro de autenticação')
    })

    it('deve usar mensagem padrão quando não há mensagem de erro', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { fetchBooks } = useBooks()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: false,
      })

      await fetchBooks()

      expect(mockShowError).toHaveBeenCalledWith('Erro ao carregar livros')
    })

    it('deve tratar exceções de rede', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { fetchBooks, isLoading } = useBooks()

      mockMakeAuthenticatedRequest.mockRejectedValue(new Error('Network error'))

      await fetchBooks()

      expect(isLoading.value).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Falha ao carregar livros. Tente novamente.')
    })

    it('deve tratar resposta sem dados', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { fetchBooks } = useBooks()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: null,
      })

      await fetchBooks()

      expect(mockShowError).toHaveBeenCalledWith('Erro ao carregar livros')
    })
  })

  describe('Navegação de Páginas', () => {
    it('deve ir para página específica', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { goToPage, pagination } = useBooks()

      pagination.value.totalPages = 5

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: {
          books: [],
          pagination: {
            currentPage: 3,
            totalPages: 5,
            totalCount: 50,
            hasNextPage: true,
            hasPrevPage: true,
          },
        },
      })

      goToPage(3)

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books?page=3&limit=10', 'GET')
    })

    it('não deve ir para página inválida (menor que 1)', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { goToPage } = useBooks()

      goToPage(0)

      expect(mockMakeAuthenticatedRequest).not.toHaveBeenCalled()
    })

    it('não deve ir para página inválida (maior que totalPages)', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { goToPage, pagination } = useBooks()

      pagination.value.totalPages = 3

      goToPage(5)

      expect(mockMakeAuthenticatedRequest).not.toHaveBeenCalled()
    })

    it('deve ir para próxima página', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { nextPage, pagination } = useBooks()

      pagination.value.currentPage = 2
      pagination.value.totalPages = 5
      pagination.value.hasNextPage = true

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { books: [], pagination: {} },
      })

      nextPage()

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books?page=3&limit=10', 'GET')
    })

    it('não deve ir para próxima página quando não há próxima', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { nextPage, pagination } = useBooks()

      pagination.value.hasNextPage = false

      nextPage()

      expect(mockMakeAuthenticatedRequest).not.toHaveBeenCalled()
    })

    it('deve ir para página anterior', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { prevPage, pagination } = useBooks()

      pagination.value.currentPage = 3
      pagination.value.totalPages = 5
      pagination.value.hasPrevPage = true

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { books: [], pagination: {} },
      })

      prevPage()

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books?page=2&limit=10', 'GET')
    })

    it('não deve ir para página anterior quando não há anterior', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { prevPage, pagination } = useBooks()

      pagination.value.hasPrevPage = false

      prevPage()

      expect(mockMakeAuthenticatedRequest).not.toHaveBeenCalled()
    })
  })

  describe('Busca e Filtros', () => {
    it('deve buscar livros por termo', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { searchBooks, currentSearch } = useBooks()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { books: [], pagination: {} },
      })

      searchBooks('Vue.js')

      expect(currentSearch.value).toBe('Vue.js')
      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith(
        '/books?page=1&limit=10&search=Vue.js',
        'GET',
      )
    })

    it('deve limpar busca', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { clearSearch, currentSearch, searchBooks } = useBooks()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { books: [], pagination: {} },
      })

      searchBooks('teste')
      expect(currentSearch.value).toBe('teste')

      clearSearch()

      expect(currentSearch.value).toBe('')
      expect(mockMakeAuthenticatedRequest).toHaveBeenLastCalledWith('/books?page=1&limit=10', 'GET')
    })

    it('deve buscar com termo vazio', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { searchBooks } = useBooks()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { books: [], pagination: {} },
      })

      searchBooks('')

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books?page=1&limit=10', 'GET')
    })

    it('deve buscar com caracteres especiais', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { searchBooks } = useBooks()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { books: [], pagination: {} },
      })

      searchBooks('C++ & JavaScript')

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith(
        '/books?page=1&limit=10&search=C%2B%2B+%26+JavaScript',
        'GET',
      )
    })
  })

  describe('Mudança de Limite', () => {
    it('deve alterar limite e voltar para página 1', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { changeLimit, pagination } = useBooks()

      pagination.value.currentPage = 3

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { books: [], pagination: {} },
      })

      changeLimit(25)

      expect(pagination.value.limit).toBe(25)
      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books?page=1&limit=25', 'GET')
    })

    it('deve manter busca atual ao alterar limite', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { changeLimit, currentSearch } = useBooks()

      currentSearch.value = 'JavaScript'

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { books: [], pagination: {} },
      })

      changeLimit(20)

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith(
        '/books?page=1&limit=20&search=JavaScript',
        'GET',
      )
    })
  })

  describe('Refresh', () => {
    it('deve recarregar página atual', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { refreshBooks, pagination, currentSearch } = useBooks()

      pagination.value.currentPage = 2
      pagination.value.limit = 15
      currentSearch.value = 'React'

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { books: [], pagination: {} },
      })

      refreshBooks()

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith(
        '/books?page=2&limit=15&search=React',
        'GET',
      )
    })
  })

  describe('Toggle Favorite', () => {
    it('deve marcar livro como favorito', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { toggleFavorite, books } = useBooks()

      books.value = [
        {
          isbn: '9783161484100',
          name: 'Livro Teste',
          author: 'Autor Teste',
          stock: 10,
          isFavorite: false,
        },
      ]

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { isFavorite: true },
      })

      const result = await toggleFavorite('9783161484100')

      expect(result.success).toBe(true)
      expect(books.value[0].isFavorite).toBe(true)
      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith(
        '/books/9783161484100/favorite',
        'PATCH',
      )
    })

    it('deve desmarcar livro como favorito', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { toggleFavorite, books } = useBooks()

      books.value = [
        {
          isbn: '9783161484100',
          name: 'Livro Teste',
          author: 'Autor Teste',
          stock: 10,
          isFavorite: true,
        },
      ]

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { isFavorite: false },
      })

      await toggleFavorite('9783161484100')

      expect(books.value[0].isFavorite).toBe(false)
    })

    it('não deve alterar estado se livro não for encontrado', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { toggleFavorite, books } = useBooks()

      books.value = [
        {
          isbn: '9783161484100',
          name: 'Livro Teste',
          author: 'Autor Teste',
          stock: 10,
          isFavorite: false,
        },
      ]

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { isFavorite: true },
      })

      await toggleFavorite('9999999999999')

      expect(books.value[0].isFavorite).toBe(false)
    })

    it('deve tratar erro ao favoritar', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { toggleFavorite } = useBooks()

      mockMakeAuthenticatedRequest.mockRejectedValue(new Error('Network error'))

      await expect(toggleFavorite('9783161484100')).rejects.toThrow('Network error')
      expect(mockShowError).toHaveBeenCalledWith('Erro ao favoritar livro. Tente novamente.')
    })
  })

  describe('Estados de Loading', () => {
    it('deve gerenciar loading durante fetchBooks', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { fetchBooks, isLoading } = useBooks()

      expect(isLoading.value).toBe(false)

      mockMakeAuthenticatedRequest.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true, data: { books: [], pagination: {} } }), 50),
          ),
      )

      const fetchPromise = fetchBooks()
      expect(isLoading.value).toBe(true)

      await fetchPromise
      expect(isLoading.value).toBe(false)
    })

    it('deve garantir loading false mesmo com erro', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { fetchBooks, isLoading } = useBooks()

      mockMakeAuthenticatedRequest.mockImplementation(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Error')), 50)),
      )

      const fetchPromise = fetchBooks()
      expect(isLoading.value).toBe(true)

      await fetchPromise
      expect(isLoading.value).toBe(false)
    })
  })

  describe('Integração e Fluxos Completos', () => {
    it('deve realizar fluxo completo de busca e paginação', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { searchBooks, nextPage, pagination } = useBooks()

      mockMakeAuthenticatedRequest.mockResolvedValueOnce({
        success: true,
        data: {
          books: [{ isbn: '1', name: 'Livro 1', author: 'Autor 1', stock: 1, isFavorite: false }],
          pagination: {
            currentPage: 1,
            totalPages: 3,
            totalCount: 30,
            hasNextPage: true,
            hasPrevPage: false,
          },
        },
      })

      await searchBooks('JavaScript')

      expect(pagination.value.currentPage).toBe(1)
      expect(pagination.value.hasNextPage).toBe(true)

      mockMakeAuthenticatedRequest.mockResolvedValueOnce({
        success: true,
        data: {
          books: [{ isbn: '2', name: 'Livro 2', author: 'Autor 2', stock: 2, isFavorite: false }],
          pagination: {
            currentPage: 2,
            totalPages: 3,
            totalCount: 30,
            hasNextPage: true,
            hasPrevPage: true,
          },
        },
      })

      nextPage()

      expect(mockMakeAuthenticatedRequest).toHaveBeenLastCalledWith(
        '/books?page=2&limit=10&search=JavaScript',
        'GET',
      )
    })

    it('deve manter consistência entre estados', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { searchBooks, changeLimit, currentSearch, pagination } = useBooks()

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { books: [], pagination: {} },
      })

      await searchBooks('React')
      expect(currentSearch.value).toBe('React')

      changeLimit(20)
      expect(currentSearch.value).toBe('React')
      expect(pagination.value.limit).toBe(20)
    })

    it('deve funcionar com múltiplos livros favoritos', async () => {
      const { useBooks } = await import('../../composables/useBooks')
      const { toggleFavorite, books } = useBooks()

      books.value = [
        { isbn: '1', name: 'Livro 1', author: 'Autor 1', stock: 1, isFavorite: false },
        { isbn: '2', name: 'Livro 2', author: 'Autor 2', stock: 2, isFavorite: false },
        { isbn: '3', name: 'Livro 3', author: 'Autor 3', stock: 3, isFavorite: true },
      ]

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        data: { isFavorite: true },
      })

      await toggleFavorite('1')
      await toggleFavorite('2')

      expect(books.value[0].isFavorite).toBe(true)
      expect(books.value[1].isFavorite).toBe(true)
      expect(books.value[2].isFavorite).toBe(true)
    })
  })
})
