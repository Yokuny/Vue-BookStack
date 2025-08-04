import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CleaningIcon from '../../components/icons/CleaningIcon.vue'

describe('CleaningIcon', () => {
  it('deve renderizar o ícone com propriedades padrão', () => {
    const wrapper = mount(CleaningIcon)
    const svg = wrapper.find('svg')

    expect(svg.exists()).toBe(true)
    expect(svg.attributes('width')).toBe('24')
    expect(svg.attributes('height')).toBe('24')
    expect(svg.attributes('stroke-width')).toBe('2')
    expect(svg.classes()).toContain('cleaning-icon')
  })

  it('deve aceitar propriedades customizadas', () => {
    const wrapper = mount(CleaningIcon, {
      props: {
        size: 32,
        strokeWidth: 3,
        className: 'custom-class',
      },
    })
    const svg = wrapper.find('svg')

    expect(svg.attributes('width')).toBe('32')
    expect(svg.attributes('height')).toBe('32')
    expect(svg.attributes('stroke-width')).toBe('3')
    expect(svg.classes()).toContain('custom-class')
  })

  it('deve conter os paths corretos do SVG', () => {
    const wrapper = mount(CleaningIcon)
    const paths = wrapper.findAll('path')

    expect(paths).toHaveLength(4)
    expect(paths[0].attributes('d')).toBe('m16 22-1-4')
    expect(paths[1].attributes('d')).toBe(
      'M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1',
    )
    expect(paths[2].attributes('d')).toBe(
      'M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z',
    )
    expect(paths[3].attributes('d')).toBe('m8 22 1-4')
  })

  it('deve aceitar size como string', () => {
    const wrapper = mount(CleaningIcon, {
      props: {
        size: '40',
      },
    })
    const svg = wrapper.find('svg')

    expect(svg.attributes('width')).toBe('40')
    expect(svg.attributes('height')).toBe('40')
  })

  it('deve ter os atributos SVG corretos', () => {
    const wrapper = mount(CleaningIcon)
    const svg = wrapper.find('svg')

    expect(svg.attributes('viewBox')).toBe('0 0 24 24')
    expect(svg.attributes('fill')).toBe('none')
    expect(svg.attributes('stroke')).toBe('currentColor')
    expect(svg.attributes('stroke-linecap')).toBe('round')
    expect(svg.attributes('stroke-linejoin')).toBe('round')
  })
})
