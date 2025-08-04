import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import EditBookView from '../views/EditBookView.vue'

const mockBook = ref({
  isbn: '1234567890123',
  name: 'Livro Editável',
  author: 'Autor Editável',
  description: 'Descrição',
  stock: 5,
  isFavorite: false,
})
const mockFetchBookByIsbn = vi.fn()
const mockShowSuccess = vi.fn()
const mockShowError = vi.fn()
const mockMakeAuthenticatedRequest = vi.fn()
const mockPush = vi.fn()
const mockRoute = { params: { isbn: '1234567890123' } }

vi.mock('../composables/useBookDetail', () => ({
  useBookDetail: () => ({
    book: mockBook,
    fetchBookByIsbn: mockFetchBookByIsbn,
  }),
}))

vi.mock('../composables/useToast', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}))

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({
    push: mockPush,
  }),
}))

vi.mock('../composables/useAuth', () => ({
  useAuth: () => ({
    makeAuthenticatedRequest: mockMakeAuthenticatedRequest,
  }),
}))

vi.mock('../components', () => ({
  Button: { template: '<button class="btn" @click="$emit(\'click\')"><slot /></button>' },
  Card: { template: '<div class="card"><slot /></div>' },
  AppLayout: { template: '<div class="layout"><slot name="actions" /><slot /></div>' },
  Input: {
    template: '<input class="input" />',
    props: ['modelValue', 'label', 'type', 'disabled', 'placeholder', 'required', 'min'],
  },
  Textarea: {
    template: '<textarea class="textarea" />',
    props: ['modelValue', 'label', 'disabled', 'placeholder', 'rows'],
  },
  ControlPanel: { template: '<div class="control-panel"><slot /></div>' },
  FavoriteButton: {
    template: '<button class="favorite-btn" @click="$emit(\'toggle\')"></button>',
    props: ['isFavorite', 'disabled'],
  },
  Loading: { template: '<div class="loading"><slot /></div>', props: ['message'] },
  DisplayTitle: { template: '<h3 class="title"><slot /></h3>' },
  Heading: { template: '<h4 class="heading"><slot /></h4>' },
  Text: { template: '<span class="text"><slot /></span>' },
  Caption: { template: '<span class="caption"><slot /></span>' },
}))

describe('EditBookView', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockBook.value = {
      isbn: '1234567890123',
      name: 'Livro Editável',
      author: 'Autor Editável',
      description: 'Descrição',
      stock: 5,
      isFavorite: false,
    }
    wrapper = mount(EditBookView, {
      global: {
        stubs: {
          'router-link': true,
          'router-view': true,
        },
      },
    })
  })

  it('deve renderizar o formulário de edição', () => {
    expect(wrapper.find('.title').text()).toBe('Editar Livro')
    expect(wrapper.find('.card').exists()).toBe(true)
  })

  it('deve carregar dados do livro ao montar', () => {
    expect(mockFetchBookByIsbn).toHaveBeenCalledWith('1234567890123')
    expect(wrapper.vm.bookData.name).toBe('Livro Editável')
  })

  it('deve mostrar erro se campos obrigatórios estiverem vazios', async () => {
    wrapper.vm.bookData.name = ''
    wrapper.vm.bookData.author = ''
    await wrapper.vm.handleUpdateBook()
    expect(mockShowError).toHaveBeenCalledWith('Por favor, preencha todos os campos obrigatórios')
    expect(mockMakeAuthenticatedRequest).not.toHaveBeenCalled()
  })

  it('deve mostrar erro se ISBN não for encontrado', async () => {
    wrapper.vm.bookData.name = 'Novo Nome'
    wrapper.vm.bookData.author = 'Novo Autor'
    const originalRoute = mockRoute.params.isbn
    mockRoute.params.isbn = ''
    await wrapper.vm.handleUpdateBook()
    expect(mockShowError).toHaveBeenCalledWith('ISBN não encontrado')
    expect(mockMakeAuthenticatedRequest).not.toHaveBeenCalled()
    mockRoute.params.isbn = originalRoute
  })

  it('deve atualizar livro com sucesso', async () => {
    wrapper.vm.bookData.name = 'Novo Nome'
    wrapper.vm.bookData.author = 'Novo Autor'
    mockMakeAuthenticatedRequest.mockResolvedValue({ success: true, message: 'Livro atualizado!' })
    await wrapper.vm.handleUpdateBook()
    await flushPromises()
    expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith(
      '/books/1234567890123',
      'PUT',
      wrapper.vm.bookData,
    )
    expect(mockShowSuccess).toHaveBeenCalledWith('Livro atualizado!')
    await new Promise((resolve) => setTimeout(resolve, 1600))
    expect(mockPush).toHaveBeenCalledWith('/book/1234567890123')
  })

  it('deve mostrar erro se API retornar falha ao atualizar', async () => {
    wrapper.vm.bookData.name = 'Novo Nome'
    wrapper.vm.bookData.author = 'Novo Autor'
    mockMakeAuthenticatedRequest.mockResolvedValue({ success: false, message: 'Erro ao atualizar' })
    await wrapper.vm.handleUpdateBook()
    expect(mockShowError).toHaveBeenCalledWith('Erro ao atualizar')
  })

  it('deve mostrar erro genérico se request falhar', async () => {
    wrapper.vm.bookData.name = 'Novo Nome'
    wrapper.vm.bookData.author = 'Novo Autor'
    mockMakeAuthenticatedRequest.mockRejectedValue(new Error('API Error'))
    await wrapper.vm.handleUpdateBook()
    expect(mockShowError).toHaveBeenCalledWith('Falha ao atualizar livro. Tente novamente.')
  })

  it('deve navegar para detalhes ao clicar em Voltar', async () => {
    const backButton = wrapper.findAll('.btn').find((btn: any) => btn.text().includes('Voltar'))
    await backButton.trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/book/1234567890123')
  })
})
