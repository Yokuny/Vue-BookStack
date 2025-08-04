import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchIcon from '../../components/icons/SearchIcon.vue'

describe('SearchIcon', () => {
  it('deve renderizar o ícone com propriedades padrão', () => {
    const wrapper = mount(SearchIcon)
    const svg = wrapper.find('svg')

    expect(svg.exists()).toBe(true)
    expect(svg.attributes('width')).toBe('24')
    expect(svg.attributes('height')).toBe('24')
    expect(svg.attributes('stroke-width')).toBe('2')
    expect(svg.classes()).toContain('search-icon')
  })

  it('deve aceitar propriedades customizadas', () => {
    const wrapper = mount(SearchIcon, {
      props: {
        size: 32,
        strokeWidth: 3,
        className: 'custom-search-class',
      },
    })
    const svg = wrapper.find('svg')

    expect(svg.attributes('width')).toBe('32')
    expect(svg.attributes('height')).toBe('32')
    expect(svg.attributes('stroke-width')).toBe('3')
    expect(svg.classes()).toContain('custom-search-class')
  })

  it('deve conter os elementos corretos do SVG', () => {
    const wrapper = mount(SearchIcon)
    const paths = wrapper.findAll('path')
    const circles = wrapper.findAll('circle')

    expect(paths).toHaveLength(1)
    expect(circles).toHaveLength(1)
    expect(paths[0].attributes('d')).toBe('m21 21-4.34-4.34')
    expect(circles[0].attributes('cx')).toBe('11')
    expect(circles[0].attributes('cy')).toBe('11')
    expect(circles[0].attributes('r')).toBe('8')
  })

  it('deve aceitar size como string', () => {
    const wrapper = mount(SearchIcon, {
      props: {
        size: '28',
      },
    })
    const svg = wrapper.find('svg')

    expect(svg.attributes('width')).toBe('28')
    expect(svg.attributes('height')).toBe('28')
  })

  it('deve ter os atributos SVG corretos', () => {
    const wrapper = mount(SearchIcon)
    const svg = wrapper.find('svg')

    expect(svg.attributes('viewBox')).toBe('0 0 24 24')
    expect(svg.attributes('fill')).toBe('none')
    expect(svg.attributes('stroke')).toBe('currentColor')
    expect(svg.attributes('stroke-linecap')).toBe('round')
    expect(svg.attributes('stroke-linejoin')).toBe('round')
  })

  it('deve renderizar com className vazia por padrão', () => {
    const wrapper = mount(SearchIcon)
    const svg = wrapper.find('svg')

    expect(svg.classes()).toContain('search-icon')
    expect(svg.classes()).not.toContain('')
  })
})
