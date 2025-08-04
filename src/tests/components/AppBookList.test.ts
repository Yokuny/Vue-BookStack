import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppBookList from '../../components/AppBookList.vue'

const mockFavoriteButton = {
  template: '<button class="favorite-btn" @click="$emit(\'toggle\')"></button>',
  props: ['isFavorite'],
  emits: ['toggle'],
}

describe('AppBookList', () => {
  const mockBooks = [
    {
      isbn: '1234567890123',
      name: 'Livro Teste 1',
      author: 'Autor Teste 1',
      stock: 10,
      isFavorite: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
    {
      isbn: '9876543210987',
      name: 'Livro Teste 2',
      author: 'Autor Teste 2',
      stock: 3,
      isFavorite: false,
      description: 'Descrição do livro',
    },
  ]

  const createWrapper = (books = mockBooks) => {
    return mount(AppBookList, {
      props: { books },
      global: {
        components: {
          FavoriteButton: mockFavoriteButton,
        },
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderização', () => {
    it('deve renderizar lista vazia quando não há livros', () => {
      const wrapper = createWrapper([])
      expect(wrapper.find('.books-grid').exists()).toBe(true)
      expect(wrapper.findAll('.book-item')).toHaveLength(0)
    })

    it('deve renderizar todos os livros fornecidos', () => {
      const wrapper = createWrapper()
      const bookItems = wrapper.findAll('.book-item')
      expect(bookItems).toHaveLength(2)
    })

    it('deve exibir informações corretas dos livros', () => {
      const wrapper = createWrapper()
      const firstBook = wrapper.find('.book-item')

      expect(firstBook.find('.book-name').text()).toBe('Livro Teste 1')
      expect(firstBook.find('.book-author').text()).toBe('por Autor Teste 1')
      expect(firstBook.find('.book-isbn').text()).toBe('ISBN: 1234567890123')
      expect(firstBook.find('.book-stock').text()).toBe('Estoque: 10')
    })

    it('deve aplicar classe low-stock quando estoque é menor que 5', () => {
      const wrapper = createWrapper()
      const secondBook = wrapper.findAll('.book-item')[1]
      const stockElement = secondBook.find('.book-stock')

      expect(stockElement.classes()).toContain('low-stock')
      expect(stockElement.text()).toBe('Estoque: 3')
    })

    it('deve renderizar FavoriteButton', () => {
      const wrapper = createWrapper()
      const favoriteButtons = wrapper.findAll('.favorite-btn')

      expect(favoriteButtons).toHaveLength(2)
    })
  })

  describe('Eventos', () => {
    it('deve emitir book-click ao clicar no item do livro', async () => {
      const wrapper = createWrapper()
      const firstBookItem = wrapper.find('.book-item')

      await firstBookItem.trigger('click')

      expect(wrapper.emitted('book-click')).toBeTruthy()
      expect(wrapper.emitted('book-click')![0]).toEqual([mockBooks[0]])
    })

    it('deve emitir toggle-favorite ao clicar no botão de favorito', async () => {
      const wrapper = createWrapper()
      const favoriteButtons = wrapper.findAll('.favorite-btn')

      await favoriteButtons[0].trigger('click')

      expect(wrapper.emitted('toggle-favorite')).toBeTruthy()
      expect(wrapper.emitted('toggle-favorite')![0]).toEqual(['1234567890123'])
    })

    it('deve emitir eventos corretos para diferentes livros', async () => {
      const wrapper = createWrapper()
      const bookItems = wrapper.findAll('.book-item')
      const favoriteButtons = wrapper.findAll('.favorite-btn')

      await bookItems[1].trigger('click')
      expect(wrapper.emitted('book-click')![0]).toEqual([mockBooks[1]])

      await favoriteButtons[1].trigger('click')
      expect(wrapper.emitted('toggle-favorite')![0]).toEqual(['9876543210987'])
    })
  })

  describe('Funcionalidades', () => {
    it('deve exibir indicador de clique', () => {
      const wrapper = createWrapper()
      const clickIndicators = wrapper.findAll('.click-indicator')

      expect(clickIndicators).toHaveLength(2)
      clickIndicators.forEach((indicator) => {
        expect(indicator.text()).toBe('Clique para ver detalhes →')
      })
    })

    it('deve ter estrutura correta dos elementos', () => {
      const wrapper = createWrapper()
      const bookItems = wrapper.findAll('.book-item')

      bookItems.forEach((item) => {
        expect(item.find('.book-content').exists()).toBe(true)
        expect(item.find('.book-info').exists()).toBe(true)
        expect(item.find('.book-details').exists()).toBe(true)
        expect(item.find('.click-indicator').exists()).toBe(true)
      })
    })
  })

  describe('Estados especiais', () => {
    it('deve lidar com livros sem descrição', () => {
      const booksWithoutDescription = [
        {
          isbn: '1234567890123',
          name: 'Livro Sem Descrição',
          author: 'Autor Teste',
          stock: 5,
          isFavorite: false,
          description: undefined,
        },
      ]

      const wrapper = createWrapper(booksWithoutDescription as any)
      const bookItem = wrapper.find('.book-item')

      expect(bookItem.find('.book-name').text()).toBe('Livro Sem Descrição')
      expect(bookItem.find('.book-author').text()).toBe('por Autor Teste')
    })

    it('deve lidar com livros sem datas', () => {
      const booksWithoutDates = [
        {
          isbn: '1234567890123',
          name: 'Livro Sem Datas',
          author: 'Autor Teste',
          stock: 5,
          isFavorite: false,
          description: undefined,
        },
      ]

      const wrapper = createWrapper(booksWithoutDates as any)
      const bookItem = wrapper.find('.book-item')

      expect(bookItem.find('.book-name').text()).toBe('Livro Sem Datas')
      expect(bookItem.exists()).toBe(true)
    })

    it('deve aplicar classe low-stock apenas quando estoque < 5', () => {
      const booksWithDifferentStock = [
        { ...mockBooks[0], stock: 5 },
        { ...mockBooks[1], stock: 4 },
        { ...mockBooks[0], isbn: '1111111111111', stock: 0 },
      ]

      const wrapper = createWrapper(booksWithDifferentStock)
      const bookItems = wrapper.findAll('.book-item')

      expect(bookItems[0].find('.book-stock').classes()).not.toContain('low-stock')
      expect(bookItems[1].find('.book-stock').classes()).toContain('low-stock')
      expect(bookItems[2].find('.book-stock').classes()).toContain('low-stock')
    })
  })
})
