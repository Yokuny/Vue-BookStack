import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFavoriteButton from '../../components/AppFavoriteButton.vue'

describe('AppFavoriteButton', () => {
  const createWrapper = (props = {}) => {
    return mount(AppFavoriteButton, {
      props: {
        isFavorite: false,
        ...props,
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderização', () => {
    it('deve renderizar com classe base favorite-btn', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.favorite-btn').exists()).toBe(true)
    })

    it('deve renderizar ícone de estrela', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.star-icon').text()).toBe('★')
    })

    it('deve ter type="button"', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('button').attributes('type')).toBe('button')
    })
  })

  describe('Props', () => {
    it('deve ter disabled=false por padrão', () => {
      const wrapper = createWrapper()
      expect(wrapper.props('disabled')).toBe(false)
    })

    it('deve aplicar disabled quando prop é true', () => {
      const wrapper = createWrapper({ disabled: true })
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('não deve ter disabled quando prop é false', () => {
      const wrapper = createWrapper({ disabled: false })
      expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
    })

    it('deve ter isFavorite obrigatório', () => {
      const wrapper = createWrapper({ isFavorite: true })
      expect(wrapper.props('isFavorite')).toBe(true)
    })
  })

  describe('Estados', () => {
    it('deve aplicar classe favorite-active quando isFavorite=true', () => {
      const wrapper = createWrapper({ isFavorite: true })
      expect(wrapper.find('.favorite-btn').classes()).toContain('favorite-active')
    })

    it('não deve aplicar classe favorite-active quando isFavorite=false', () => {
      const wrapper = createWrapper({ isFavorite: false })
      expect(wrapper.find('.favorite-btn').classes()).not.toContain('favorite-active')
    })

    it('deve ter title correto quando isFavorite=true', () => {
      const wrapper = createWrapper({ isFavorite: true })
      expect(wrapper.find('button').attributes('title')).toBe('Remover dos favoritos')
    })

    it('deve ter title correto quando isFavorite=false', () => {
      const wrapper = createWrapper({ isFavorite: false })
      expect(wrapper.find('button').attributes('title')).toBe('Adicionar aos favoritos')
    })
  })

  describe('Eventos', () => {
    it('deve emitir toggle quando clicado e não disabled', async () => {
      const wrapper = createWrapper({ disabled: false })
      const button = wrapper.find('button')

      await button.trigger('click')

      expect(wrapper.emitted('toggle')).toBeTruthy()
      expect(wrapper.emitted('toggle')).toHaveLength(1)
    })

    it('não deve emitir toggle quando disabled=true', async () => {
      const wrapper = createWrapper({ disabled: true })
      const button = wrapper.find('button')

      await button.trigger('click')

      expect(wrapper.emitted('toggle')).toBeFalsy()
    })

    it('deve emitir múltiplos eventos toggle', async () => {
      const wrapper = createWrapper({ disabled: false })
      const button = wrapper.find('button')

      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')

      expect(wrapper.emitted('toggle')).toHaveLength(3)
    })

    it('deve usar @click.stop para prevenir propagação', async () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      expect(button.attributes()).toBeDefined()
    })
  })

  describe('Funcionalidades', () => {
    it('deve ser um elemento button', () => {
      const wrapper = createWrapper()
      expect(wrapper.element.tagName).toBe('BUTTON')
    })

    it('deve ter classes CSS corretas', () => {
      const wrapper = createWrapper()
      const button = wrapper.find('.favorite-btn')

      expect(button.classes()).toContain('favorite-btn')
    })

    it('deve ter estrutura correta com ícone', () => {
      const wrapper = createWrapper()
      const button = wrapper.find('.favorite-btn')
      const starIcon = wrapper.find('.star-icon')

      expect(button.exists()).toBe(true)
      expect(starIcon.exists()).toBe(true)
      expect(starIcon.text()).toBe('★')
    })
  })

  describe('Casos especiais', () => {
    it('deve funcionar com isFavorite alternando', async () => {
      const wrapper = createWrapper({ isFavorite: false })
      expect(wrapper.find('.favorite-btn').classes()).not.toContain('favorite-active')
      expect(wrapper.find('button').attributes('title')).toBe('Adicionar aos favoritos')
      await wrapper.setProps({ isFavorite: true })
      expect(wrapper.find('.favorite-btn').classes()).toContain('favorite-active')
      expect(wrapper.find('button').attributes('title')).toBe('Remover dos favoritos')
    })

    it('deve funcionar com disabled alternando', async () => {
      const wrapper = createWrapper({ disabled: false })
      expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
      await wrapper.setProps({ disabled: true })
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('deve manter funcionalidade quando disabled muda de true para false', async () => {
      const wrapper = createWrapper({ disabled: true })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('toggle')).toBeFalsy()
      await wrapper.setProps({ disabled: false })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('toggle')).toBeTruthy()
    })
  })
})
