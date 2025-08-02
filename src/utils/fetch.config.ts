const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const fetchConfig = (body?: object, method: Method = 'GET', accessToken?: string) => {
  const headers: HeadersStructure = {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }

  if (accessToken) headers.headers.Authorization = `Bearer ${accessToken}`

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    headers.body = JSON.stringify(body)
  }

  return headers
}

export const basicRequest = async (path: string, config: HeadersStructure) => {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, config)
    const data: ApiResponse = await res.json()
    return data
  } catch {
    return {
      success: false,
      message: 'Falha na requisição. Tente novamente.',
    }
  }
}

export const requestWithoutAuth = async (path: string, config: HeadersStructure) => {
  const { Authorization, ...headersWithoutAuth } = config.headers
  const configWithoutAuth = {
    ...config,
    headers: headersWithoutAuth,
  }

  return await basicRequest(path, configWithoutAuth)
}

export const GET = (accessToken?: string) => fetchConfig(undefined, 'GET', accessToken)
export const POST = (body: object, accessToken?: string) => fetchConfig(body, 'POST', accessToken)
export const PUT = (body: object, accessToken?: string) => fetchConfig(body, 'PUT', accessToken)
export const DELETE = (accessToken?: string) => fetchConfig(undefined, 'DELETE', accessToken)
export const PATCH = (body: object, accessToken?: string) => fetchConfig(body, 'PATCH', accessToken)

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type HeadersStructure = {
  method: Method
  headers: { 'Content-Type': string; Authorization?: string }
  body?: string
  credentials: RequestCredentials
}

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  message?: string
}
