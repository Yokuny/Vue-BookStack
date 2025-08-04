import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from '../../components/AppButton.vue'

describe('AppButton', () => {
  describe('Renderização', () => {
    it('deve renderizar com classe base btn', () => {
      const wrapper = mount(AppButton)
      expect(wrapper.find('button').classes()).toContain('btn')
    })

    it('deve renderizar conteúdo do slot', () => {
      const wrapper = mount(AppButton, {
        slots: {
          default: 'Clique aqui',
        },
      })
      expect(wrapper.text()).toBe('Clique aqui')
    })

    it('deve renderizar sem variante por padrão', () => {
      const wrapper = mount(AppButton)
      const button = wrapper.find('button')

      expect(button.classes()).toContain('btn')
      expect(button.classes()).not.toContain('button-outline')
      expect(button.classes()).not.toContain('button-primary')
      expect(button.classes()).not.toContain('button-system')
    })
  })

  describe('Variantes', () => {
    it('deve aplicar classe button-outline quando variant é outline', () => {
      const wrapper = mount(AppButton, {
        props: { variant: 'outline' },
      })
      expect(wrapper.find('button').classes()).toContain('button-outline')
    })

    it('deve aplicar classe button-primary quando variant é primary', () => {
      const wrapper = mount(AppButton, {
        props: { variant: 'primary' },
      })
      expect(wrapper.find('button').classes()).toContain('button-primary')
    })

    it('deve aplicar classe button-system quando variant é system', () => {
      const wrapper = mount(AppButton, {
        props: { variant: 'system' },
      })
      expect(wrapper.find('button').classes()).toContain('button-system')
    })

    it('deve aplicar apenas uma variante por vez', () => {
      const wrapper = mount(AppButton, {
        props: { variant: 'outline' },
      })
      const button = wrapper.find('button')

      expect(button.classes()).toContain('button-outline')
      expect(button.classes()).not.toContain('button-primary')
      expect(button.classes()).not.toContain('button-system')
    })
  })

  describe('Eventos', () => {
    it('deve emitir evento click ao ser clicado', async () => {
      const wrapper = mount(AppButton)
      const button = wrapper.find('button')

      await button.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('deve emitir evento click com MouseEvent', async () => {
      const wrapper = mount(AppButton)
      const button = wrapper.find('button')

      await button.trigger('click')

      const emitted = wrapper.emitted('click')
      expect(emitted).toBeTruthy()
      expect(emitted![0]).toHaveLength(1)
      expect(emitted![0][0]).toBeInstanceOf(Event)
    })

    it('deve emitir múltiplos eventos click', async () => {
      const wrapper = mount(AppButton)
      const button = wrapper.find('button')

      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')

      expect(wrapper.emitted('click')).toHaveLength(3)
    })
  })

  describe('Funcionalidades', () => {
    it('deve ter cursor pointer via CSS', () => {
      const wrapper = mount(AppButton)
      const button = wrapper.find('button')

      expect(button.classes()).toContain('btn')
    })

    it('deve ser um elemento button', () => {
      const wrapper = mount(AppButton)
      expect(wrapper.element.tagName).toBe('BUTTON')
    })

    it('deve renderizar com diferentes conteúdos no slot', () => {
      const wrapper = mount(AppButton, {
        slots: {
          default: '<span>Botão com HTML</span>',
        },
      })

      expect(wrapper.html()).toContain('<span>Botão com HTML</span>')
    })
  })

  describe('Casos especiais', () => {
    it('deve lidar com slot vazio', () => {
      const wrapper = mount(AppButton)
      expect(wrapper.text()).toBe('')
    })

    it('deve manter classes base mesmo com variante', () => {
      const wrapper = mount(AppButton, {
        props: { variant: 'primary' },
      })
      const button = wrapper.find('button')

      expect(button.classes()).toContain('btn')
      expect(button.classes()).toContain('button-primary')
    })

    it('deve funcionar com variante inválida (deve ignorar)', () => {
      const wrapper = mount(AppButton, {
        props: { variant: 'invalid' as any },
      })
      const button = wrapper.find('button')

      expect(button.classes()).toContain('btn')
      expect(button.classes()).not.toContain('button-invalid')
    })
  })
})
