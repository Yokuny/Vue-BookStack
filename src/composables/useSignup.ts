import { ref } from 'vue'
import { requestWithoutAuth, fetchConfig } from '../utils/fetch.config'

export interface SignupData {
  name: string
  password: string
}

export const useSignup = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)

  const clearMessages = () => {
    error.value = null
    success.value = null
  }

  const validateSignupData = (data: SignupData, confirmPassword: string): boolean => {
    clearMessages()

    if (!data.name || !data.password || !confirmPassword) {
      error.value = 'Preencha todos os campos'
      return false
    }

    if (data.name.length < 5) {
      error.value = 'Nome deve ter no mínimo 5 caracteres'
      return false
    }

    if (data.password.length < 5) {
      error.value = 'Senha deve ter no mínimo 5 caracteres'
      return false
    }

    if (data.password !== confirmPassword) {
      error.value = 'Senhas devem ser iguais'
      return false
    }

    return true
  }

  const signup = async (data: SignupData, confirmPassword: string): Promise<boolean> => {
    if (!validateSignupData(data, confirmPassword)) return false

    isLoading.value = true
    clearMessages()

    try {
      const res = await requestWithoutAuth('/user/signup', fetchConfig(data, 'POST'))

      if (res.success) {
        if (res.message) success.value = res.message
        return true
      } else {
        if (res.message) error.value = res.message
        return false
      }
    } catch {
      error.value = 'Falha ao criar usuário. Tente novamente.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    success,
    signup,
    clearMessages,
    validateSignupData,
  }
}
