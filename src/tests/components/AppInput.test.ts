import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppInput from '../../components/AppInput.vue'

describe('AppInput', () => {
  describe('Renderização', () => {
    it('deve renderizar com classe base input-group', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('.input-group').exists()).toBe(true)
    })

    it('deve renderizar input com classe app-input', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('.app-input').exists()).toBe(true)
    })

    it('deve ser um elemento input', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('input').element.tagName).toBe('INPUT')
    })

    it('deve renderizar label quando fornecido', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          label: 'Nome',
        },
      })
      expect(wrapper.find('.input-label').exists()).toBe(true)
      expect(wrapper.find('.input-label').text()).toBe('Nome')
    })

    it('não deve renderizar label quando não fornecido', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('.input-label').exists()).toBe(false)
    })
  })

  describe('Props', () => {
    it('deve ter type="text" por padrão', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('input').attributes('type')).toBe('text')
    })

    it('deve aplicar type correto', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          type: 'password',
        },
      })
      expect(wrapper.find('input').attributes('type')).toBe('password')
    })

    it('deve aplicar placeholder', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          placeholder: 'Digite seu nome',
        },
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Digite seu nome')
    })

    it('deve aplicar min para tipo number', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: 0,
          type: 'number',
          min: 5,
        },
      })
      expect(wrapper.find('input').attributes('min')).toBe('5')
    })

    it('deve aplicar min como string', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: 0,
          type: 'number',
          min: '10',
        },
      })
      expect(wrapper.find('input').attributes('min')).toBe('10')
    })
  })

  describe('Label e Required', () => {
    it('deve renderizar label com texto', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          label: 'Email',
        },
      })
      expect(wrapper.find('.input-label').text()).toBe('Email')
    })

    it('deve renderizar required mark quando required=true', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          label: 'Nome',
          required: true,
        },
      })
      expect(wrapper.find('.required-mark').exists()).toBe(true)
      expect(wrapper.find('.required-mark').text()).toBe('*')
    })

    it('não deve renderizar required mark quando required=false', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          label: 'Nome',
          required: false,
        },
      })
      expect(wrapper.find('.required-mark').exists()).toBe(false)
    })

    it('deve renderizar label e required mark juntos', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          label: 'Senha',
          required: true,
        },
      })
      expect(wrapper.find('.input-label').text()).toBe('Senha *')
    })
  })

  describe('Disabled', () => {
    it('deve estar habilitado por padrão', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
      expect(wrapper.find('input').classes()).not.toContain('disabled')
    })

    it('deve aplicar disabled quando true', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          disabled: true,
        },
      })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      expect(wrapper.find('input').classes()).toContain('disabled')
    })

    it('deve aplicar disabled quando false', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          disabled: false,
        },
      })
      expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
      expect(wrapper.find('input').classes()).not.toContain('disabled')
    })
  })

  describe('Model Value', () => {
    it('deve aplicar modelValue string', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: 'teste',
        },
      })
      expect(wrapper.find('input').element.value).toBe('teste')
    })

    it('deve aplicar modelValue number', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: 42,
        },
      })
      expect(wrapper.find('input').element.value).toBe('42')
    })

    it('deve aplicar modelValue zero', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: 0,
        },
      })
      expect(wrapper.find('input').element.value).toBe('0')
    })
  })

  describe('Eventos', () => {
    it('deve emitir update:modelValue no input', async () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
        },
      })

      const input = wrapper.find('input')
      await input.setValue('novo valor')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['novo valor'])
    })

    it('deve emitir input event', async () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
        },
      })

      const input = wrapper.find('input')
      await input.trigger('input')

      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('deve emitir keyup event', async () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
        },
      })

      const input = wrapper.find('input')
      await input.trigger('keyup')

      expect(wrapper.emitted('keyup')).toBeTruthy()
    })

    it('deve converter para number quando type=number', async () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: 0,
          type: 'number',
        },
      })

      const input = wrapper.find('input')
      await input.setValue('42')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([42])
    })

    it('deve manter string quando type=text', async () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          type: 'text',
        },
      })

      const input = wrapper.find('input')
      await input.setValue('42')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['42'])
    })
  })

  describe('Tipos de Input', () => {
    it('deve renderizar type text', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          type: 'text',
        },
      })
      expect(wrapper.find('input').attributes('type')).toBe('text')
    })

    it('deve renderizar type password', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          type: 'password',
        },
      })
      expect(wrapper.find('input').attributes('type')).toBe('password')
    })

    it('deve renderizar type number', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: 0,
          type: 'number',
        },
      })
      expect(wrapper.find('input').attributes('type')).toBe('number')
    })

    it('deve renderizar type email', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          type: 'email',
        },
      })
      expect(wrapper.find('input').attributes('type')).toBe('email')
    })
  })

  describe('Casos especiais', () => {
    it('deve funcionar com todos os props', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: 'valor inicial',
          label: 'Campo Completo',
          type: 'email',
          placeholder: 'Digite seu email',
          disabled: false,
          required: true,
          min: 5,
        },
      })

      expect(wrapper.find('.input-label').text()).toBe('Campo Completo *')
      expect(wrapper.find('input').attributes('type')).toBe('email')
      expect(wrapper.find('input').attributes('placeholder')).toBe('Digite seu email')
      expect(wrapper.find('input').element.value).toBe('valor inicial')
      expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
      expect(wrapper.find('.required-mark').exists()).toBe(true)
    })

    it('deve funcionar com modelValue vazio', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('input').element.value).toBe('')
    })

    it('deve funcionar sem label', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
        },
      })
      expect(wrapper.find('.input-label').exists()).toBe(false)
    })

    it('deve funcionar com disabled e required', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          label: 'Campo',
          disabled: true,
          required: true,
        },
      })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      expect(wrapper.find('.required-mark').exists()).toBe(true)
    })
  })
})
