import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockFetch = vi.fn()
global.fetch = mockFetch

const originalEnv = import.meta.env
beforeEach(() => {
  vi.clearAllMocks()
  import.meta.env = { ...originalEnv }
})

afterEach(() => {
  import.meta.env = originalEnv
})

describe('fetch.config.ts', () => {
  describe('fetchConfig', () => {
    it('deve criar configuração GET padrão', async () => {
      const { fetchConfig } = await import('../../utils/fetch.config')

      const config = fetchConfig()

      expect(config).toEqual({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
    })

    it('deve criar configuração com método específico', async () => {
      const { fetchConfig } = await import('../../utils/fetch.config')

      const config = fetchConfig(undefined, 'DELETE')

      expect(config).toEqual({
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
    })

    it('deve adicionar Authorization header quando accessToken fornecido', async () => {
      const { fetchConfig } = await import('../../utils/fetch.config')

      const config = fetchConfig(undefined, 'GET', 'token123')

      expect(config).toEqual({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token123',
        },
        credentials: 'include',
      })
    })

    it('deve adicionar body para métodos POST', async () => {
      const { fetchConfig } = await import('../../utils/fetch.config')
      const bodyData = { name: 'Teste', author: 'Autor' }

      const config = fetchConfig(bodyData, 'POST')

      expect(config).toEqual({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData),
      })
    })

    it('deve adicionar body para métodos PUT', async () => {
      const { fetchConfig } = await import('../../utils/fetch.config')
      const bodyData = { isbn: '123', name: 'Livro Atualizado' }

      const config = fetchConfig(bodyData, 'PUT')

      expect(config).toEqual({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData),
      })
    })

    it('deve adicionar body para métodos PATCH', async () => {
      const { fetchConfig } = await import('../../utils/fetch.config')
      const bodyData = { isFavorite: true }

      const config = fetchConfig(bodyData, 'PATCH')

      expect(config).toEqual({
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData),
      })
    })

    it('não deve adicionar body para métodos GET mesmo com body fornecido', async () => {
      const { fetchConfig } = await import('../../utils/fetch.config')
      const bodyData = { name: 'Teste' }

      const config = fetchConfig(bodyData, 'GET')

      expect(config).toEqual({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      expect(config).not.toHaveProperty('body')
    })

    it('não deve adicionar body para métodos DELETE mesmo com body fornecido', async () => {
      const { fetchConfig } = await import('../../utils/fetch.config')
      const bodyData = { confirm: true }

      const config = fetchConfig(bodyData, 'DELETE')

      expect(config).toEqual({
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      expect(config).not.toHaveProperty('body')
    })

    it('deve combinar body e accessToken', async () => {
      const { fetchConfig } = await import('../../utils/fetch.config')
      const bodyData = { name: 'Livro', author: 'Autor' }

      const config = fetchConfig(bodyData, 'POST', 'mytoken')

      expect(config).toEqual({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mytoken',
        },
        credentials: 'include',
        body: JSON.stringify(bodyData),
      })
    })

    it('deve funcionar com objetos complexos no body', async () => {
      const { fetchConfig } = await import('../../utils/fetch.config')
      const complexBody = {
        book: { name: 'Livro', author: 'Autor' },
        metadata: { tags: ['fiction', 'adventure'], year: 2024 },
        nested: { deep: { value: 'test' } },
      }

      const config = fetchConfig(complexBody, 'POST')

      expect(config.body).toBe(JSON.stringify(complexBody))
    })

    it('deve funcionar com body vazio', async () => {
      const { fetchConfig } = await import('../../utils/fetch.config')

      const config = fetchConfig({}, 'POST')

      expect(config).toEqual({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      })
    })

    it('deve funcionar com accessToken vazio', async () => {
      const { fetchConfig } = await import('../../utils/fetch.config')

      const config = fetchConfig(undefined, 'GET', '')

      expect(config).toEqual({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      expect(config.headers).not.toHaveProperty('Authorization')
    })
  })

  describe('basicRequest', () => {
    it('deve fazer requisição e retornar dados de sucesso', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, name: 'Livro' },
        message: 'Sucesso!',
      }

      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const { basicRequest, fetchConfig } = await import('../../utils/fetch.config')
      const config = fetchConfig()
      const result = await basicRequest('/books', config)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/books', config)
      expect(result).toEqual(mockResponse)
    })

    it('deve usar URL base padrão quando VITE_API_BASE_URL não configurado', async () => {
      const mockResponse = { success: true, data: [] }
      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const { basicRequest, fetchConfig } = await import('../../utils/fetch.config')
      const config = fetchConfig()
      await basicRequest('/books', config)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/books', config)
    })

    it('deve retornar erro padrão quando fetch falha', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const { basicRequest, fetchConfig } = await import('../../utils/fetch.config')
      const config = fetchConfig()
      const result = await basicRequest('/books', config)

      expect(result).toEqual({
        success: false,
        message: 'Falha na requisição. Tente novamente.',
      })
    })

    it('deve retornar erro padrão quando JSON parsing falha', async () => {
      mockFetch.mockResolvedValue({
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      })

      const { basicRequest, fetchConfig } = await import('../../utils/fetch.config')
      const config = fetchConfig()
      const result = await basicRequest('/books', config)

      expect(result).toEqual({
        success: false,
        message: 'Falha na requisição. Tente novamente.',
      })
    })

    it('deve funcionar com diferentes paths', async () => {
      const mockResponse = { success: true, data: { user: 'test' } }
      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const { basicRequest, fetchConfig } = await import('../../utils/fetch.config')
      const config = fetchConfig()

      const paths = ['/auth/signin', '/books/123', '/users/profile', '/books?page=1']

      for (const path of paths) {
        await basicRequest(path, config)
        expect(mockFetch).toHaveBeenCalledWith(`http://localhost:8080${path}`, config)
      }

      expect(mockFetch).toHaveBeenCalledTimes(4)
    })

    it('deve lidar com respostas vazias', async () => {
      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(null),
      })

      const { basicRequest, fetchConfig } = await import('../../utils/fetch.config')
      const config = fetchConfig()
      const result = await basicRequest('/empty', config)

      expect(result).toBeNull()
    })

    it('deve lidar com respostas de erro do servidor', async () => {
      const errorResponse = {
        success: false,
        message: 'Livro não encontrado',
      }

      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(errorResponse),
      })

      const { basicRequest, fetchConfig } = await import('../../utils/fetch.config')
      const config = fetchConfig()
      const result = await basicRequest('/books/invalid', config)

      expect(result).toEqual(errorResponse)
    })
  })

  describe('requestWithoutAuth', () => {
    it('deve remover Authorization header', async () => {
      const mockResponse = { success: true, data: {} }
      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const { requestWithoutAuth, fetchConfig } = await import('../../utils/fetch.config')
      const configWithAuth = fetchConfig(undefined, 'GET', 'token123')

      await requestWithoutAuth('/public', configWithAuth)

      const expectedConfig = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/public', expectedConfig)
    })

    it('deve manter outros headers', async () => {
      const mockResponse = { success: true }
      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const { requestWithoutAuth } = await import('../../utils/fetch.config')
      const configWithHeaders = {
        method: 'POST' as const,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token123',
        },
        credentials: 'include' as RequestCredentials,
        body: JSON.stringify({ test: 'data' }),
      }

      await requestWithoutAuth('/signup', configWithHeaders)

      const expectedConfig = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ test: 'data' }),
      }

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/signup', expectedConfig)
    })

    it('deve funcionar mesmo sem Authorization header', async () => {
      const mockResponse = { success: true }
      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const { requestWithoutAuth, fetchConfig } = await import('../../utils/fetch.config')
      const configWithoutAuth = fetchConfig()

      await requestWithoutAuth('/public', configWithoutAuth)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/public', configWithoutAuth)
    })

    it('deve propagar erros do basicRequest', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const { requestWithoutAuth, fetchConfig } = await import('../../utils/fetch.config')
      const config = fetchConfig()
      const result = await requestWithoutAuth('/signup', config)

      expect(result).toEqual({
        success: false,
        message: 'Falha na requisição. Tente novamente.',
      })
    })
  })

  describe('Helper Methods (GET, POST, PUT, DELETE, PATCH)', () => {
    it('GET deve criar configuração correta', async () => {
      const { GET } = await import('../../utils/fetch.config')

      const config = GET()

      expect(config).toEqual({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
    })

    it('GET com token deve incluir Authorization', async () => {
      const { GET } = await import('../../utils/fetch.config')

      const config = GET('mytoken')

      expect(config).toEqual({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mytoken',
        },
        credentials: 'include',
      })
    })

    it('POST deve criar configuração com body', async () => {
      const { POST } = await import('../../utils/fetch.config')
      const body = { name: 'Novo Livro' }

      const config = POST(body)

      expect(config).toEqual({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
    })

    it('POST com token deve incluir Authorization e body', async () => {
      const { POST } = await import('../../utils/fetch.config')
      const body = { name: 'Livro Autenticado' }

      const config = POST(body, 'authtoken')

      expect(config).toEqual({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer authtoken',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      })
    })

    it('PUT deve criar configuração com body', async () => {
      const { PUT } = await import('../../utils/fetch.config')
      const body = { name: 'Livro Atualizado' }

      const config = PUT(body)

      expect(config).toEqual({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
    })

    it('DELETE deve criar configuração sem body', async () => {
      const { DELETE } = await import('../../utils/fetch.config')

      const config = DELETE()

      expect(config).toEqual({
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
    })

    it('DELETE com token deve incluir Authorization', async () => {
      const { DELETE } = await import('../../utils/fetch.config')

      const config = DELETE('deletetoken')

      expect(config).toEqual({
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer deletetoken',
        },
        credentials: 'include',
      })
    })

    it('PATCH deve criar configuração com body', async () => {
      const { PATCH } = await import('../../utils/fetch.config')
      const body = { isFavorite: true }

      const config = PATCH(body)

      expect(config).toEqual({
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
    })

    it('PATCH com token deve incluir Authorization e body', async () => {
      const { PATCH } = await import('../../utils/fetch.config')
      const body = { stock: 10 }

      const config = PATCH(body, 'patchtoken')

      expect(config).toEqual({
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer patchtoken',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      })
    })
  })

  describe('Cenários Realistas', () => {
    it('deve simular fluxo de autenticação (signin)', async () => {
      const mockResponse = {
        success: true,
        data: { user: { name: 'João' }, tokens: { access: 'abc123' } },
        message: 'Login realizado com sucesso',
      }

      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const { requestWithoutAuth, POST } = await import('../../utils/fetch.config')
      const loginData = { name: 'joão', password: 'senha123' }
      const config = POST(loginData)

      const result = await requestWithoutAuth('/auth/signin', config)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData),
      })
      expect(result).toEqual(mockResponse)
    })

    it('deve simular criação de livro autenticada', async () => {
      const mockResponse = {
        success: true,
        data: { isbn: '1234567890123', name: 'Novo Livro' },
        message: 'Livro criado com sucesso',
      }

      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const { basicRequest, POST } = await import('../../utils/fetch.config')
      const bookData = {
        isbn: '1234567890123',
        name: 'Novo Livro',
        author: 'Autor',
        description: 'Descrição do livro',
        stock: 5,
      }
      const config = POST(bookData, 'user-token-abc123')

      const result = await basicRequest('/books', config)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer user-token-abc123',
        },
        credentials: 'include',
        body: JSON.stringify(bookData),
      })
      expect(result).toEqual(mockResponse)
    })

    it('deve simular busca de livros com paginação', async () => {
      const mockResponse = {
        success: true,
        data: {
          books: [{ name: 'Livro 1' }, { name: 'Livro 2' }],
          pagination: { page: 1, total: 10 },
        },
      }

      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const { basicRequest, GET } = await import('../../utils/fetch.config')
      const config = GET('user-token')

      const result = await basicRequest('/books?page=1&limit=10&search=aventura', config)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/books?page=1&limit=10&search=aventura',
        config,
      )
      expect(result).toEqual(mockResponse)
    })

    it('deve simular atualização de livro', async () => {
      const mockResponse = {
        success: true,
        data: { isbn: '1234567890123', name: 'Livro Atualizado' },
        message: 'Livro atualizado com sucesso',
      }

      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const { basicRequest, PUT } = await import('../../utils/fetch.config')
      const updateData = { name: 'Livro Atualizado', stock: 15 }
      const config = PUT(updateData, 'admin-token')

      const result = await basicRequest('/books/1234567890123', config)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/books/1234567890123', config)
      expect(result).toEqual(mockResponse)
    })

    it('deve simular toggle de favorito', async () => {
      const mockResponse = {
        success: true,
        data: { isbn: '1234567890123', isFavorite: true },
        message: 'Favorito atualizado',
      }

      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const { basicRequest, PATCH } = await import('../../utils/fetch.config')
      const patchData = { isFavorite: true }
      const config = PATCH(patchData, 'user-token')

      const result = await basicRequest('/books/1234567890123/favorite', config)

      expect(result).toEqual(mockResponse)
    })

    it('deve simular erro de autenticação', async () => {
      const errorResponse = {
        success: false,
        message: 'Token inválido ou expirado',
      }

      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(errorResponse),
      })

      const { basicRequest, GET } = await import('../../utils/fetch.config')
      const config = GET('invalid-token')

      const result = await basicRequest('/books', config)

      expect(result).toEqual(errorResponse)
    })

    it('deve simular falha de rede', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to fetch'))

      const { basicRequest, GET } = await import('../../utils/fetch.config')
      const config = GET()

      const result = await basicRequest('/books', config)

      expect(result).toEqual({
        success: false,
        message: 'Falha na requisição. Tente novamente.',
      })
    })
  })

  describe('Edge Cases', () => {
    it('deve lidar com path vazio', async () => {
      const mockResponse = { success: true, data: {} }
      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const { basicRequest, GET } = await import('../../utils/fetch.config')
      const config = GET()

      await basicRequest('', config)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080', config)
    })

    it('deve lidar com token muito longo', async () => {
      const { GET } = await import('../../utils/fetch.config')
      const longToken = 'a'.repeat(1000)

      const config = GET(longToken)

      expect(config.headers.Authorization).toBe(`Bearer ${longToken}`)
    })

    it('deve lidar com body null', async () => {
      const { fetchConfig } = await import('../../utils/fetch.config')

      const config = fetchConfig(null as any, 'POST')

      expect(config).toEqual({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
    })

    it('deve lidar com caracteres especiais no body', async () => {
      const { POST } = await import('../../utils/fetch.config')
      const specialData = {
        name: 'Livro com çñéntös éspêçíáís',
        description: 'Descrição com emojis 📚✨ e símbolos @#$%',
        unicode: '中文 한글 العربية',
      }

      const config = POST(specialData)

      expect(config.body).toBe(JSON.stringify(specialData))
    })

    it('deve concatenar corretamente path com base URL', async () => {
      const mockResponse = { success: true }
      mockFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      })

      const { basicRequest, GET } = await import('../../utils/fetch.config')
      const config = GET()

      await basicRequest('/books', config)

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/books', config)
    })
  })
})
