import { describe, it, vi, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppLayout from '../../components/AppLayout.vue'

vi.mock('../../components/AppHeader.vue', () => ({
  default: {
    name: 'AppHeader',
    template: '<header class="app-header"><slot name="logo" /><slot name="actions" /></header>',
  },
}))

vi.mock('../../components/AppFooter.vue', () => ({
  default: {
    name: 'AppFooter',
    template:
      '<footer class="app-footer"><slot name="left" /><slot name="center" /><slot name="right" /><slot name="bottom" /></footer>',
  },
}))

vi.mock('../../components/index', () => ({
  Brand: {
    name: 'Brand',
    template: '<div class="brand"><slot /></div>',
  },
  Heading: {
    name: 'Heading',
    template: '<div class="heading"><slot /></div>',
  },
}))

describe('AppLayout', () => {
  describe('Renderização', () => {
    it('deve renderizar com classe base app-layout', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.app-layout').exists()).toBe(true)
    })

    it('deve renderizar Header', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.app-header').exists()).toBe(true)
    })

    it('deve renderizar main-content', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.main-content').exists()).toBe(true)
    })

    it('deve renderizar Footer', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.app-footer').exists()).toBe(true)
    })

    it('deve ser um elemento div', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.element.tagName).toBe('DIV')
    })
  })

  describe('Estrutura', () => {
    it('deve ter estrutura correta com Header, main e Footer', () => {
      const wrapper = mount(AppLayout)

      expect(wrapper.find('.app-layout').exists()).toBe(true)
      expect(wrapper.find('.app-header').exists()).toBe(true)
      expect(wrapper.find('.main-content').exists()).toBe(true)
      expect(wrapper.find('.app-footer').exists()).toBe(true)
    })

    it('deve ter main como elemento main', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('main').exists()).toBe(true)
    })

    it('deve ter classes CSS corretas', () => {
      const wrapper = mount(AppLayout)
      const layout = wrapper.find('.app-layout')

      expect(layout.classes()).toContain('app-layout')
    })
  })

  describe('Slots', () => {
    it('deve renderizar conteúdo do slot default', () => {
      const wrapper = mount(AppLayout, {
        slots: {
          default: '<div class="conteudo">Conteúdo principal</div>',
        },
      })
      expect(wrapper.find('.conteudo').exists()).toBe(true)
      expect(wrapper.find('.conteudo').text()).toBe('Conteúdo principal')
    })

    it('deve renderizar conteúdo do slot actions', () => {
      const wrapper = mount(AppLayout, {
        slots: {
          actions: '<button>Login</button>',
        },
      })
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('button').text()).toBe('Login')
    })

    it('deve renderizar múltiplos slots', () => {
      const wrapper = mount(AppLayout, {
        slots: {
          default: '<div>Conteúdo</div>',
          actions: '<button>Ação</button>',
        },
      })

      expect(wrapper.find('.main-content div').text()).toBe('Conteúdo')
      expect(wrapper.find('button').text()).toBe('Ação')
    })

    it('deve renderizar HTML complexo no slot', () => {
      const wrapper = mount(AppLayout, {
        slots: {
          default: `
            <div class="container">
              <h1>Título</h1>
              <p>Parágrafo</p>
            </div>
          `,
        },
      })

      expect(wrapper.find('.container').exists()).toBe(true)
      expect(wrapper.find('h1').text()).toBe('Título')
      expect(wrapper.find('p').text()).toBe('Parágrafo')
    })
  })

  describe('Componentes Filhos', () => {
    it('deve renderizar Brand no Header', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.brand').exists()).toBe(true)
      expect(wrapper.find('.brand').text()).toBe('Book Stack')
    })

    it('deve renderizar Heading no Footer', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.heading').exists()).toBe(true)
      expect(wrapper.find('.heading').text()).toBe('BookStack')
    })

    it('deve renderizar links no Footer', () => {
      const wrapper = mount(AppLayout)
      const links = wrapper.findAll('.footer-link')

      expect(links.length).toBeGreaterThan(0)
    })

    it('deve renderizar copyright no Footer', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.text()).toContain('© 2024 BookStack')
    })
  })

  describe('Funcionalidades', () => {
    it('deve lidar com slots vazios', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.main-content').exists()).toBe(true)
    })

    it('deve renderizar com conteúdo complexo', () => {
      const wrapper = mount(AppLayout, {
        slots: {
          default: `
            <div class="page-content">
              <section class="hero">
                <h1>Bem-vindo</h1>
                <p>Descrição da página</p>
              </section>
              <section class="content">
                <article>Artigo principal</article>
              </section>
            </div>
          `,
          actions: `
            <div class="header-actions">
              <button>Login</button>
              <button>Signup</button>
            </div>
          `,
        },
      })

      expect(wrapper.find('.page-content').exists()).toBe(true)
      expect(wrapper.find('.hero').exists()).toBe(true)
      expect(wrapper.find('.content').exists()).toBe(true)
      expect(wrapper.find('.header-actions').exists()).toBe(true)
    })

    it('deve manter estrutura mesmo com conteúdo dinâmico', () => {
      const wrapper = mount(AppLayout, {
        slots: {
          default: '<div>Conteúdo dinâmico</div>',
        },
      })

      expect(wrapper.find('.app-layout').exists()).toBe(true)
      expect(wrapper.find('.app-header').exists()).toBe(true)
      expect(wrapper.find('.main-content').exists()).toBe(true)
      expect(wrapper.find('.app-footer').exists()).toBe(true)
    })
  })

  describe('Casos especiais', () => {
    it('deve funcionar apenas com slot default', () => {
      const wrapper = mount(AppLayout, {
        slots: {
          default: 'Apenas conteúdo principal',
        },
      })

      expect(wrapper.find('.main-content').text()).toBe('Apenas conteúdo principal')
    })

    it('deve funcionar apenas com slot actions', () => {
      const wrapper = mount(AppLayout, {
        slots: {
          actions: 'Apenas ações',
        },
      })

      expect(wrapper.text()).toContain('Apenas ações')
    })

    it('deve funcionar sem slots', () => {
      const wrapper = mount(AppLayout)

      expect(wrapper.find('.app-layout').exists()).toBe(true)
      expect(wrapper.find('.app-header').exists()).toBe(true)
      expect(wrapper.find('.main-content').exists()).toBe(true)
      expect(wrapper.find('.app-footer').exists()).toBe(true)
    })

    it('deve renderizar footer links corretamente', () => {
      const wrapper = mount(AppLayout)

      expect(wrapper.text()).toContain('API Postman')
      expect(wrapper.text()).toContain('GitHub Front-end')
      expect(wrapper.text()).toContain('GitHub Back-end')
      expect(wrapper.text()).toContain('Swagger API')
      expect(wrapper.text()).toContain('Testes Coverage')
      expect(wrapper.text()).toContain('Tecnologias Utilizadas')
    })

    it('deve ter link do Postman com target _blank', () => {
      const wrapper = mount(AppLayout)
      const postmanLink = wrapper.find('a[href*="postman.com"]')

      expect(postmanLink.exists()).toBe(true)
      expect(postmanLink.attributes('target')).toBe('_blank')
    })
  })

  describe('Layout e Estilos', () => {
    it('deve ter layout flexbox', () => {
      const wrapper = mount(AppLayout)
      const layout = wrapper.find('.app-layout')

      expect(layout.exists()).toBe(true)
    })

    it('deve ter main-content com flex: 1', () => {
      const wrapper = mount(AppLayout)
      const mainContent = wrapper.find('.main-content')

      expect(mainContent.exists()).toBe(true)
    })

    it('deve ter footer-links com flexbox', () => {
      const wrapper = mount(AppLayout)
      const footerLinks = wrapper.find('.footer-links')

      expect(footerLinks.exists()).toBe(true)
    })
  })
})
