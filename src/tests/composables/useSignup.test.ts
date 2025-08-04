import { describe, it, expect, vi, beforeEach } from 'vitest'
const mockShowSuccess = vi.fn()
const mockShowError = vi.fn()
vi.mock('../../composables/useToast', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}))
const mockRequestWithoutAuth = vi.fn()
const mockFetchConfig = vi.fn()
vi.mock('../../utils/fetch.config', () => ({
  requestWithoutAuth: mockRequestWithoutAuth,
  fetchConfig: mockFetchConfig,
}))

describe('useSignup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchConfig.mockReturnValue({ method: 'POST', body: {} })
  })

  describe('Estado Inicial', () => {
    it('deve ter estado inicial correto', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { isLoading } = useSignup()

      expect(isLoading.value).toBe(false)
    })
  })

  describe('Validação de Dados', () => {
    it('deve validar campos obrigatórios', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: '', password: '' }, '')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Preencha todos os campos')
    })

    it('deve validar nome vazio', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: '', password: 'senha123' }, 'senha123')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Preencha todos os campos')
    })

    it('deve validar senha vazia', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: 'usuario', password: '' }, 'senha123')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Preencha todos os campos')
    })

    it('deve validar confirmação de senha vazia', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: 'usuario', password: 'senha123' }, '')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Preencha todos os campos')
    })

    it('deve validar tamanho mínimo do nome', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: 'abc', password: 'senha123' }, 'senha123')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Nome deve ter no mínimo 5 caracteres')
    })

    it('deve validar nome com exatamente 4 caracteres', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: 'abcd', password: 'senha123' }, 'senha123')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Nome deve ter no mínimo 5 caracteres')
    })

    it('deve aceitar nome com exatamente 5 caracteres', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: 'abcde', password: 'senha123' }, 'senha123')

      expect(result).toBe(true)
      expect(mockShowError).not.toHaveBeenCalled()
    })

    it('deve validar tamanho mínimo da senha', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: 'usuario', password: '123' }, '123')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Senha deve ter no mínimo 5 caracteres')
    })

    it('deve validar senha com exatamente 4 caracteres', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: 'usuario', password: '1234' }, '1234')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Senha deve ter no mínimo 5 caracteres')
    })

    it('deve aceitar senha com exatamente 5 caracteres', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: 'usuario', password: '12345' }, '12345')

      expect(result).toBe(true)
      expect(mockShowError).not.toHaveBeenCalled()
    })

    it('deve validar senhas diferentes', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: 'usuario', password: 'senha123' }, 'senha456')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Senhas devem ser iguais')
    })

    it('deve aceitar dados válidos', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: 'usuario', password: 'senha123' }, 'senha123')

      expect(result).toBe(true)
      expect(mockShowError).not.toHaveBeenCalled()
    })

    it('deve validar nome com espaços', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: 'João Silva', password: 'senha123' }, 'senha123')

      expect(result).toBe(true)
    })

    it('deve validar caracteres especiais no nome', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: 'user@123', password: 'senha123' }, 'senha123')

      expect(result).toBe(true)
    })

    it('deve validar senha com caracteres especiais', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { validateSignupData } = useSignup()

      const result = validateSignupData({ name: 'usuario', password: 'senha@123!' }, 'senha@123!')

      expect(result).toBe(true)
    })
  })

  describe('Signup - Sucesso', () => {
    it('deve fazer signup com sucesso', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup, isLoading } = useSignup()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        message: 'Usuário criado com sucesso',
      })

      const result = await signup({ name: 'usuario', password: 'senha123' }, 'senha123')

      expect(result).toBe(true)
      expect(isLoading.value).toBe(false)
      expect(mockShowSuccess).toHaveBeenCalledWith('Usuário criado com sucesso')
      expect(mockRequestWithoutAuth).toHaveBeenCalledWith('/user/signup', expect.any(Object))
    })

    it('deve fazer signup com sucesso sem mensagem', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
      })

      const result = await signup({ name: 'usuario', password: 'senha123' }, 'senha123')

      expect(result).toBe(true)
      expect(mockShowSuccess).not.toHaveBeenCalled()
    })

    it('deve chamar fetchConfig com dados corretos', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      const signupData = { name: 'testuser', password: 'testpass' }

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
      })

      await signup(signupData, 'testpass')

      expect(mockFetchConfig).toHaveBeenCalledWith(signupData, 'POST')
    })

    it('deve processar usuário com dados mínimos válidos', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        message: 'Cadastro realizado',
      })

      const result = await signup({ name: 'abcde', password: '12345' }, '12345')

      expect(result).toBe(true)
      expect(mockShowSuccess).toHaveBeenCalledWith('Cadastro realizado')
    })
  })

  describe('Signup - Falhas', () => {
    it('deve falhar com dados inválidos', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      const result = await signup({ name: 'abc', password: 'senha123' }, 'senha123')

      expect(result).toBe(false)
      expect(mockRequestWithoutAuth).not.toHaveBeenCalled()
    })

    it('deve tratar erro do servidor', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup, isLoading } = useSignup()

      mockRequestWithoutAuth.mockResolvedValue({
        success: false,
        message: 'Nome de usuário já existe',
      })

      const result = await signup({ name: 'usuario', password: 'senha123' }, 'senha123')

      expect(result).toBe(false)
      expect(isLoading.value).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Nome de usuário já existe')
    })

    it('deve tratar erro do servidor sem mensagem', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      mockRequestWithoutAuth.mockResolvedValue({
        success: false,
      })

      const result = await signup({ name: 'usuario', password: 'senha123' }, 'senha123')

      expect(result).toBe(false)
      expect(mockShowError).not.toHaveBeenCalled()
    })

    it('deve tratar exceções de rede', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup, isLoading } = useSignup()

      mockRequestWithoutAuth.mockRejectedValue(new Error('Network error'))

      const result = await signup({ name: 'usuario', password: 'senha123' }, 'senha123')

      expect(result).toBe(false)
      expect(isLoading.value).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Falha ao criar usuário. Tente novamente.')
    })

    it('deve tratar timeout de requisição', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      mockRequestWithoutAuth.mockRejectedValue(new Error('Request timeout'))

      const result = await signup({ name: 'usuario', password: 'senha123' }, 'senha123')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Falha ao criar usuário. Tente novamente.')
    })
  })

  describe('Estados de Loading', () => {
    it('deve gerenciar loading durante signup com sucesso', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup, isLoading } = useSignup()

      expect(isLoading.value).toBe(false)

      mockRequestWithoutAuth.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 50)),
      )

      const signupPromise = signup({ name: 'usuario', password: 'senha123' }, 'senha123')
      expect(isLoading.value).toBe(true)

      await signupPromise
      expect(isLoading.value).toBe(false)
    })

    it('deve gerenciar loading durante signup com erro', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup, isLoading } = useSignup()

      expect(isLoading.value).toBe(false)

      mockRequestWithoutAuth.mockImplementation(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Error')), 50)),
      )

      const signupPromise = signup({ name: 'usuario', password: 'senha123' }, 'senha123')
      expect(isLoading.value).toBe(true)

      await signupPromise
      expect(isLoading.value).toBe(false)
    })

    it('não deve ativar loading para validação falhada', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup, isLoading } = useSignup()

      expect(isLoading.value).toBe(false)

      await signup({ name: 'abc', password: 'senha123' }, 'senha123')

      expect(isLoading.value).toBe(false)
    })

    it('deve garantir loading false mesmo com múltiplas chamadas', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup, isLoading } = useSignup()

      mockRequestWithoutAuth.mockResolvedValue({ success: true })

      await Promise.all([
        signup({ name: 'user1', password: 'pass1' }, 'pass1'),
        signup({ name: 'user2', password: 'pass2' }, 'pass2'),
        signup({ name: 'user3', password: 'pass3' }, 'pass3'),
      ])

      expect(isLoading.value).toBe(false)
    })
  })

  describe('Casos de Uso Reais', () => {
    it('deve processar cadastro com nome longo', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        message: 'Usuário cadastrado',
      })

      const result = await signup(
        {
          name: 'João da Silva Santos',
          password: 'minhasenhasegura123',
        },
        'minhasenhasegura123',
      )

      expect(result).toBe(true)
    })

    it('deve processar cadastro com senha complexa', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
      })

      const complexPassword = 'MinhaSenh@Compl3xa!2024'
      const result = await signup(
        { name: 'usuario_complexo', password: complexPassword },
        complexPassword,
      )

      expect(result).toBe(true)
    })

    it('deve rejeitar senhas que não batem por diferença sutil', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      const result = await signup({ name: 'usuario', password: 'senha123' }, 'senha123 ')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Senhas devem ser iguais')
    })

    it('deve aceitar nome com apenas espaços (5+ caracteres)', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
      })

      const result = await signup({ name: '     ', password: 'senha123' }, 'senha123')

      expect(result).toBe(true)
    })

    it('deve aceitar nome com acentos', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
      })

      const result = await signup({ name: 'José Silva', password: 'senha123' }, 'senha123')

      expect(result).toBe(true)
    })
  })

  describe('Cenários de Erro Específicos', () => {
    it('deve tratar erro de usuário duplicado', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      mockRequestWithoutAuth.mockResolvedValue({
        success: false,
        message: 'Usuário já existe no sistema',
      })

      const result = await signup({ name: 'admin', password: 'senha123' }, 'senha123')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Usuário já existe no sistema')
    })

    it('deve tratar erro de validação do servidor', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      mockRequestWithoutAuth.mockResolvedValue({
        success: false,
        message: 'Dados inválidos fornecidos',
      })

      const result = await signup({ name: 'usuario', password: 'senha123' }, 'senha123')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Dados inválidos fornecidos')
    })

    it('deve tratar erro de servidor interno', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      mockRequestWithoutAuth.mockResolvedValue({
        success: false,
        message: 'Erro interno do servidor',
      })

      const result = await signup({ name: 'usuario', password: 'senha123' }, 'senha123')

      expect(result).toBe(false)
      expect(mockShowError).toHaveBeenCalledWith('Erro interno do servidor')
    })
  })

  describe('Integração de Validação e Signup', () => {
    it('deve executar fluxo completo de validação e cadastro', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup, validateSignupData } = useSignup()

      const signupData = { name: 'novouser', password: 'senhasegura' }
      const confirmPassword = 'senhasegura'
      const validationResult = validateSignupData(signupData, confirmPassword)
      expect(validationResult).toBe(true)
      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        message: 'Conta criada com sucesso',
      })

      const signupResult = await signup(signupData, confirmPassword)

      expect(signupResult).toBe(true)
      expect(mockShowSuccess).toHaveBeenCalledWith('Conta criada com sucesso')
    })

    it('deve falhar signup se validação falhar', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup } = useSignup()

      const result = await signup({ name: 'usr', password: 'pass' }, 'pass')

      expect(result).toBe(false)
      expect(mockRequestWithoutAuth).not.toHaveBeenCalled()
      expect(mockShowError).toHaveBeenCalledWith('Nome deve ter no mínimo 5 caracteres')
    })

    it('deve manter estado consistente durante múltiplas tentativas', async () => {
      const { useSignup } = await import('../../composables/useSignup')
      const { signup, isLoading } = useSignup()
      await signup({ name: 'abc', password: 'senha123' }, 'senha123')
      expect(isLoading.value).toBe(false)
      mockRequestWithoutAuth.mockRejectedValue(new Error('Network error'))
      await signup({ name: 'usuario', password: 'senha123' }, 'senha123')
      expect(isLoading.value).toBe(false)
      mockRequestWithoutAuth.mockResolvedValue({ success: true })
      const result = await signup({ name: 'usuario', password: 'senha123' }, 'senha123')
      expect(result).toBe(true)
      expect(isLoading.value).toBe(false)
    })
  })
})
