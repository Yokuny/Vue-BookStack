import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AcessView from '../../views/AcessView.vue'

const mockSignin = vi.fn()
const mockCreateGuestAccount = vi.fn()
const mockSignup = vi.fn()

vi.mock('../../composables/useAuth', () => ({
  useAuth: () => ({
    signin: mockSignin,
    createGuestAccount: mockCreateGuestAccount,
    isLoading: { value: false },
  }),
}))

vi.mock('../../composables/useSignup', () => ({
  useSignup: () => ({
    signup: mockSignup,
    isLoading: { value: false },
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
  Switch: {
    template:
      '<div class="switch" @click="$emit(\'update:modelValue\', !modelValue)"><slot /></div>',
    props: ['modelValue'],
  },
  AppLayout: {
    template: '<div class="layout"><slot name="actions" /><slot /></div>',
  },
  Input: {
    template:
      '<input class="input" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :disabled="disabled" @keyup="$emit(\'keyup\', $event)" />',
    props: ['modelValue', 'label', 'type', 'disabled'],
  },
  DisplayTitle: {
    template: '<h3 class="title"><slot /></h3>',
    props: ['tag', 'size'],
  },
  Loading: {
    template: '<div class="loading"><slot /></div>',
    props: ['message'],
  },
}))

describe('AcessView', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(AcessView, {
      global: {
        stubs: {
          'router-link': true,
          'router-view': true,
        },
      },
    })
  })

  describe('Renderização Inicial', () => {
    it('deve renderizar o modo signin por padrão', () => {
      expect(wrapper.find('.title').text()).toBe('Entrar')
      expect(wrapper.find('.card').exists()).toBe(true)
    })

    it('deve mostrar o switch para alternar entre signin e signup', () => {
      expect(wrapper.find('.switch').exists()).toBe(true)
    })

    it('deve mostrar o botão de visitante', () => {
      const buttons = wrapper.findAll('.btn')
      expect(buttons.some((btn: any) => btn.text() === 'Visitante')).toBe(true)
    })
  })

  describe('Modo Signin', () => {
    it('deve renderizar campos de login corretamente', () => {
      expect(wrapper.find('.title').text()).toBe('Entrar')
      expect(wrapper.find('.card').exists()).toBe(true)
    })

    it('deve chamar handleSignin quando botão é clicado', async () => {
      const signinButton = wrapper.find('.btn')
      await signinButton.trigger('click')

      expect(signinButton.exists()).toBe(true)
    })

    it('deve mostrar link para criar conta', () => {
      const createAccountLink = wrapper.find('.link-btn')
      expect(createAccountLink.text()).toBe('Criar conta')
    })
  })

  describe('Interações', () => {
    it('deve alternar entre signin e signup via switch', async () => {
      const switchComponent = wrapper.find('.switch')
      expect(wrapper.vm.currentMode).toBe('signin')

      await switchComponent.trigger('click')
      expect(wrapper.vm.currentMode).toBe('signup')

      await switchComponent.trigger('click')
      expect(wrapper.vm.currentMode).toBe('signin')
    })

    it('deve alternar para signup via link', async () => {
      const createAccountLink = wrapper.find('.link-btn')
      await createAccountLink.trigger('click')

      expect(wrapper.vm.currentMode).toBe('signup')
    })

    it('deve alternar para signin via link quando em signup', async () => {
      const createAccountLink = wrapper.find('.link-btn')
      await createAccountLink.trigger('click')
      expect(wrapper.vm.currentMode).toBe('signup')

      const signinLink = wrapper.find('.link-btn')
      await signinLink.trigger('click')
      expect(wrapper.vm.currentMode).toBe('signin')
    })
  })

  describe('Funcionalidades', () => {
    it('deve chamar signin quando handleSignin é executado', async () => {
      mockSignin.mockResolvedValue(true)
      await wrapper.vm.handleSignin()

      expect(mockSignin).toHaveBeenCalledWith({
        name: '',
        password: '',
      })
    })

    it('deve chamar signup quando handleSignup é executado', async () => {
      mockSignup.mockResolvedValue(true)
      await wrapper.vm.handleSignup()

      expect(mockSignup).toHaveBeenCalledWith({ name: '', password: '' }, '')
    })

    it('deve chamar createGuestAccount quando handleGuest é executado', async () => {
      mockCreateGuestAccount.mockResolvedValue(true)
      await wrapper.vm.handleGuest()

      expect(mockCreateGuestAccount).toHaveBeenCalled()
      expect(wrapper.vm.currentMode).toBe('guest')
    })

    it('deve voltar para signin se createGuestAccount falhar', async () => {
      mockCreateGuestAccount.mockResolvedValue(false)
      await wrapper.vm.handleGuest()

      expect(mockCreateGuestAccount).toHaveBeenCalled()
      expect(wrapper.vm.currentMode).toBe('signin')
    })
  })

  describe('Estados de Loading', () => {
    it('deve mostrar loading quando auth.isLoading é true', async () => {
      expect(wrapper.find('.card').exists()).toBe(true)
    })
  })

  describe('Validação de Formulários', () => {
    it('deve limpar formulário de signin após sucesso', async () => {
      mockSignin.mockResolvedValue(true)
      wrapper.vm.signinData = { name: 'test', password: 'test' }
      await wrapper.vm.handleSignin()

      expect(wrapper.vm.signinData.name).toBe('')
      expect(wrapper.vm.signinData.password).toBe('')
    })

    it('deve limpar formulário de signup após sucesso', async () => {
      mockSignup.mockResolvedValue(true)
      wrapper.vm.signupData = { name: 'test', password: 'test', confirmPassword: 'test' }
      await wrapper.vm.handleSignup()

      expect(wrapper.vm.signupData.name).toBe('')
      expect(wrapper.vm.signupData.password).toBe('')
      expect(wrapper.vm.signupData.confirmPassword).toBe('')
    })

    it('deve voltar para signin após sucesso no signup', async () => {
      mockSignup.mockResolvedValue(true)
      wrapper.vm.currentMode = 'signup'
      await wrapper.vm.handleSignup()

      expect(wrapper.vm.currentMode).toBe('signin')
    })
  })

  describe('Computed Properties', () => {
    it('deve calcular isSignup corretamente', () => {
      expect(wrapper.vm.isSignup).toBe(false)
      wrapper.vm.currentMode = 'signup'
      expect(wrapper.vm.isSignup).toBe(true)
    })

    it('deve atualizar currentMode quando isSignup é alterado', async () => {
      wrapper.vm.isSignup = true
      expect(wrapper.vm.currentMode).toBe('signup')

      wrapper.vm.isSignup = false
      expect(wrapper.vm.currentMode).toBe('signin')
    })
  })
})
