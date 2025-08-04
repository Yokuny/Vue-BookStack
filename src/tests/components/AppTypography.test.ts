import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeading from '../../components/typography/AppHeading.vue'
import AppText from '../../components/typography/AppText.vue'
import AppBrand from '../../components/typography/AppBrand.vue'
import AppDisplayTitle from '../../components/typography/AppDisplayTitle.vue'
import AppCaption from '../../components/typography/AppCaption.vue'

describe('Componentes de Tipografia', () => {
  describe('AppHeading', () => {
    it('deve renderizar com tag h2 por padrão', () => {
      const wrapper = mount(AppHeading, {
        slots: {
          default: 'Título de Teste',
        },
      })
      expect(wrapper.element.tagName).toBe('H2')
      expect(wrapper.text()).toBe('Título de Teste')
    })

    it('deve aplicar tag customizada', () => {
      const wrapper = mount(AppHeading, {
        props: {
          tag: 'h1',
        },
        slots: {
          default: 'Título H1',
        },
      })
      expect(wrapper.element.tagName).toBe('H1')
    })

    it('deve ter size md por padrão', () => {
      const wrapper = mount(AppHeading, {
        slots: {
          default: 'Título',
        },
      })
      expect(wrapper.classes()).toContain('heading--md')
    })

    it('deve aplicar size customizado', () => {
      const wrapper = mount(AppHeading, {
        props: {
          size: 'xl',
        },
        slots: {
          default: 'Título Grande',
        },
      })
      expect(wrapper.classes()).toContain('heading--xl')
    })

    it('deve ter variant default por padrão', () => {
      const wrapper = mount(AppHeading, {
        slots: {
          default: 'Título',
        },
      })
      expect(wrapper.classes()).toContain('heading--default')
    })

    it('deve aplicar variant customizado', () => {
      const wrapper = mount(AppHeading, {
        props: {
          variant: 'muted',
        },
        slots: {
          default: 'Título Muted',
        },
      })
      expect(wrapper.classes()).toContain('heading--muted')
    })

    it('deve ter todas as classes corretas', () => {
      const wrapper = mount(AppHeading, {
        props: {
          tag: 'h3',
          size: 'lg',
          variant: 'secondary',
        },
        slots: {
          default: 'Título Completo',
        },
      })
      expect(wrapper.classes()).toContain('heading')
      expect(wrapper.classes()).toContain('heading--lg')
      expect(wrapper.classes()).toContain('heading--secondary')
    })
  })

  describe('AppText', () => {
    it('deve renderizar com tag p por padrão', () => {
      const wrapper = mount(AppText, {
        slots: {
          default: 'Texto de teste',
        },
      })
      expect(wrapper.element.tagName).toBe('P')
      expect(wrapper.text()).toBe('Texto de teste')
    })

    it('deve aplicar tag customizada', () => {
      const wrapper = mount(AppText, {
        props: {
          tag: 'span',
        },
        slots: {
          default: 'Texto span',
        },
      })
      expect(wrapper.element.tagName).toBe('SPAN')
    })

    it('deve ter size md por padrão', () => {
      const wrapper = mount(AppText, {
        slots: {
          default: 'Texto',
        },
      })
      expect(wrapper.classes()).toContain('text--md')
    })

    it('deve aplicar size customizado', () => {
      const wrapper = mount(AppText, {
        props: {
          size: 'lg',
        },
        slots: {
          default: 'Texto grande',
        },
      })
      expect(wrapper.classes()).toContain('text--lg')
    })

    it('deve ter variant default por padrão', () => {
      const wrapper = mount(AppText, {
        slots: {
          default: 'Texto',
        },
      })
      expect(wrapper.classes()).toContain('text--default')
    })

    it('deve aplicar variant customizado', () => {
      const wrapper = mount(AppText, {
        props: {
          variant: 'accent',
        },
        slots: {
          default: 'Texto accent',
        },
      })
      expect(wrapper.classes()).toContain('text--accent')
    })

    it('deve ter weight normal por padrão', () => {
      const wrapper = mount(AppText, {
        slots: {
          default: 'Texto',
        },
      })
      expect(wrapper.classes()).toContain('text--normal')
    })

    it('deve aplicar weight customizado', () => {
      const wrapper = mount(AppText, {
        props: {
          weight: 'bold',
        },
        slots: {
          default: 'Texto bold',
        },
      })
      expect(wrapper.classes()).toContain('text--bold')
    })

    it('deve aplicar italic quando true', () => {
      const wrapper = mount(AppText, {
        props: {
          italic: true,
        },
        slots: {
          default: 'Texto itálico',
        },
      })
      expect(wrapper.classes()).toContain('text--italic')
    })

    it('não deve aplicar italic quando false', () => {
      const wrapper = mount(AppText, {
        props: {
          italic: false,
        },
        slots: {
          default: 'Texto normal',
        },
      })
      expect(wrapper.classes()).not.toContain('text--italic')
    })

    it('deve ter todas as classes corretas', () => {
      const wrapper = mount(AppText, {
        props: {
          tag: 'div',
          size: 'xl',
          variant: 'secondary',
          weight: 'semibold',
          italic: true,
        },
        slots: {
          default: 'Texto completo',
        },
      })
      expect(wrapper.classes()).toContain('text')
      expect(wrapper.classes()).toContain('text--xl')
      expect(wrapper.classes()).toContain('text--secondary')
      expect(wrapper.classes()).toContain('text--semibold')
      expect(wrapper.classes()).toContain('text--italic')
    })
  })

  describe('AppBrand', () => {
    it('deve renderizar com tag h1 por padrão', () => {
      const wrapper = mount(AppBrand, {
        slots: {
          default: 'BookStack',
        },
      })
      expect(wrapper.element.tagName).toBe('H1')
      expect(wrapper.text()).toBe('BookStack')
    })

    it('deve aplicar tag customizada', () => {
      const wrapper = mount(AppBrand, {
        props: {
          tag: 'div',
        },
        slots: {
          default: 'Brand Div',
        },
      })
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('deve ter classe brand-text', () => {
      const wrapper = mount(AppBrand, {
        slots: {
          default: 'Brand',
        },
      })
      expect(wrapper.classes()).toContain('brand-text')
    })

    it('deve funcionar com diferentes tags', () => {
      const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'p'] as const

      tags.forEach((tag) => {
        const wrapper = mount(AppBrand, {
          props: { tag },
          slots: {
            default: `Brand ${tag}`,
          },
        })
        expect(wrapper.element.tagName).toBe(tag.toUpperCase())
        expect(wrapper.classes()).toContain('brand-text')
      })
    })
  })

  describe('AppDisplayTitle', () => {
    it('deve renderizar com tag h1 por padrão', () => {
      const wrapper = mount(AppDisplayTitle, {
        slots: {
          default: 'Título Display',
        },
      })
      expect(wrapper.element.tagName).toBe('H1')
      expect(wrapper.text()).toBe('Título Display')
    })

    it('deve aplicar tag customizada', () => {
      const wrapper = mount(AppDisplayTitle, {
        props: {
          tag: 'h2',
        },
        slots: {
          default: 'Display H2',
        },
      })
      expect(wrapper.element.tagName).toBe('H2')
    })

    it('deve ter size large por padrão', () => {
      const wrapper = mount(AppDisplayTitle, {
        slots: {
          default: 'Display',
        },
      })
      expect(wrapper.classes()).toContain('display-title--large')
    })

    it('deve aplicar size customizado', () => {
      const wrapper = mount(AppDisplayTitle, {
        props: {
          size: 'small',
        },
        slots: {
          default: 'Display pequeno',
        },
      })
      expect(wrapper.classes()).toContain('display-title--small')
    })

    it('deve ter classe display-title', () => {
      const wrapper = mount(AppDisplayTitle, {
        slots: {
          default: 'Display',
        },
      })
      expect(wrapper.classes()).toContain('display-title')
    })

    it('deve funcionar com todos os sizes', () => {
      const sizes = ['small', 'medium', 'large'] as const

      sizes.forEach((size) => {
        const wrapper = mount(AppDisplayTitle, {
          props: { size },
          slots: {
            default: `Display ${size}`,
          },
        })
        expect(wrapper.classes()).toContain(`display-title--${size}`)
      })
    })
  })

  describe('AppCaption', () => {
    it('deve renderizar com tag span por padrão', () => {
      const wrapper = mount(AppCaption, {
        slots: {
          default: 'Caption teste',
        },
      })
      expect(wrapper.element.tagName).toBe('SPAN')
      expect(wrapper.text()).toBe('Caption teste')
    })

    it('deve aplicar tag customizada', () => {
      const wrapper = mount(AppCaption, {
        props: {
          tag: 'p',
        },
        slots: {
          default: 'Caption p',
        },
      })
      expect(wrapper.element.tagName).toBe('P')
    })

    it('deve ter variant default por padrão', () => {
      const wrapper = mount(AppCaption, {
        slots: {
          default: 'Caption',
        },
      })
      expect(wrapper.classes()).toContain('caption--default')
    })

    it('deve aplicar variant customizado', () => {
      const wrapper = mount(AppCaption, {
        props: {
          variant: 'hint',
        },
        slots: {
          default: 'Caption hint',
        },
      })
      expect(wrapper.classes()).toContain('caption--hint')
    })

    it('deve ter uppercase false por padrão', () => {
      const wrapper = mount(AppCaption, {
        slots: {
          default: 'Caption',
        },
      })
      expect(wrapper.classes()).not.toContain('caption--uppercase')
    })

    it('deve aplicar uppercase quando true', () => {
      const wrapper = mount(AppCaption, {
        props: {
          uppercase: true,
        },
        slots: {
          default: 'Caption uppercase',
        },
      })
      expect(wrapper.classes()).toContain('caption--uppercase')
    })

    it('deve ter classe caption', () => {
      const wrapper = mount(AppCaption, {
        slots: {
          default: 'Caption',
        },
      })
      expect(wrapper.classes()).toContain('caption')
    })

    it('deve funcionar com todos os variants', () => {
      const variants = ['default', 'muted', 'subtle', 'hint'] as const

      variants.forEach((variant) => {
        const wrapper = mount(AppCaption, {
          props: { variant },
          slots: {
            default: `Caption ${variant}`,
          },
        })
        expect(wrapper.classes()).toContain(`caption--${variant}`)
      })
    })

    it('deve ter todas as classes corretas', () => {
      const wrapper = mount(AppCaption, {
        props: {
          tag: 'div',
          variant: 'muted',
          uppercase: true,
        },
        slots: {
          default: 'Caption completo',
        },
      })
      expect(wrapper.classes()).toContain('caption')
      expect(wrapper.classes()).toContain('caption--muted')
      expect(wrapper.classes()).toContain('caption--uppercase')
    })
  })

  describe('Casos Especiais', () => {
    it('todos os componentes devem renderizar conteúdo vazio', () => {
      const components = [
        { component: AppHeading, name: 'AppHeading' },
        { component: AppText, name: 'AppText' },
        { component: AppBrand, name: 'AppBrand' },
        { component: AppDisplayTitle, name: 'AppDisplayTitle' },
        { component: AppCaption, name: 'AppCaption' },
      ]

      components.forEach(({ component, name }) => {
        const wrapper = mount(component, {
          slots: {
            default: '',
          },
        })
        expect(wrapper.text()).toBe('')
        expect(wrapper.exists()).toBe(true)
      })
    })

    it('todos os componentes devem renderizar HTML complexo', () => {
      const components = [
        { component: AppHeading, name: 'AppHeading' },
        { component: AppText, name: 'AppText' },
        { component: AppBrand, name: 'AppBrand' },
        { component: AppDisplayTitle, name: 'AppDisplayTitle' },
        { component: AppCaption, name: 'AppCaption' },
      ]

      components.forEach(({ component, name }) => {
        const wrapper = mount(component, {
          slots: {
            default: '<strong>Texto</strong> com <em>formatação</em>',
          },
        })
        expect(wrapper.html()).toContain('<strong>Texto</strong>')
        expect(wrapper.html()).toContain('<em>formatação</em>')
      })
    })

    it('todos os componentes devem renderizar caracteres especiais', () => {
      const components = [
        { component: AppHeading, name: 'AppHeading' },
        { component: AppText, name: 'AppText' },
        { component: AppBrand, name: 'AppBrand' },
        { component: AppDisplayTitle, name: 'AppDisplayTitle' },
        { component: AppCaption, name: 'AppCaption' },
      ]

      const specialText = 'Texto com acentos: ção, ã, ê! @#$%^&*() 🎉'

      components.forEach(({ component, name }) => {
        const wrapper = mount(component, {
          slots: {
            default: specialText,
          },
        })
        expect(wrapper.text()).toBe(specialText)
      })
    })
  })
})
