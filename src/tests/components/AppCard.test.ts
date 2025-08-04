import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppCard from '../../components/AppCard.vue'

describe('AppCard', () => {
  describe('Renderização', () => {
    it('deve renderizar com classe base card', () => {
      const wrapper = mount(AppCard)
      expect(wrapper.find('.card').exists()).toBe(true)
    })

    it('deve renderizar conteúdo do slot default', () => {
      const wrapper = mount(AppCard, {
        slots: {
          default: 'Conteúdo do card',
        },
      })
      expect(wrapper.find('.card-content').text()).toBe('Conteúdo do card')
    })

    it('deve renderizar slot header quando fornecido', () => {
      const wrapper = mount(AppCard, {
        slots: {
          header: 'Título do Card',
          default: 'Conteúdo do card',
        },
      })

      expect(wrapper.find('.card-header').exists()).toBe(true)
      expect(wrapper.find('.card-header').text()).toBe('Título do Card')
    })

    it('não deve renderizar header quando slot header não é fornecido', () => {
      const wrapper = mount(AppCard, {
        slots: {
          default: 'Conteúdo do card',
        },
      })

      expect(wrapper.find('.card-header').exists()).toBe(false)
    })
  })

  describe('Slots', () => {
    it('deve renderizar HTML complexo no slot default', () => {
      const wrapper = mount(AppCard, {
        slots: {
          default: '<h2>Título</h2><p>Parágrafo com texto</p>',
        },
      })

      expect(wrapper.find('.card-content').html()).toContain('<h2>Título</h2>')
      expect(wrapper.find('.card-content').html()).toContain('<p>Parágrafo com texto</p>')
    })

    it('deve renderizar HTML complexo no slot header', () => {
      const wrapper = mount(AppCard, {
        slots: {
          header: '<h1>Título Principal</h1><button>Ação</button>',
          default: 'Conteúdo',
        },
      })

      expect(wrapper.find('.card-header').html()).toContain('<h1>Título Principal</h1>')
      expect(wrapper.find('.card-header').html()).toContain('<button>Ação</button>')
    })

    it('deve lidar com slot vazio', () => {
      const wrapper = mount(AppCard)
      expect(wrapper.find('.card-content').text()).toBe('')
    })
  })

  describe('Estrutura', () => {
    it('deve ter estrutura correta com header e conteúdo', () => {
      const wrapper = mount(AppCard, {
        slots: {
          header: 'Header',
          default: 'Conteúdo',
        },
      })

      const card = wrapper.find('.card')
      const header = wrapper.find('.card-header')
      const content = wrapper.find('.card-content')

      expect(card.exists()).toBe(true)
      expect(header.exists()).toBe(true)
      expect(content.exists()).toBe(true)
      expect(header.text()).toBe('Header')
      expect(content.text()).toBe('Conteúdo')
    })

    it('deve ter estrutura correta apenas com conteúdo', () => {
      const wrapper = mount(AppCard, {
        slots: {
          default: 'Conteúdo',
        },
      })

      const card = wrapper.find('.card')
      const header = wrapper.find('.card-header')
      const content = wrapper.find('.card-content')

      expect(card.exists()).toBe(true)
      expect(header.exists()).toBe(false)
      expect(content.exists()).toBe(true)
      expect(content.text()).toBe('Conteúdo')
    })

    it('deve ter estrutura correta com card vazio', () => {
      const wrapper = mount(AppCard)

      const card = wrapper.find('.card')
      const header = wrapper.find('.card-header')
      const content = wrapper.find('.card-content')

      expect(card.exists()).toBe(true)
      expect(header.exists()).toBe(false)
      expect(content.exists()).toBe(true)
      expect(content.text()).toBe('')
    })
  })

  describe('Funcionalidades', () => {
    it('deve ser um elemento div', () => {
      const wrapper = mount(AppCard)
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('deve ter classes CSS corretas', () => {
      const wrapper = mount(AppCard)
      const card = wrapper.find('.card')

      expect(card.classes()).toContain('card')
    })

    it('deve renderizar múltiplos elementos no slot', () => {
      const wrapper = mount(AppCard, {
        slots: {
          default: `
            <div>Elemento 1</div>
            <div>Elemento 2</div>
            <div>Elemento 3</div>
          `,
        },
      })

      const content = wrapper.find('.card-content')
      expect(content.html()).toContain('Elemento 1')
      expect(content.html()).toContain('Elemento 2')
      expect(content.html()).toContain('Elemento 3')
    })
  })
})
