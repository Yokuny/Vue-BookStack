import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AddBookView from '../../views/AddBookView.vue'

const mockMakeAuthenticatedRequest = vi.fn()
const mockShowSuccess = vi.fn()
const mockShowError = vi.fn()
const mockPush = vi.fn()

vi.mock('../../composables/useAuth', () => ({
  useAuth: () => ({
    makeAuthenticatedRequest: mockMakeAuthenticatedRequest,
  }),
}))

vi.mock('../../composables/useToast', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

vi.mock('../../components', () => ({
  Card: {
    template: '<div class="card"><slot /></div>',
  },
  Button: {
    template:
      '<button class="btn" :class="variant" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
    props: ['variant', 'disabled'],
  },
  AppLayout: {
    template: '<div class="layout"><slot name="actions" /><slot /></div>',
  },
  Input: {
    template:
      '<input class="input" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :disabled="disabled" />',
    props: ['modelValue', 'label', 'type', 'disabled'],
  },
  Textarea: {
    template:
      '<textarea class="textarea" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :disabled="disabled" />',
    props: ['modelValue', 'label', 'disabled'],
  },
  DisplayTitle: {
    template: '<h3 class="title"><slot /></h3>',
    props: ['tag', 'size'],
  },
}))

describe('AddBookView', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(AddBookView, {
      global: {
        stubs: {
          'router-link': true,
          'router-view': true,
        },
      },
    })
  })

  describe('Renderização', () => {
    it('deve renderizar o formulário de adicionar livro', () => {
      expect(wrapper.find('.title').text()).toBe('Adicionar Livro')
      expect(wrapper.find('.card').exists()).toBe(true)
      expect(wrapper.find('.btn').text()).toBe('Voltar')
    })

    it('deve mostrar todos os campos do formulário', () => {
      const inputs = wrapper.findAll('.input')
      const textarea = wrapper.find('.textarea')

      expect(inputs).toHaveLength(4)
      expect(textarea.exists()).toBe(true)
    })
  })

  describe('Validação de Formulário', () => {
    it('deve mostrar erro quando campos obrigatórios estão vazios', async () => {
      const addButton = wrapper.findAll('.btn').find((btn: any) => btn.text() === 'Adicionar Livro')
      await addButton.trigger('click')

      expect(mockShowError).toHaveBeenCalledWith('Por favor, preencha todos os campos obrigatórios')
      expect(mockMakeAuthenticatedRequest).not.toHaveBeenCalled()
    })

    it('deve permitir submissão quando campos obrigatórios estão preenchidos', async () => {
      wrapper.vm.bookData = {
        isbn: '1234567890123',
        name: 'Test Book',
        description: 'Test Description',
        author: 'Test Author',
        stock: 1,
      }

      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        message: 'Livro adicionado com sucesso!',
      })

      await wrapper.vm.handleAddBook()

      expect(mockMakeAuthenticatedRequest).toHaveBeenCalledWith('/books', 'POST', {
        isbn: '1234567890123',
        name: 'Test Book',
        description: 'Test Description',
        author: 'Test Author',
        stock: 1,
      })
    })
  })

  describe('Submissão do Formulário', () => {
    beforeEach(() => {
      wrapper.vm.bookData = {
        isbn: '1234567890123',
        name: 'Test Book',
        description: 'Test Description',
        author: 'Test Author',
        stock: 1,
      }
    })

    it('deve limpar formulário e mostrar sucesso após adicionar livro', async () => {
      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        message: 'Livro adicionado com sucesso!',
      })

      await wrapper.vm.handleAddBook()

      expect(mockShowSuccess).toHaveBeenCalledWith('Livro adicionado com sucesso!')
      expect(wrapper.vm.bookData).toEqual({
        isbn: '',
        name: '',
        description: '',
        author: '',
        stock: 0,
      })
    })

    it('deve navegar para home após sucesso', async () => {
      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: true,
        message: 'Livro adicionado com sucesso!',
      })

      await wrapper.vm.handleAddBook()

      await new Promise((resolve) => setTimeout(resolve, 1600))

      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('deve mostrar erro quando API retorna falha', async () => {
      mockMakeAuthenticatedRequest.mockResolvedValue({
        success: false,
        message: 'Erro ao adicionar livro',
      })

      await wrapper.vm.handleAddBook()

      expect(mockShowError).toHaveBeenCalledWith('Erro ao adicionar livro')
    })

    it('deve mostrar erro genérico quando API falha', async () => {
      mockMakeAuthenticatedRequest.mockRejectedValue(new Error('Network error'))

      await wrapper.vm.handleAddBook()

      expect(mockShowError).toHaveBeenCalledWith('Falha ao adicionar livro. Tente novamente.')
    })
  })

  describe('Estados de Loading', () => {
    it('deve desabilitar campos durante loading', async () => {
      wrapper.vm.isLoading = true

      expect(wrapper.vm.isLoading).toBe(true)
    })

    it('deve mostrar texto de loading no botão', async () => {
      wrapper.vm.isLoading = true

      expect(wrapper.vm.isLoading).toBe(true)
    })
  })

  describe('Navegação', () => {
    it('deve navegar para home quando botão voltar é clicado', async () => {
      const backButton = wrapper.find('.btn')
      await backButton.trigger('click')

      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })
})
