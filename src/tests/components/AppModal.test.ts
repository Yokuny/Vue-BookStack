import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppModal from '../../components/AppModal.vue'

vi.mock('../../components/index', () => ({
  Heading: {
    name: 'Heading',
    template: '<div class="heading"><slot /></div>',
  },
}))

const globalConfig = {
  global: {
    stubs: {
      Teleport: {
        template: '<div><slot /></div>',
      },
    },
  },
}

describe('AppModal', () => {
  describe('Renderização Condicional', () => {
    it('deve renderizar quando modelValue é true', () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Teste',
        },
        ...globalConfig,
      })
      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    })

    it('não deve renderizar quando modelValue é false', () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: false,
          title: 'Modal Teste',
        },
        ...globalConfig,
      })
      expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })
  })

  describe('Props', () => {
    it('deve aplicar title corretamente', () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Título do Modal',
        },
        ...globalConfig,
      })
      expect(wrapper.find('.heading').text()).toBe('Título do Modal')
    })

    it('deve ter showCloseButton=true por padrão', () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Teste',
        },
        ...globalConfig,
      })
      expect(wrapper.find('.modal-close').exists()).toBe(true)
    })

    it('deve ocultar botão de fechar quando showCloseButton=false', () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Teste',
          showCloseButton: false,
        },
        ...globalConfig,
      })
      expect(wrapper.find('.modal-close').exists()).toBe(false)
    })
  })

  describe('Estrutura', () => {
    it('deve ter estrutura correta', () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Teste',
        },
        slots: {
          default: '<div>Conteúdo</div>',
          actions: '<button>OK</button>',
        },
        ...globalConfig,
      })

      expect(wrapper.find('.modal-header').exists()).toBe(true)
      expect(wrapper.find('.modal-body').exists()).toBe(true)
      expect(wrapper.find('.modal-actions').exists()).toBe(true)
    })

    it('deve ter botão de fechar com texto ×', () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Teste',
        },
        ...globalConfig,
      })
      expect(wrapper.find('.modal-close').text()).toBe('×')
    })
  })

  describe('Slots', () => {
    it('deve renderizar conteúdo do slot default', () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Teste',
        },
        slots: {
          default: '<div class="conteudo">Conteúdo do modal</div>',
        },
        ...globalConfig,
      })
      expect(wrapper.find('.conteudo').exists()).toBe(true)
      expect(wrapper.find('.conteudo').text()).toBe('Conteúdo do modal')
    })

    it('deve renderizar slot actions quando fornecido', () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Teste',
        },
        slots: {
          actions: '<button>Confirmar</button>',
        },
        ...globalConfig,
      })
      expect(wrapper.find('.modal-actions').exists()).toBe(true)
      expect(wrapper.find('.modal-actions button').exists()).toBe(true)
    })

    it('não deve renderizar modal-actions quando slot actions não é fornecido', () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Teste',
        },
        ...globalConfig,
      })
      expect(wrapper.find('.modal-actions').exists()).toBe(false)
    })
  })

  describe('Eventos', () => {
    it('deve emitir update:modelValue e close ao clicar no botão de fechar', async () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Teste',
        },
        ...globalConfig,
      })

      await wrapper.find('.modal-close').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('deve emitir eventos ao clicar no overlay quando closeOnOverlayClick=true', async () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Teste',
          closeOnOverlayClick: true,
        },
        ...globalConfig,
      })

      await wrapper.find('.modal-overlay').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('não deve emitir eventos ao clicar no overlay quando closeOnOverlayClick=false', async () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Teste',
          closeOnOverlayClick: false,
        },
        ...globalConfig,
      })

      await wrapper.find('.modal-overlay').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('não deve fechar ao clicar no modal-content', async () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Teste',
        },
        ...globalConfig,
      })

      await wrapper.find('.modal-content').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })

  describe('Casos Especiais', () => {
    it('deve funcionar com todos os props', () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Completo',
          showCloseButton: true,
          closeOnOverlayClick: true,
        },
        slots: {
          default: '<p>Conteúdo do modal</p>',
          actions: '<button>OK</button>',
        },
        ...globalConfig,
      })

      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
      expect(wrapper.find('.heading').text()).toBe('Modal Completo')
      expect(wrapper.find('.modal-close').exists()).toBe(true)
      expect(wrapper.find('p').text()).toBe('Conteúdo do modal')
      expect(wrapper.find('.modal-actions button').exists()).toBe(true)
    })

    it('deve funcionar sem slots', () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: 'Modal Simples',
        },
        ...globalConfig,
      })

      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
      expect(wrapper.find('.modal-header').exists()).toBe(true)
      expect(wrapper.find('.modal-body').exists()).toBe(true)
      expect(wrapper.find('.modal-actions').exists()).toBe(false)
    })

    it('deve funcionar com título vazio', () => {
      const wrapper = mount(AppModal, {
        props: {
          modelValue: true,
          title: '',
        },
        ...globalConfig,
      })

      expect(wrapper.find('.heading').text()).toBe('')
    })
  })
})
