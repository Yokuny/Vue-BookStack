import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSwitch from '../../components/AppSwitch.vue'

describe('AppSwitch', () => {
  describe('Renderização', () => {
    it('deve renderizar com classe base switch-container', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Esquerda',
          rightLabel: 'Direita',
        },
      })
      expect(wrapper.find('.switch-container').exists()).toBe(true)
    })

    it('deve renderizar switch com classes corretas', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Esquerda',
          rightLabel: 'Direita',
        },
      })
      expect(wrapper.find('.switch').exists()).toBe(true)
      expect(wrapper.find('.switch-slider').exists()).toBe(true)
    })

    it('deve renderizar ambas as opções', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Esquerda',
          rightLabel: 'Direita',
        },
      })
      expect(wrapper.find('.switch-option.left').exists()).toBe(true)
      expect(wrapper.find('.switch-option.right').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('deve aplicar leftLabel corretamente', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Opção A',
          rightLabel: 'Opção B',
        },
      })
      expect(wrapper.find('.switch-option.left').text()).toBe('Opção A')
    })

    it('deve aplicar rightLabel corretamente', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Opção A',
          rightLabel: 'Opção B',
        },
      })
      expect(wrapper.find('.switch-option.right').text()).toBe('Opção B')
    })

    it('deve ter modelValue=false por padrão', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Esquerda',
          rightLabel: 'Direita',
        },
      })
      expect(wrapper.find('.switch-option.left').classes()).toContain('active')
      expect(wrapper.find('.switch-option.right').classes()).not.toContain('active')
    })

    it('deve aplicar modelValue=true corretamente', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Esquerda',
          rightLabel: 'Direita',
          modelValue: true,
        },
      })
      expect(wrapper.find('.switch-option.left').classes()).not.toContain('active')
      expect(wrapper.find('.switch-option.right').classes()).toContain('active')
    })

    it('deve aplicar modelValue=false corretamente', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Esquerda',
          rightLabel: 'Direita',
          modelValue: false,
        },
      })
      expect(wrapper.find('.switch-option.left').classes()).toContain('active')
      expect(wrapper.find('.switch-option.right').classes()).not.toContain('active')
    })
  })

  describe('Estado do Slider', () => {
    it('não deve ter classe slide-right quando modelValue=false', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Esquerda',
          rightLabel: 'Direita',
          modelValue: false,
        },
      })
      expect(wrapper.find('.switch-slider').classes()).not.toContain('slide-right')
    })

    it('deve ter classe slide-right quando modelValue=true', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Esquerda',
          rightLabel: 'Direita',
          modelValue: true,
        },
      })
      expect(wrapper.find('.switch-slider').classes()).toContain('slide-right')
    })
  })

  describe('Eventos', () => {
    it('deve emitir update:modelValue e toggle ao clicar no switch', async () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Esquerda',
          rightLabel: 'Direita',
          modelValue: false,
        },
      })

      await wrapper.find('.switch').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
      expect(wrapper.emitted('toggle')).toBeTruthy()
      expect(wrapper.emitted('toggle')![0]).toEqual([true])
    })

    it('deve alternar de true para false', async () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Esquerda',
          rightLabel: 'Direita',
          modelValue: true,
        },
      })

      await wrapper.find('.switch').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
      expect(wrapper.emitted('toggle')).toBeTruthy()
      expect(wrapper.emitted('toggle')![0]).toEqual([false])
    })

    it('deve alternar de false para true', async () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Esquerda',
          rightLabel: 'Direita',
          modelValue: false,
        },
      })

      await wrapper.find('.switch').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
      expect(wrapper.emitted('toggle')).toBeTruthy()
      expect(wrapper.emitted('toggle')![0]).toEqual([true])
    })
  })

  describe('Funcionalidades', () => {
    it('deve funcionar com labels longos', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Opção muito longa da esquerda',
          rightLabel: 'Opção muito longa da direita',
        },
      })
      expect(wrapper.find('.switch-option.left').text()).toBe('Opção muito longa da esquerda')
      expect(wrapper.find('.switch-option.right').text()).toBe('Opção muito longa da direita')
    })

    it('deve funcionar com labels curtos', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'A',
          rightLabel: 'B',
        },
      })
      expect(wrapper.find('.switch-option.left').text()).toBe('A')
      expect(wrapper.find('.switch-option.right').text()).toBe('B')
    })

    it('deve funcionar com caracteres especiais', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: '🌙 Noite',
          rightLabel: '☀️ Dia',
        },
      })
      expect(wrapper.find('.switch-option.left').text()).toBe('🌙 Noite')
      expect(wrapper.find('.switch-option.right').text()).toBe('☀️ Dia')
    })
  })

  describe('Casos Especiais', () => {
    it('deve funcionar com todos os props', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Desligado',
          rightLabel: 'Ligado',
          modelValue: true,
        },
      })

      expect(wrapper.find('.switch-container').exists()).toBe(true)
      expect(wrapper.find('.switch-option.left').text()).toBe('Desligado')
      expect(wrapper.find('.switch-option.right').text()).toBe('Ligado')
      expect(wrapper.find('.switch-option.right').classes()).toContain('active')
      expect(wrapper.find('.switch-slider').classes()).toContain('slide-right')
    })

    it('deve manter estrutura mesmo com labels vazios', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: '',
          rightLabel: '',
        },
      })

      expect(wrapper.find('.switch-container').exists()).toBe(true)
      expect(wrapper.find('.switch-option.left').exists()).toBe(true)
      expect(wrapper.find('.switch-option.right').exists()).toBe(true)
      expect(wrapper.find('.switch-slider').exists()).toBe(true)
    })

    it('deve funcionar com apenas props obrigatórios', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Não',
          rightLabel: 'Sim',
        },
      })

      expect(wrapper.find('.switch-container').exists()).toBe(true)
      expect(wrapper.find('.switch-option.left').classes()).toContain('active')
      expect(wrapper.find('.switch-option.right').classes()).not.toContain('active')
      expect(wrapper.find('.switch-slider').classes()).not.toContain('slide-right')
    })
  })

  describe('Interação', () => {
    it('deve permitir múltiplos cliques', async () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Off',
          rightLabel: 'On',
          modelValue: false,
        },
      })

      await wrapper.find('.switch').trigger('click')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])

      await wrapper.setProps({ modelValue: true })
      await wrapper.find('.switch').trigger('click')
      expect(wrapper.emitted('update:modelValue')![1]).toEqual([false])
    })

    it('deve ter cursor pointer no switch', () => {
      const wrapper = mount(AppSwitch, {
        props: {
          leftLabel: 'Esquerda',
          rightLabel: 'Direita',
        },
      })

      expect(wrapper.find('.switch').exists()).toBe(true)
    })
  })
})
