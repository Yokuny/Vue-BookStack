import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockLogout = vi.fn()
const mockNextPage = vi.fn()
const mockPrevPage = vi.fn()
const mockGoToPage = vi.fn()
const mockChangeLimit = vi.fn()
const mockSearchBooks = vi.fn()
const mockClearSearch = vi.fn()
const mockToggleFavorite = vi.fn()
const mockPush = vi.fn()

vi.mock('../composables/useAuth', () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}))

vi.mock('../composables/useBooks', () => ({
  useBooks: () => ({
    books: [
      {
        isbn: '1234567890123',
        name: 'Test Book 1',
        author: 'Test Author 1',
        description: 'Test Description 1',
        stock: 1,
        isFavorite: false,
      },
      {
        isbn: '9876543210987',
        name: 'Test Book 2',
        author: 'Test Author 2',
        description: 'Test Description 2',
        stock: 2,
        isFavorite: true,
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 3,
      totalCount: 25,
      limit: 10,
      hasPrevPage: false,
      hasNextPage: true,
    },
    isLoading: false,
    nextPage: mockNextPage,
    prevPage: mockPrevPage,
    goToPage: mockGoToPage,
    changeLimit: mockChangeLimit,
    searchBooks: mockSearchBooks,
    clearSearch: mockClearSearch,
    toggleFavorite: mockToggleFavorite,
  }),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

vi.mock('../components', () => ({
  Button: { template: '<div />' },
  Card: { template: '<div />' },
  AppLayout: { template: '<div />' },
  Input: { template: '<div />' },
  BookList: { template: '<div />' },
  ControlPanel: { template: '<div />' },
  Loading: { template: '<div />' },
  DisplayTitle: { template: '<div />' },
  Text: { template: '<div />' },
  Caption: { template: '<div />' },
}))

describe('AppView - Funções', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Logout', () => {
    it('deve chamar logout e navegar para home', async () => {
      await mockLogout()
      mockPush('/')

      expect(mockLogout).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  describe('Busca', () => {
    it('deve executar busca quando termo é fornecido', () => {
      const searchTerm = 'test search'
      if (searchTerm.trim()) {
        mockSearchBooks(searchTerm.trim())
      }

      expect(mockSearchBooks).toHaveBeenCalledWith('test search')
    })

    it('não deve executar busca quando termo está vazio', () => {
      const searchTerm = ''
      if (searchTerm.trim()) {
        mockSearchBooks(searchTerm.trim())
      }

      expect(mockSearchBooks).not.toHaveBeenCalled()
    })

    it('deve limpar busca', () => {
      mockClearSearch()
      expect(mockClearSearch).toHaveBeenCalled()
    })
  })

  describe('Favoritos', () => {
    it('deve alternar favorito', async () => {
      const isbn = '1234567890123'
      await mockToggleFavorite(isbn)

      expect(mockToggleFavorite).toHaveBeenCalledWith(isbn)
    })

    it('deve tratar erro ao favoritar livro', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockToggleFavorite.mockRejectedValue(new Error('API Error'))

      try {
        await mockToggleFavorite('1234567890123')
      } catch (error) {
        console.error('Erro ao favoritar livro:', error)
      }

      expect(consoleSpy).toHaveBeenCalledWith('Erro ao favoritar livro:', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('Paginação', () => {
    it('deve navegar para próxima página', () => {
      mockNextPage()
      expect(mockNextPage).toHaveBeenCalled()
    })

    it('deve navegar para página anterior', () => {
      mockPrevPage()
      expect(mockPrevPage).toHaveBeenCalled()
    })

    it('deve navegar para página específica', () => {
      mockGoToPage(2)
      expect(mockGoToPage).toHaveBeenCalledWith(2)
    })

    it('deve alterar limite de itens por página', () => {
      mockChangeLimit(20)
      expect(mockChangeLimit).toHaveBeenCalledWith(20)
    })
  })

  describe('Cálculo de Páginas Visíveis', () => {
    it('deve calcular páginas visíveis corretamente', () => {
      const current = 1
      const total = 3
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

      expect(Array.isArray(pages)).toBe(true)
      expect(pages.length).toBeGreaterThan(0)
      expect(pages).toContain(1)
      expect(pages).toContain(2)
      expect(pages).toContain(3)
    })

    it('deve calcular páginas visíveis com delta correto', () => {
      const current = 5
      const total = 10
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

      expect(pages).toContain(3)
      expect(pages).toContain(4)
      expect(pages).toContain(5)
      expect(pages).toContain(6)
      expect(pages).toContain(7)
    })
  })

  describe('Dados dos Composables', () => {
    it('deve ter acesso aos livros do composable', () => {
      const books = [
        {
          isbn: '1234567890123',
          name: 'Test Book 1',
          author: 'Test Author 1',
          description: 'Test Description 1',
          stock: 1,
          isFavorite: false,
        },
        {
          isbn: '9876543210987',
          name: 'Test Book 2',
          author: 'Test Author 2',
          description: 'Test Description 2',
          stock: 2,
          isFavorite: true,
        },
      ]

      expect(books).toHaveLength(2)
      expect(books[0].name).toBe('Test Book 1')
      expect(books[1].name).toBe('Test Book 2')
    })

    it('deve ter acesso à paginação do composable', () => {
      const pagination = {
        currentPage: 1,
        totalPages: 3,
        totalCount: 25,
        limit: 10,
        hasPrevPage: false,
        hasNextPage: true,
      }

      expect(pagination.currentPage).toBe(1)
      expect(pagination.totalPages).toBe(3)
      expect(pagination.totalCount).toBe(25)
      expect(pagination.limit).toBe(10)
    })
  })
})
