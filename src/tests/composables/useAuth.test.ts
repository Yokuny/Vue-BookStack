import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onMounted: vi.fn(),
  }
})

const mockShowSuccess = vi.fn()
const mockShowError = vi.fn()
const mockRequestWithoutAuth = vi.fn()
const mockBasicRequest = vi.fn()
const mockFetchConfig = vi.fn()

vi.mock('../../composables/useToast', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}))

vi.mock('../../utils/fetch.config', () => ({
  requestWithoutAuth: mockRequestWithoutAuth,
  basicRequest: mockBasicRequest,
  fetchConfig: mockFetchConfig,
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchConfig.mockReturnValue({ method: 'POST', body: {} })
    mockBasicRequest.mockResolvedValue({ success: true })
  })

  describe('Estado Inicial', () => {
    it('deve ter estado inicial correto', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { isAuthenticated, currentUser, accessToken, isLoading } = useAuth()

      expect(isAuthenticated.value).toBe(false)
      expect(currentUser.value).toBe(null)
      expect(accessToken.value).toBe(null)
      expect(isLoading.value).toBe(false)
    })
  })

  describe('Validação de Entrada', () => {
    it('deve validar campos obrigatórios no signin', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { signin } = useAuth()

      const result = await signin({ name: '', password: '' })
      expect(result).toBe(false)
      expect(mockRequestWithoutAuth).not.toHaveBeenCalled()
    })

    it('deve validar name vazio', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { signin } = useAuth()

      const result = await signin({ name: '', password: 'senha123' })
      expect(result).toBe(false)
    })

    it('deve validar password vazio', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { signin } = useAuth()

      const result = await signin({ name: 'usuario', password: '' })
      expect(result).toBe(false)
    })
  })

  describe('Login com Sucesso', () => {
    it('deve fazer login com dados válidos', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { signin, isAuthenticated, currentUser, accessToken } = useAuth()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        data: { accessToken: 'test-token-123' },
        message: 'Login realizado com sucesso',
      })

      const result = await signin({ name: 'usuario', password: 'senha123' })

      expect(result).toBe(true)
      expect(isAuthenticated.value).toBe(true)
      expect(currentUser.value).toBe('usuario')
      expect(accessToken.value).toBe('test-token-123')
    })

    it('deve processar resposta sem mensagem', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { signin } = useAuth()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        data: { accessToken: 'token-sem-mensagem' },
      })

      const result = await signin({ name: 'user', password: 'pass' })
      expect(result).toBe(true)
    })
  })

  describe('Falhas de Login', () => {
    it('deve tratar resposta de erro do servidor', async () => {
      vi.resetModules()
      const { useAuth } = await import('../../composables/useAuth')
      const { signin, isAuthenticated } = useAuth()

      mockRequestWithoutAuth.mockResolvedValue({
        success: false,
        message: 'Credenciais inválidas',
      })

      const result = await signin({ name: 'usuario', password: 'senha-errada' })

      expect(result).toBe(false)
      expect(result).toBe(false)
    })

    it('deve tratar resposta sem dados', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { signin } = useAuth()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        data: null,
      })

      const result = await signin({ name: 'usuario', password: 'senha' })
      expect(result).toBe(false)
    })

    it('deve tratar exceções de rede', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { signin, isLoading } = useAuth()

      mockRequestWithoutAuth.mockRejectedValue(new Error('Network error'))

      const result = await signin({ name: 'usuario', password: 'senha' })

      expect(result).toBe(false)
      expect(isLoading.value).toBe(false)
    })
  })

  describe('Conta de Visitante', () => {
    it('deve criar conta de visitante com sucesso', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { createGuestAccount, isAuthenticated, currentUser } = useAuth()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        data: { accessToken: 'guest-token' },
      })

      const result = await createGuestAccount()

      expect(result).toBe(true)
      expect(isAuthenticated.value).toBe(true)
      expect(currentUser.value).toBe('Visitante')
    })

    it('deve tratar erro na criação de visitante', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { createGuestAccount } = useAuth()

      mockRequestWithoutAuth.mockResolvedValue({
        success: false,
        message: 'Erro interno',
      })

      const result = await createGuestAccount()
      expect(result).toBe(false)
    })

    it('deve tratar exceção na criação de visitante', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { createGuestAccount, isLoading } = useAuth()

      mockRequestWithoutAuth.mockRejectedValue(new Error('Server error'))

      const result = await createGuestAccount()

      expect(result).toBe(false)
      expect(isLoading.value).toBe(false)
    })
  })

  describe('Refresh Token', () => {
    it('deve renovar token com sucesso', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { refreshAccessToken, isAuthenticated, accessToken } = useAuth()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        data: { accessToken: 'new-refresh-token' },
      })

      const result = await refreshAccessToken()

      expect(result).toBe(true)
      expect(isAuthenticated.value).toBe(true)
      expect(accessToken.value).toBe('new-refresh-token')
    })

    it('deve falhar quando refresh é inválido', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { refreshAccessToken } = useAuth()

      mockRequestWithoutAuth.mockResolvedValue({
        success: false,
        message: 'Token expirado',
      })

      const result = await refreshAccessToken()
      expect(result).toBe(false)
    })

    it('deve tratar erro de rede no refresh', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { refreshAccessToken } = useAuth()

      mockRequestWithoutAuth.mockRejectedValue(new Error('Network error'))

      const result = await refreshAccessToken()
      expect(result).toBe(false)
    })
  })

  describe('Logout', () => {
    it('deve limpar estado ao fazer logout', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { logout, signin, isAuthenticated, currentUser, accessToken } = useAuth()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        data: { accessToken: 'login-token' },
      })
      await signin({ name: 'usuario', password: 'senha' })

      expect(isAuthenticated.value).toBe(true)

      await logout()

      expect(isAuthenticated.value).toBe(false)
      expect(currentUser.value).toBe(null)
      expect(accessToken.value).toBe(null)
    })

    it('deve chamar endpoint de logout', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { logout } = useAuth()

      await logout()

      expect(mockBasicRequest).toHaveBeenCalledWith('/auth/logout', expect.any(Object))
    })
  })

  describe('Requisições Autenticadas', () => {
    it('deve fazer requisição com token', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { makeAuthenticatedRequest, signin } = useAuth()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        data: { accessToken: 'auth-token' },
      })
      await signin({ name: 'user', password: 'pass' })

      mockBasicRequest.mockResolvedValue({ success: true, data: { books: [] } })

      const result = await makeAuthenticatedRequest('/books')

      expect(result.success).toBe(true)
      expect(mockBasicRequest).toHaveBeenCalled()
    })

    it('deve renovar token em caso de 401', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { makeAuthenticatedRequest, signin } = useAuth()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        data: { accessToken: 'initial-token' },
      })
      await signin({ name: 'user', password: 'pass' })

      const mock401 = { success: false, message: 'Token expired 401' }
      const mockSuccess = { success: true, data: { books: [] } }

      mockBasicRequest.mockResolvedValueOnce(mock401).mockResolvedValueOnce(mockSuccess)

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        data: { accessToken: 'refreshed-token' },
      })

      const result = await makeAuthenticatedRequest('/books')

      expect(result.success).toBe(true)
      expect(mockBasicRequest).toHaveBeenCalledTimes(2)
    })

    it('deve fazer logout quando refresh falha', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { makeAuthenticatedRequest, signin, isAuthenticated } = useAuth()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        data: { accessToken: 'token' },
      })
      await signin({ name: 'user', password: 'pass' })

      mockBasicRequest.mockResolvedValue({ success: false, message: 'Token expired 401' })
      mockRequestWithoutAuth.mockResolvedValue({ success: false })

      await makeAuthenticatedRequest('/books')

      expect(isAuthenticated.value).toBe(false)
    })
  })

  describe('Estados de Loading', () => {
    it('deve gerenciar loading no signin', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { signin, isLoading } = useAuth()

      expect(isLoading.value).toBe(false)

      mockRequestWithoutAuth.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 10)),
      )

      const signinPromise = signin({ name: 'user', password: 'pass' })
      expect(isLoading.value).toBe(true)

      await signinPromise
      expect(isLoading.value).toBe(false)
    })

    it('deve gerenciar loading no createGuestAccount', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { createGuestAccount, isLoading } = useAuth()

      expect(isLoading.value).toBe(false)

      mockRequestWithoutAuth.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 10)),
      )

      const guestPromise = createGuestAccount()
      expect(isLoading.value).toBe(true)

      await guestPromise
      expect(isLoading.value).toBe(false)
    })
  })

  describe('Integração e Fluxos Completos', () => {
    it('deve manter consistência entre login e logout', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { signin, logout, isAuthenticated, currentUser, accessToken } = useAuth()

      expect(isAuthenticated.value).toBe(false)

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        data: { accessToken: 'complete-flow-token' },
      })
      await signin({ name: 'testuser', password: 'testpass' })

      expect(isAuthenticated.value).toBe(true)
      expect(currentUser.value).toBe('testuser')
      expect(accessToken.value).toBe('complete-flow-token')

      await logout()

      expect(isAuthenticated.value).toBe(false)
      expect(currentUser.value).toBe(null)
      expect(accessToken.value).toBe(null)
    })

    it('deve funcionar com diferentes tipos de resposta', async () => {
      const { useAuth } = await import('../../composables/useAuth')
      const { signin } = useAuth()

      mockRequestWithoutAuth.mockResolvedValue({
        success: true,
        data: { accessToken: 'minimal-token' },
      })

      const result = await signin({ name: 'user', password: 'pass' })
      expect(result).toBe(true)
    })
  })
})
