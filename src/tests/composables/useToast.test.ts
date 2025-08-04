import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
}

vi.mock('vue3-toastify', () => ({
  toast: mockToast,
}))

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('showSuccess', () => {
    it('deve exibir toast de sucesso com configuração padrão', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showSuccess } = useToast()

      showSuccess('Operação realizada com sucesso!')

      expect(mockToast.success).toHaveBeenCalledWith('Operação realizada com sucesso!', {
        autoClose: 3000,
      })
      expect(mockToast.success).toHaveBeenCalledTimes(1)
    })

    it('deve aplicar opções customizadas', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showSuccess } = useToast()

      showSuccess('Sucesso!', {
        autoClose: 5000,
        position: 'top-right',
      })

      expect(mockToast.success).toHaveBeenCalledWith('Sucesso!', {
        autoClose: 5000,
        position: 'top-right',
      })
    })

    it('deve sobrescrever autoClose padrão', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showSuccess } = useToast()

      showSuccess('Sucesso customizado!', { autoClose: 1000 })

      expect(mockToast.success).toHaveBeenCalledWith('Sucesso customizado!', {
        autoClose: 1000,
      })
    })

    it('deve funcionar com mensagem vazia', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showSuccess } = useToast()

      showSuccess('')

      expect(mockToast.success).toHaveBeenCalledWith('', {
        autoClose: 3000,
      })
    })

    it('deve funcionar com todas as posições válidas', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showSuccess } = useToast()

      const positions = [
        'top-left',
        'top-right',
        'top-center',
        'bottom-left',
        'bottom-right',
        'bottom-center',
      ] as const

      positions.forEach((position) => {
        showSuccess(`Mensagem ${position}`, { position })
        expect(mockToast.success).toHaveBeenCalledWith(`Mensagem ${position}`, {
          autoClose: 3000,
          position,
        })
      })

      expect(mockToast.success).toHaveBeenCalledTimes(6)
    })
  })

  describe('showError', () => {
    it('deve exibir toast de erro com configuração padrão', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showError } = useToast()

      showError('Erro ao processar operação!')

      expect(mockToast.error).toHaveBeenCalledWith('Erro ao processar operação!', {
        autoClose: 5000,
      })
      expect(mockToast.error).toHaveBeenCalledTimes(1)
    })

    it('deve aplicar opções customizadas', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showError } = useToast()

      showError('Erro crítico!', {
        autoClose: 10000,
        position: 'bottom-center',
      })

      expect(mockToast.error).toHaveBeenCalledWith('Erro crítico!', {
        autoClose: 10000,
        position: 'bottom-center',
      })
    })

    it('deve ter autoClose maior que success por padrão', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showError, showSuccess } = useToast()

      showSuccess('Sucesso')
      showError('Erro')

      expect(mockToast.success).toHaveBeenCalledWith('Sucesso', { autoClose: 3000 })
      expect(mockToast.error).toHaveBeenCalledWith('Erro', { autoClose: 5000 })
    })

    it('deve funcionar com mensagens de erro longas', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showError } = useToast()

      const longErrorMessage =
        'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde ou entre em contato com o suporte técnico se o problema persistir.'

      showError(longErrorMessage)

      expect(mockToast.error).toHaveBeenCalledWith(longErrorMessage, {
        autoClose: 5000,
      })
    })
  })

  describe('showInfo', () => {
    it('deve exibir toast de informação com configuração padrão', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showInfo } = useToast()

      showInfo('Informação importante!')

      expect(mockToast.info).toHaveBeenCalledWith('Informação importante!', {
        autoClose: 3000,
      })
      expect(mockToast.info).toHaveBeenCalledTimes(1)
    })

    it('deve aplicar opções customizadas', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showInfo } = useToast()

      showInfo('Nova atualização disponível', {
        autoClose: 8000,
        position: 'top-center',
      })

      expect(mockToast.info).toHaveBeenCalledWith('Nova atualização disponível', {
        autoClose: 8000,
        position: 'top-center',
      })
    })

    it('deve ter mesmo autoClose que success por padrão', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showInfo, showSuccess } = useToast()

      showSuccess('Sucesso')
      showInfo('Info')

      expect(mockToast.success).toHaveBeenCalledWith('Sucesso', { autoClose: 3000 })
      expect(mockToast.info).toHaveBeenCalledWith('Info', { autoClose: 3000 })
    })
  })

  describe('showWarning', () => {
    it('deve exibir toast de aviso com configuração padrão', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showWarning } = useToast()

      showWarning('Atenção: ação irreversível!')

      expect(mockToast.warning).toHaveBeenCalledWith('Atenção: ação irreversível!', {
        autoClose: 4000,
      })
      expect(mockToast.warning).toHaveBeenCalledTimes(1)
    })

    it('deve aplicar opções customizadas', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showWarning } = useToast()

      showWarning('Sessão expirando em 5 minutos', {
        autoClose: 15000,
        position: 'bottom-right',
      })

      expect(mockToast.warning).toHaveBeenCalledWith('Sessão expirando em 5 minutos', {
        autoClose: 15000,
        position: 'bottom-right',
      })
    })

    it('deve ter autoClose intermediário por padrão', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showSuccess, showError, showInfo, showWarning } = useToast()

      showSuccess('Sucesso')
      showInfo('Info')
      showWarning('Aviso')
      showError('Erro')

      expect(mockToast.success).toHaveBeenCalledWith('Sucesso', { autoClose: 3000 })
      expect(mockToast.info).toHaveBeenCalledWith('Info', { autoClose: 3000 })
      expect(mockToast.warning).toHaveBeenCalledWith('Aviso', { autoClose: 4000 })
      expect(mockToast.error).toHaveBeenCalledWith('Erro', { autoClose: 5000 })
    })
  })

  describe('Casos de Uso Múltiplos', () => {
    it('deve permitir múltiplos toasts simultaneamente', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showSuccess, showError, showInfo, showWarning } = useToast()

      showSuccess('Arquivo salvo')
      showInfo('Nova versão disponível')
      showWarning('Memória baixa')
      showError('Falha na conexão')

      expect(mockToast.success).toHaveBeenCalledTimes(1)
      expect(mockToast.info).toHaveBeenCalledTimes(1)
      expect(mockToast.warning).toHaveBeenCalledTimes(1)
      expect(mockToast.error).toHaveBeenCalledTimes(1)
    })

    it('deve funcionar com chamadas em sequência', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showSuccess } = useToast()

      showSuccess('Primeiro')
      showSuccess('Segundo')
      showSuccess('Terceiro')

      expect(mockToast.success).toHaveBeenCalledTimes(3)
      expect(mockToast.success).toHaveBeenNthCalledWith(1, 'Primeiro', { autoClose: 3000 })
      expect(mockToast.success).toHaveBeenNthCalledWith(2, 'Segundo', { autoClose: 3000 })
      expect(mockToast.success).toHaveBeenNthCalledWith(3, 'Terceiro', { autoClose: 3000 })
    })

    it('deve funcionar com diferentes configurações para cada toast', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showSuccess, showError } = useToast()

      showSuccess('Rápido', { autoClose: 1000, position: 'top-left' })
      showError('Lento', { autoClose: 10000, position: 'bottom-right' })

      expect(mockToast.success).toHaveBeenCalledWith('Rápido', {
        autoClose: 1000,
        position: 'top-left',
      })
      expect(mockToast.error).toHaveBeenCalledWith('Lento', {
        autoClose: 10000,
        position: 'bottom-right',
      })
    })
  })

  describe('Casos Especiais', () => {
    it('deve funcionar com caracteres especiais e emojis', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showSuccess, showError, showInfo, showWarning } = useToast()

      showSuccess('✅ Sucesso! Arquivo salvo com êxito')
      showError('❌ Erro: Não foi possível conectar')
      showInfo('ℹ️ Info: Nova funcionalidade disponível')
      showWarning('⚠️ Aviso: Operação em andamento')

      expect(mockToast.success).toHaveBeenCalledWith('✅ Sucesso! Arquivo salvo com êxito', {
        autoClose: 3000,
      })
      expect(mockToast.error).toHaveBeenCalledWith('❌ Erro: Não foi possível conectar', {
        autoClose: 5000,
      })
      expect(mockToast.info).toHaveBeenCalledWith('ℹ️ Info: Nova funcionalidade disponível', {
        autoClose: 3000,
      })
      expect(mockToast.warning).toHaveBeenCalledWith('⚠️ Aviso: Operação em andamento', {
        autoClose: 4000,
      })
    })

    it('deve funcionar com numbers como string', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showInfo } = useToast()

      showInfo('123456')

      expect(mockToast.info).toHaveBeenCalledWith('123456', {
        autoClose: 3000,
      })
    })

    it('deve funcionar com quebras de linha', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showError } = useToast()

      const multilineMessage = 'Erro detectado:\n- Arquivo não encontrado\n- Verifique o caminho'

      showError(multilineMessage)

      expect(mockToast.error).toHaveBeenCalledWith(multilineMessage, {
        autoClose: 5000,
      })
    })

    it('deve funcionar com opções undefined', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showSuccess } = useToast()

      showSuccess('Teste', undefined)

      expect(mockToast.success).toHaveBeenCalledWith('Teste', {
        autoClose: 3000,
      })
    })

    it('deve funcionar com opções vazias', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showWarning } = useToast()

      showWarning('Aviso', {})

      expect(mockToast.warning).toHaveBeenCalledWith('Aviso', {
        autoClose: 4000,
      })
    })
  })

  describe('Integração de Métodos', () => {
    it('deve retornar todos os métodos', async () => {
      const { useToast } = await import('../../composables/useToast')
      const toast = useToast()

      expect(toast).toHaveProperty('showSuccess')
      expect(toast).toHaveProperty('showError')
      expect(toast).toHaveProperty('showInfo')
      expect(toast).toHaveProperty('showWarning')
      expect(typeof toast.showSuccess).toBe('function')
      expect(typeof toast.showError).toBe('function')
      expect(typeof toast.showInfo).toBe('function')
      expect(typeof toast.showWarning).toBe('function')
    })

    it('deve manter independência entre diferentes instâncias', async () => {
      const { useToast } = await import('../../composables/useToast')
      const toast1 = useToast()
      const toast2 = useToast()

      toast1.showSuccess('Toast 1')
      toast2.showError('Toast 2')

      expect(mockToast.success).toHaveBeenCalledWith('Toast 1', { autoClose: 3000 })
      expect(mockToast.error).toHaveBeenCalledWith('Toast 2', { autoClose: 5000 })
      expect(mockToast.success).toHaveBeenCalledTimes(1)
      expect(mockToast.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('Configurações de Tempo', () => {
    it('deve validar diferentes tempos de autoClose', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showInfo } = useToast()

      const timeOptions = [100, 1000, 5000, 10000, 0]

      timeOptions.forEach((time) => {
        showInfo(`Tempo ${time}ms`, { autoClose: time })
        expect(mockToast.info).toHaveBeenCalledWith(`Tempo ${time}ms`, {
          autoClose: time,
        })
      })

      expect(mockToast.info).toHaveBeenCalledTimes(5)
    })

    it('deve sobrescrever autoClose padrão sem afetar outras opções', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showSuccess } = useToast()

      showSuccess('Teste', {
        autoClose: 7000,
        position: 'top-center',
      })

      expect(mockToast.success).toHaveBeenCalledWith('Teste', {
        autoClose: 7000,
        position: 'top-center',
      })
    })
  })

  describe('Cenários Realistas', () => {
    it('deve simular fluxo de operações CRUD', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showSuccess, showError, showInfo, showWarning } = useToast()
      showSuccess('Livro criado com sucesso!')
      showInfo('Carregando detalhes do livro...')
      showWarning('Livro será atualizado. Confirmar?')
      showSuccess('Livro atualizado!')
      showError('Não foi possível deletar. Livro está sendo usado.')

      expect(mockToast.success).toHaveBeenCalledTimes(2)
      expect(mockToast.error).toHaveBeenCalledTimes(1)
      expect(mockToast.info).toHaveBeenCalledTimes(1)
      expect(mockToast.warning).toHaveBeenCalledTimes(1)
    })

    it('deve simular notificações de sistema', async () => {
      const { useToast } = await import('../../composables/useToast')
      const { showInfo, showWarning, showError } = useToast()
      showInfo('Sistema será atualizado em 10 minutos', {
        autoClose: 8000,
        position: 'top-center',
      })
      showWarning('Sua sessão expira em 5 minutos', {
        autoClose: 10000,
        position: 'bottom-right',
      })
      showError('Conexão perdida. Tentando reconectar...', {
        autoClose: 0,
        position: 'top-center',
      })

      expect(mockToast.info).toHaveBeenCalledWith('Sistema será atualizado em 10 minutos', {
        autoClose: 8000,
        position: 'top-center',
      })
      expect(mockToast.warning).toHaveBeenCalledWith('Sua sessão expira em 5 minutos', {
        autoClose: 10000,
        position: 'bottom-right',
      })
      expect(mockToast.error).toHaveBeenCalledWith('Conexão perdida. Tentando reconectar...', {
        autoClose: 0,
        position: 'top-center',
      })
    })
  })
})
