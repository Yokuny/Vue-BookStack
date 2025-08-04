import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTextarea from '../../components/AppTextarea.vue'

describe('AppTextarea', () => {
  describe('Renderização', () => {
    it('deve renderizar com classe base textarea-group', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('.textarea-group').exists()).toBe(true)
    })

    it('deve renderizar textarea com classe app-textarea', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('.app-textarea').exists()).toBe(true)
    })

    it('deve ser um elemento textarea', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('textarea').element.tagName).toBe('TEXTAREA')
    })

    it('deve renderizar label quando fornecido', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          label: 'Descrição',
        },
      })
      expect(wrapper.find('.textarea-label').exists()).toBe(true)
      expect(wrapper.find('.textarea-label').text()).toBe('Descrição')
    })

    it('não deve renderizar label quando não fornecido', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('.textarea-label').exists()).toBe(false)
    })
  })

  describe('Props', () => {
    it('deve aplicar placeholder', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          placeholder: 'Digite sua descrição',
        },
      })
      expect(wrapper.find('textarea').attributes('placeholder')).toBe('Digite sua descrição')
    })

    it('deve ter rows=4 por padrão', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('textarea').attributes('rows')).toBe('4')
    })

    it('deve aplicar rows customizado', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          rows: 8,
        },
      })
      expect(wrapper.find('textarea').attributes('rows')).toBe('8')
    })

    it('deve ter disabled=false por padrão', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('textarea').attributes('disabled')).toBeUndefined()
      expect(wrapper.find('textarea').classes()).not.toContain('disabled')
    })

    it('deve aplicar disabled quando true', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          disabled: true,
        },
      })
      expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
      expect(wrapper.find('textarea').classes()).toContain('disabled')
    })

    it('deve ter required=false por padrão', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          label: 'Descrição',
        },
      })
      expect(wrapper.find('.required-mark').exists()).toBe(false)
    })
  })

  describe('Label e Required', () => {
    it('deve renderizar label com texto', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          label: 'Comentário',
        },
      })
      expect(wrapper.find('.textarea-label').text()).toBe('Comentário')
    })

    it('deve renderizar required mark quando required=true', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          label: 'Descrição',
          required: true,
        },
      })
      expect(wrapper.find('.required-mark').exists()).toBe(true)
      expect(wrapper.find('.required-mark').text()).toBe('*')
    })

    it('não deve renderizar required mark quando required=false', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          label: 'Descrição',
          required: false,
        },
      })
      expect(wrapper.find('.required-mark').exists()).toBe(false)
    })

    it('deve renderizar label e required mark juntos', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          label: 'Observações',
          required: true,
        },
      })
      expect(wrapper.find('.textarea-label').text()).toBe('Observações *')
    })
  })

  describe('Model Value', () => {
    it('deve aplicar modelValue string', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: 'Texto inicial',
        },
      })
      expect(wrapper.find('textarea').element.value).toBe('Texto inicial')
    })

    it('deve aplicar modelValue vazio', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('textarea').element.value).toBe('')
    })

    it('deve aplicar modelValue com quebras de linha', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: 'Linha 1\nLinha 2\nLinha 3',
        },
      })
      expect(wrapper.find('textarea').element.value).toBe('Linha 1\nLinha 2\nLinha 3')
    })
  })

  describe('Eventos', () => {
    it('deve emitir update:modelValue no input', async () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      const textarea = wrapper.find('textarea')
      await textarea.setValue('novo texto')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['novo texto'])
    })

    it('deve emitir input event', async () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      const textarea = wrapper.find('textarea')
      await textarea.trigger('input')

      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('deve emitir eventos com texto longo', async () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      const longText =
        'Este é um texto muito longo que deve ser testado para garantir que o componente funciona corretamente com textos extensos.'
      const textarea = wrapper.find('textarea')
      await textarea.setValue(longText)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([longText])
    })

    it('deve emitir eventos com texto multi-linha', async () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      const multiLineText = 'Primeira linha\nSegunda linha\nTerceira linha'
      const textarea = wrapper.find('textarea')
      await textarea.setValue(multiLineText)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([multiLineText])
    })
  })

  describe('Funcionalidades', () => {
    it('deve funcionar com todos os props', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: 'Texto inicial',
          label: 'Campo Completo',
          placeholder: 'Digite aqui',
          disabled: false,
          required: true,
          rows: 6,
        },
      })

      expect(wrapper.find('.textarea-label').text()).toBe('Campo Completo *')
      expect(wrapper.find('textarea').attributes('placeholder')).toBe('Digite aqui')
      expect(wrapper.find('textarea').element.value).toBe('Texto inicial')
      expect(wrapper.find('textarea').attributes('disabled')).toBeUndefined()
      expect(wrapper.find('textarea').attributes('rows')).toBe('6')
      expect(wrapper.find('.required-mark').exists()).toBe(true)
    })

    it('deve funcionar com disabled e required', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          label: 'Campo',
          disabled: true,
          required: true,
        },
      })
      expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
      expect(wrapper.find('.required-mark').exists()).toBe(true)
    })

    it('deve funcionar sem label', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: 'Sem label',
        },
      })
      expect(wrapper.find('.textarea-label').exists()).toBe(false)
      expect(wrapper.find('textarea').element.value).toBe('Sem label')
    })
  })

  describe('Casos Especiais', () => {
    it('deve funcionar com apenas props obrigatórios', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      expect(wrapper.find('.textarea-group').exists()).toBe(true)
      expect(wrapper.find('textarea').exists()).toBe(true)
      expect(wrapper.find('textarea').attributes('rows')).toBe('4')
      expect(wrapper.find('textarea').attributes('disabled')).toBeUndefined()
    })

    it('deve funcionar com caracteres especiais', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: 'Texto com acentos: ção, ão, ã! @#$%^&*()',
          label: 'Campo com Acentos ção',
          placeholder: 'Placeholder com acentos ção',
        },
      })

      expect(wrapper.find('textarea').element.value).toBe(
        'Texto com acentos: ção, ão, ã! @#$%^&*()',
      )
      expect(wrapper.find('.textarea-label').text()).toBe('Campo com Acentos ção')
      expect(wrapper.find('textarea').attributes('placeholder')).toBe('Placeholder com acentos ção')
    })

    it('deve funcionar com valores extremos para rows', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          rows: 1,
        },
      })
      expect(wrapper.find('textarea').attributes('rows')).toBe('1')
    })

    it('deve manter estrutura com label vazio', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          label: '',
        },
      })
      expect(wrapper.find('.textarea-label').exists()).toBe(false)
    })

    it('deve funcionar com placeholder vazio', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          placeholder: '',
        },
      })
      expect(wrapper.find('textarea').attributes('placeholder')).toBe('')
    })
  })

  describe('Estrutura', () => {
    it('deve ter estrutura correta com label e textarea', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          label: 'Teste',
        },
      })

      expect(wrapper.find('.textarea-group').exists()).toBe(true)
      expect(wrapper.find('.textarea-label').exists()).toBe(true)
      expect(wrapper.find('.app-textarea').exists()).toBe(true)
    })

    it('deve ter classes CSS corretas', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      expect(wrapper.find('.textarea-group').classes()).toContain('textarea-group')
      expect(wrapper.find('textarea').classes()).toContain('app-textarea')
    })
  })
})
