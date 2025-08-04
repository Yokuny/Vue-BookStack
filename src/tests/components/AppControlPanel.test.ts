import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppControlPanel from '../../components/AppControlPanel.vue'

describe('AppControlPanel', () => {
  describe('Renderização', () => {
    it('deve renderizar com classe base control-panel', () => {
      const wrapper = mount(AppControlPanel)
      expect(wrapper.find('.control-panel').exists()).toBe(true)
    })

    it('deve renderizar conteúdo do slot', () => {
      const wrapper = mount(AppControlPanel, {
        slots: {
          default: 'Conteúdo do painel',
        },
      })
      expect(wrapper.text()).toBe('Conteúdo do painel')
    })

    it('deve renderizar HTML complexo no slot', () => {
      const wrapper = mount(AppControlPanel, {
        slots: {
          default: '<button>Botão</button><input type="text" />',
        },
      })
      expect(wrapper.html()).toContain('<button>Botão</button>')
      expect(wrapper.html()).toContain('<input type="text">')
    })
  })

  describe('Props', () => {
    it('deve ter hover=true por padrão', () => {
      const wrapper = mount(AppControlPanel)
      expect(wrapper.props('hover')).toBe(true)
    })

    it('deve aplicar classe control-panel-hover quando hover=true', () => {
      const wrapper = mount(AppControlPanel, {
        props: { hover: true },
      })
      expect(wrapper.find('.control-panel').classes()).toContain('control-panel-hover')
    })

    it('deve aplicar classe control-panel-hover quando hover não é fornecido', () => {
      const wrapper = mount(AppControlPanel)
      expect(wrapper.find('.control-panel').classes()).toContain('control-panel-hover')
    })

    it('não deve aplicar classe control-panel-hover quando hover=false', () => {
      const wrapper = mount(AppControlPanel, {
        props: { hover: false },
      })
      expect(wrapper.find('.control-panel').classes()).not.toContain('control-panel-hover')
    })
  })

  describe('Estrutura', () => {
    it('deve ser um elemento div', () => {
      const wrapper = mount(AppControlPanel)
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('deve ter classes CSS corretas', () => {
      const wrapper = mount(AppControlPanel)
      const panel = wrapper.find('.control-panel')

      expect(panel.classes()).toContain('control-panel')
    })

    it('deve ter estrutura correta com slot', () => {
      const wrapper = mount(AppControlPanel, {
        slots: {
          default: '<span>Teste</span>',
        },
      })

      const panel = wrapper.find('.control-panel')
      expect(panel.exists()).toBe(true)
      expect(wrapper.html()).toContain('<span>Teste</span>')
    })
  })

  describe('Funcionalidades', () => {
    it('deve lidar com slot vazio', () => {
      const wrapper = mount(AppControlPanel)
      expect(wrapper.text()).toBe('')
    })

    it('deve renderizar múltiplos elementos no slot', () => {
      const wrapper = mount(AppControlPanel, {
        slots: {
          default: `
            <button>Botão 1</button>
            <button>Botão 2</button>
            <button>Botão 3</button>
          `,
        },
      })

      expect(wrapper.html()).toContain('Botão 1')
      expect(wrapper.html()).toContain('Botão 2')
      expect(wrapper.html()).toContain('Botão 3')
    })

    it('deve manter classes base mesmo com hover=false', () => {
      const wrapper = mount(AppControlPanel, {
        props: { hover: false },
      })
      const panel = wrapper.find('.control-panel')

      expect(panel.classes()).toContain('control-panel')
      expect(panel.classes()).not.toContain('control-panel-hover')
    })
  })

  describe('Casos especiais', () => {
    it('deve funcionar com props undefined', () => {
      const wrapper = mount(AppControlPanel, {
        props: { hover: undefined },
      })
      expect(wrapper.find('.control-panel').classes()).toContain('control-panel-hover')
    })

    it('deve funcionar com props null', () => {
      const wrapper = mount(AppControlPanel, {
        props: { hover: null as any },
      })
      // Quando hover é null, não deve ter a classe hover
      expect(wrapper.find('.control-panel').classes()).not.toContain('control-panel-hover')
    })

    it('deve renderizar com componentes Vue no slot', () => {
      const wrapper = mount(AppControlPanel, {
        slots: {
          default: '<div class="custom-component">Componente Customizado</div>',
        },
      })

      expect(wrapper.find('.custom-component').exists()).toBe(true)
      expect(wrapper.find('.custom-component').text()).toBe('Componente Customizado')
    })
  })
})
