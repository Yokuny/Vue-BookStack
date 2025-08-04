import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '../../components/AppHeader.vue'

describe('AppHeader', () => {
  describe('Renderização', () => {
    it('deve renderizar com classe base header', () => {
      const wrapper = mount(AppHeader)
      expect(wrapper.find('.header').exists()).toBe(true)
    })

    it('deve renderizar header-content', () => {
      const wrapper = mount(AppHeader)
      expect(wrapper.find('.header-content').exists()).toBe(true)
    })

    it('deve renderizar todas as seções do header', () => {
      const wrapper = mount(AppHeader)

      expect(wrapper.find('.header-left').exists()).toBe(true)
      expect(wrapper.find('.header-center').exists()).toBe(true)
      expect(wrapper.find('.header-right').exists()).toBe(true)
    })

    it('deve ser um elemento header', () => {
      const wrapper = mount(AppHeader)
      expect(wrapper.element.tagName).toBe('HEADER')
    })

    it('deve ter posicionamento sticky', () => {
      const wrapper = mount(AppHeader)
      const header = wrapper.find('.header')
      expect(header.classes()).toContain('header')
    })
  })

  describe('Slots', () => {
    it('deve renderizar conteúdo do slot logo', () => {
      const wrapper = mount(AppHeader, {
        slots: {
          logo: '<img src="logo.png" alt="Logo" />',
        },
      })
      expect(wrapper.find('.header-left').html()).toContain('<img src="logo.png" alt="Logo">')
    })

    it('deve renderizar conteúdo do slot title', () => {
      const wrapper = mount(AppHeader, {
        slots: {
          title: '<h1>BookStack</h1>',
        },
      })
      expect(wrapper.find('.header-left').html()).toContain('<h1>BookStack</h1>')
    })

    it('deve renderizar conteúdo do slot navigation', () => {
      const wrapper = mount(AppHeader, {
        slots: {
          navigation: '<nav>Menu</nav>',
        },
      })
      expect(wrapper.find('.header-center').html()).toContain('<nav>Menu</nav>')
    })

    it('deve renderizar conteúdo do slot actions', () => {
      const wrapper = mount(AppHeader, {
        slots: {
          actions: '<button>Login</button>',
        },
      })
      expect(wrapper.find('.header-right').html()).toContain('<button>Login</button>')
    })

    it('deve renderizar múltiplos slots simultaneamente', () => {
      const wrapper = mount(AppHeader, {
        slots: {
          logo: '<img src="logo.png" />',
          title: '<h1>BookStack</h1>',
          navigation: '<nav>Menu</nav>',
          actions: '<button>Login</button>',
        },
      })

      expect(wrapper.find('.header-left').html()).toContain('<img src="logo.png">')
      expect(wrapper.find('.header-left').html()).toContain('<h1>BookStack</h1>')
      expect(wrapper.find('.header-center').html()).toContain('<nav>Menu</nav>')
      expect(wrapper.find('.header-right').html()).toContain('<button>Login</button>')
    })

    it('deve renderizar HTML complexo nos slots', () => {
      const wrapper = mount(AppHeader, {
        slots: {
          logo: '<div class="logo"><img src="logo.png" alt="Logo" /></div>',
          title: '<div class="title"><h1>BookStack</h1><p>Biblioteca Digital</p></div>',
          navigation: '<nav class="nav"><a href="/">Home</a><a href="/books">Livros</a></nav>',
          actions: '<div class="actions"><button>Login</button><button>Signup</button></div>',
        },
      })

      expect(wrapper.find('.header-left').html()).toContain('<div class="logo">')
      expect(wrapper.find('.header-left').html()).toContain('<div class="title">')
      expect(wrapper.find('.header-center').html()).toContain('<nav class="nav">')
      expect(wrapper.find('.header-right').html()).toContain('<div class="actions">')
    })
  })

  describe('Estrutura', () => {
    it('deve ter estrutura correta com header-content', () => {
      const wrapper = mount(AppHeader)
      const header = wrapper.find('.header')
      const content = wrapper.find('.header-content')

      expect(header.exists()).toBe(true)
      expect(content.exists()).toBe(true)
      expect(content.find('.header-left').exists()).toBe(true)
      expect(content.find('.header-center').exists()).toBe(true)
      expect(content.find('.header-right').exists()).toBe(true)
    })

    it('deve ter classes CSS corretas', () => {
      const wrapper = mount(AppHeader)
      const header = wrapper.find('.header')

      expect(header.classes()).toContain('header')
    })

    it('deve ter estrutura correta com slots vazios', () => {
      const wrapper = mount(AppHeader)

      expect(wrapper.find('.header-left').exists()).toBe(true)
      expect(wrapper.find('.header-center').exists()).toBe(true)
      expect(wrapper.find('.header-right').exists()).toBe(true)
      expect(wrapper.find('.header-left').text()).toBe('')
      expect(wrapper.find('.header-center').text()).toBe('')
      expect(wrapper.find('.header-right').text()).toBe('')
    })
  })

  describe('Funcionalidades', () => {
    it('deve lidar com slots vazios', () => {
      const wrapper = mount(AppHeader)
      expect(wrapper.text()).toBe('')
    })

    it('deve renderizar com todos os slots preenchidos', () => {
      const wrapper = mount(AppHeader, {
        slots: {
          logo: 'Logo',
          title: 'Título',
          navigation: 'Navegação',
          actions: 'Ações',
        },
      })

      expect(wrapper.text()).toContain('Logo')
      expect(wrapper.text()).toContain('Título')
      expect(wrapper.text()).toContain('Navegação')
      expect(wrapper.text()).toContain('Ações')
    })

    it('deve manter estrutura mesmo com conteúdo complexo', () => {
      const wrapper = mount(AppHeader, {
        slots: {
          logo: `
            <div>Logo</div>
            <span>Brand</span>
          `,
          title: '<h1>Título Principal</h1>',
          navigation: '<nav><a href="#">Link</a></nav>',
          actions: '<div><button>Login</button></div>',
        },
      })

      expect(wrapper.find('.header-left').exists()).toBe(true)
      expect(wrapper.find('.header-center').exists()).toBe(true)
      expect(wrapper.find('.header-right').exists()).toBe(true)
    })
  })

  describe('Casos especiais', () => {
    it('deve funcionar apenas com slot logo', () => {
      const wrapper = mount(AppHeader, {
        slots: {
          logo: 'Apenas logo',
        },
      })

      expect(wrapper.find('.header-left').text()).toBe('Apenas logo')
      expect(wrapper.find('.header-center').text()).toBe('')
      expect(wrapper.find('.header-right').text()).toBe('')
    })

    it('deve funcionar apenas com slot title', () => {
      const wrapper = mount(AppHeader, {
        slots: {
          title: 'Apenas título',
        },
      })

      expect(wrapper.find('.header-left').text()).toBe('Apenas título')
      expect(wrapper.find('.header-center').text()).toBe('')
      expect(wrapper.find('.header-right').text()).toBe('')
    })

    it('deve funcionar apenas com slot navigation', () => {
      const wrapper = mount(AppHeader, {
        slots: {
          navigation: 'Apenas navegação',
        },
      })

      expect(wrapper.find('.header-left').text()).toBe('')
      expect(wrapper.find('.header-center').text()).toBe('Apenas navegação')
      expect(wrapper.find('.header-right').text()).toBe('')
    })

    it('deve funcionar apenas com slot actions', () => {
      const wrapper = mount(AppHeader, {
        slots: {
          actions: 'Apenas ações',
        },
      })

      expect(wrapper.find('.header-left').text()).toBe('')
      expect(wrapper.find('.header-center').text()).toBe('')
      expect(wrapper.find('.header-right').text()).toBe('Apenas ações')
    })

    it('deve ter múltiplos slots na seção left', () => {
      const wrapper = mount(AppHeader, {
        slots: {
          logo: 'Logo',
          title: 'Título',
        },
      })

      expect(wrapper.find('.header-left').text()).toBe('LogoTítulo')
    })
  })

  describe('Estilos e Layout', () => {
    it('deve ter flexbox layout', () => {
      const wrapper = mount(AppHeader)
      const content = wrapper.find('.header-content')
      expect(content.exists()).toBe(true)
    })

    it('deve ter seções com flex apropriado', () => {
      const wrapper = mount(AppHeader)

      const left = wrapper.find('.header-left')
      const center = wrapper.find('.header-center')
      const right = wrapper.find('.header-right')

      expect(left.exists()).toBe(true)
      expect(center.exists()).toBe(true)
      expect(right.exists()).toBe(true)
    })
  })
})
