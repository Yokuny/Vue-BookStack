import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import BookDetailView from '../../views/BookDetailView.vue'

const mockBook = ref({
  isbn: '1234567890123',
  name: 'Livro Teste',
  author: 'Autor Teste',
  description: 'Descrição',
  stock: 2,
  isFavorite: true,
  createdAt: '2024-06-01T12:00:00Z',
  updatedAt: '2024-06-02T12:00:00Z',
})
const mockFetchBookByIsbn = vi.fn()
const mockShowSuccess = vi.fn()
const mockShowError = vi.fn()
const mockMakeAuthenticatedRequest = vi.fn()
const mockPush = vi.fn()
const mockRoute = { params: { isbn: '1234567890123' } }

vi.mock('../../composables/useBookDetail', () => ({
  useBookDetail: () => ({
    book: mockBook,
    isLoading: false,
    fetchBookByIsbn: mockFetchBookByIsbn,
  }),
}))

vi.mock('../../composables/useToast', () => ({
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

vi.mock('../../composables/useAuth', () => ({
  useAuth: () => ({
    makeAuthenticatedRequest: mockMakeAuthenticatedRequest,
  }),
}))

vi.mock('../../components', () => ({
  Button: { template: '<button class="btn" @click="$emit(\'click\')"><slot /></button>' },
  Card: { template: '<div class="card"><slot /></div>' },
  AppLayout: { template: '<div class="layout"><slot name=\"actions\" /><slot /></div>' },
  Modal: {
    template: '<div class="modal"><slot /><slot name="actions" /></div>',
    props: ['modelValue', 'title'],
  },
  Loading: { template: '<div class="loading"><slot /></div>', props: ['message'] },
  DisplayTitle: { template: '<h3 class="title"><slot /></h3>' },
  Heading: { template: '<h4 class="heading"><slot /></h4>' },
  Text: { template: '<span class="text"><slot /></span>' },
  Caption: { template: '<span class="caption"><slot /></span>' },
}))

describe('BookDetailView', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockBook.value = {
      isbn: '1234567890123',
      name: 'Livro Teste',
      author: 'Autor Teste',
      description: 'Descrição',
      stock: 2,
      isFavorite: true,
      createdAt: '2024-06-01T12:00:00Z',
      updatedAt: '2024-06-02T12:00:00Z',
    }
    wrapper = mount(BookDetailView, {
      global: {
        stubs: {
          'router-link': true,
          'router-view': true,
        },
      },
    })
  })

  it('deve renderizar detalhes do livro', () => {
    expect(wrapper.find('.title').text()).toBe('Livro Teste')
    expect(wrapper.find('.heading').text()).toContain('ISBN')
    expect(wrapper.find('.text').text()).toContain('Autor Teste')
  })

  it('deve chamar fetchBookByIsbn ao montar', () => {
    expect(mockFetchBookByIsbn).toHaveBeenCalledWith('1234567890123')
  })

  it('deve navegar para edição ao clicar em Editar', async () => {
    const editButton = wrapper.findAll('.btn').find((btn: any) => btn.text() === 'Editar')
    await editButton.trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/book/1234567890123/edit')
  })

  it('deve abrir e fechar modal de confirmação de exclusão', async () => {
    const deleteButton = wrapper.findAll('.btn').find((btn: any) => btn.text().includes('Deletar'))
    await deleteButton.trigger('click')
    expect(wrapper.vm.showDeleteConfirm).toBe(true)
    await wrapper.vm.closeDeleteConfirm()
    expect(wrapper.vm.showDeleteConfirm).toBe(false)
  })

  it('deve deletar livro com sucesso', async () => {
    wrapper.vm.showDeleteConfirm = true
    mockMakeAuthenticatedRequest.mockResolvedValue({ success: true, message: 'Livro deletado!' })
    await wrapper.vm.handleDeleteBook()
    await flushPromises()
    expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books/1234567890123', 'DELETE')
    expect(mockShowSuccess).toHaveBeenCalledWith('Livro deletado!')
    await new Promise((resolve) => setTimeout(resolve, 1100))
    expect(mockPush).toHaveBeenCalledWith('/app')
    expect(wrapper.vm.showDeleteConfirm).toBe(false)
  })

  it('deve mostrar erro se API retornar falha ao deletar', async () => {
    wrapper.vm.showDeleteConfirm = true
    mockMakeAuthenticatedRequest.mockResolvedValue({ success: false, message: 'Erro ao deletar' })
    await wrapper.vm.handleDeleteBook()
    expect(mockShowError).toHaveBeenCalledWith('Erro ao deletar')
  })

  it('deve mostrar erro genérico se request falhar', async () => {
    wrapper.vm.showDeleteConfirm = true
    mockMakeAuthenticatedRequest.mockRejectedValue(new Error('API Error'))
    await wrapper.vm.handleDeleteBook()
    expect(mockShowError).toHaveBeenCalledWith('Falha ao deletar livro. Tente novamente.')
  })

  it('deve navegar para lista ao clicar em Voltar', async () => {
    const backButton = wrapper.findAll('.btn').find((btn: any) => btn.text().includes('Voltar'))
    await backButton.trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/app')
  })

  it('deve formatar datas corretamente', () => {
    const date = wrapper.vm.formatDate('2024-06-01T12:00:00Z')
    expect(typeof date).toBe('string')
    expect(date).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })
})
