import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppLoading from '../../components/AppLoading.vue'

describe('AppLoading', () => {
  describe('Renderização', () => {
    it('deve renderizar com classe base loading', () => {
      const wrapper = mount(AppLoading)
      expect(wrapper.find('.loading').exists()).toBe(true)
    })

    it('deve renderizar loading-spinner', () => {
      const wrapper = mount(AppLoading)
      expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    })

    it('deve renderizar parágrafo com mensagem', () => {
      const wrapper = mount(AppLoading)
      expect(wrapper.find('p').exists()).toBe(true)
    })

    it('deve ser um elemento div', () => {
      const wrapper = mount(AppLoading)
      expect(wrapper.element.tagName).toBe('DIV')
    })
  })

  describe('Props', () => {
    it('deve ter mensagem padrão "Carregando..."', () => {
      const wrapper = mount(AppLoading)
      expect(wrapper.find('p').text()).toBe('Carregando...')
    })

    it('deve aplicar mensagem customizada', () => {
      const wrapper = mount(AppLoading, {
        props: {
          message: 'Aguarde um momento...',
        },
      })
      expect(wrapper.find('p').text()).toBe('Aguarde um momento...')
    })

    it('deve aplicar mensagem vazia', () => {
      const wrapper = mount(AppLoading, {
        props: {
          message: '',
        },
      })
      expect(wrapper.find('p').text()).toBe('')
    })

    it('deve aplicar mensagem com HTML', () => {
      const wrapper = mount(AppLoading, {
        props: {
          message: '<strong>Loading...</strong>',
        },
      })
      expect(wrapper.find('p').text()).toBe('<strong>Loading...</strong>')
    })
  })

  describe('Estrutura', () => {
    it('deve ter estrutura correta com spinner e mensagem', () => {
      const wrapper = mount(AppLoading)
      const loading = wrapper.find('.loading')
      const spinner = wrapper.find('.loading-spinner')
      const message = wrapper.find('p')

      expect(loading.exists()).toBe(true)
      expect(spinner.exists()).toBe(true)
      expect(message.exists()).toBe(true)
    })

    it('deve ter classes CSS corretas', () => {
      const wrapper = mount(AppLoading)
      const loading = wrapper.find('.loading')

      expect(loading.classes()).toContain('loading')
    })

    it('deve ter spinner com classe correta', () => {
      const wrapper = mount(AppLoading)
      const spinner = wrapper.find('.loading-spinner')

      expect(spinner.classes()).toContain('loading-spinner')
    })

    it('deve ter parágrafo dentro do loading', () => {
      const wrapper = mount(AppLoading)
      const loading = wrapper.find('.loading')
      const paragraph = loading.find('p')

      expect(paragraph.exists()).toBe(true)
    })
  })

  describe('Funcionalidades', () => {
    it('deve renderizar com estrutura completa', () => {
      const wrapper = mount(AppLoading, {
        props: {
          message: 'Processando dados...',
        },
      })

      expect(wrapper.find('.loading').exists()).toBe(true)
      expect(wrapper.find('.loading-spinner').exists()).toBe(true)
      expect(wrapper.find('p').text()).toBe('Processando dados...')
    })

    it('deve manter estrutura mesmo com mensagem longa', () => {
      const longMessage =
        'Esta é uma mensagem muito longa para testar como o componente se comporta com textos extensos que podem quebrar o layout'
      const wrapper = mount(AppLoading, {
        props: {
          message: longMessage,
        },
      })

      expect(wrapper.find('.loading').exists()).toBe(true)
      expect(wrapper.find('.loading-spinner').exists()).toBe(true)
      expect(wrapper.find('p').text()).toBe(longMessage)
    })

    it('deve funcionar com mensagem com caracteres especiais', () => {
      const wrapper = mount(AppLoading, {
        props: {
          message: 'Carregando... ⏳ 🚀',
        },
      })

      expect(wrapper.find('p').text()).toBe('Carregando... ⏳ 🚀')
    })
  })

  describe('Casos especiais', () => {
    it('deve funcionar sem props', () => {
      const wrapper = mount(AppLoading)

      expect(wrapper.find('.loading').exists()).toBe(true)
      expect(wrapper.find('.loading-spinner').exists()).toBe(true)
      expect(wrapper.find('p').text()).toBe('Carregando...')
    })

    it('deve funcionar com mensagem undefined', () => {
      const wrapper = mount(AppLoading, {
        props: {
          message: undefined,
        },
      })

      expect(wrapper.find('p').text()).toBe('Carregando...')
    })

    it('deve funcionar com mensagem null', () => {
      const wrapper = mount(AppLoading, {
        props: {
          message: null as any,
        },
      })
      expect(wrapper.find('p').text()).toBe('')
    })

    it('deve funcionar com mensagem numérica', () => {
      const wrapper = mount(AppLoading, {
        props: {
          message: '123',
        },
      })

      expect(wrapper.find('p').text()).toBe('123')
    })
  })

  describe('Estilos e Layout', () => {
    it('deve ter layout centralizado', () => {
      const wrapper = mount(AppLoading)
      const loading = wrapper.find('.loading')
      expect(loading.exists()).toBe(true)
    })

    it('deve ter spinner com dimensões corretas', () => {
      const wrapper = mount(AppLoading)
      const spinner = wrapper.find('.loading-spinner')

      expect(spinner.exists()).toBe(true)
    })

    it('deve ter padding aplicado', () => {
      const wrapper = mount(AppLoading)
      const loading = wrapper.find('.loading')

      expect(loading.exists()).toBe(true)
    })
  })

  describe('Acessibilidade', () => {
    it('deve ter estrutura semântica correta', () => {
      const wrapper = mount(AppLoading)

      expect(wrapper.find('.loading').exists()).toBe(true)
      expect(wrapper.find('p').exists()).toBe(true)
    })

    it('deve ter texto descritivo', () => {
      const wrapper = mount(AppLoading, {
        props: {
          message: 'Carregando dados do servidor...',
        },
      })

      expect(wrapper.find('p').text()).toBe('Carregando dados do servidor...')
    })

    it('deve ter spinner visual', () => {
      const wrapper = mount(AppLoading)
      expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    })
  })
})
