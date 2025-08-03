import { ref, onMounted } from 'vue'
import type { Method } from '../utils/fetch.config'
import { basicRequest, requestWithoutAuth, fetchConfig } from '../utils/fetch.config'
import { useToast } from './useToast'

export interface SigninData {
  name: string
  password: string
}

export interface AuthTokenData {
  accessToken: string
  message?: string
}

const isAuthenticated = ref(false)
const currentUser = ref<string | null>(null)
const accessToken = ref<string | null>(null)

export const useAuth = () => {
  const isLoading = ref(false)
  const toast = useToast()

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const res = await requestWithoutAuth('/auth/refresh', fetchConfig({}, 'POST'))

      if (res.success && res.data?.accessToken) {
        accessToken.value = res.data.accessToken
        isAuthenticated.value = true
        if (res.message) toast.showSuccess(res.message)
        return true
      } else {
        if (res.message) toast.showError(res.message)
        return false
      }
    } catch {
      toast.showError('Não foi possível renovar o acesso. Entre novamente.')
      return false
    }
  }

  const signin = async (data: SigninData): Promise<boolean> => {
    if (!data.name || !data.password) {
      toast.showError('Por favor, preencha todos os campos')
      return false
    }

    isLoading.value = true

    try {
      const res = await requestWithoutAuth('/auth/signin', fetchConfig(data, 'POST'))

      if (res.success && res.data?.accessToken) {
        accessToken.value = res.data.accessToken
        isAuthenticated.value = true
        currentUser.value = data.name
        if (res.message) toast.showSuccess(res.message)
        return true
      } else {
        if (res.message) toast.showError(res.message)
        return false
      }
    } catch {
      toast.showError('Falha ao entrar. Tente novamente.')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    accessToken.value = null
    isAuthenticated.value = false
    currentUser.value = null
    await makeAuthenticatedRequest('/auth/logout', 'POST')
  }

  const makeAuthenticatedRequest = async (path: string, method: Method = 'GET', body?: object) => {
    const makeRequest = () =>
      basicRequest(path, fetchConfig(body, method, accessToken.value || undefined))

    let res = await makeRequest()
    if (res.success === false && res.message?.includes('401')) {
      const refreshed = await refreshAccessToken()

      if (refreshed) {
        res = await makeRequest()
      } else {
        logout()
      }
    }

    return res
  }

  const checkAuthOnMount = async () => {
    if (!isAuthenticated.value) await refreshAccessToken()
  }

  onMounted(() => {
    checkAuthOnMount()
  })

  return {
    isAuthenticated,
    currentUser,
    accessToken,
    isLoading,
    signin,
    logout,
    refreshAccessToken,
    makeAuthenticatedRequest,
    checkAuthOnMount,
  }
}
