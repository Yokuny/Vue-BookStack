import { ref } from 'vue'
import { requestWithoutAuth, fetchConfig } from '../utils/fetch.config'
import { useToast } from './useToast'

export interface SignupData {
  name: string
  password: string
}

export const useSignup = () => {
  const isLoading = ref(false)
  const toast = useToast()

  const validateSignupData = (data: SignupData, confirmPassword: string): boolean => {
    if (!data.name || !data.password || !confirmPassword) {
      toast.showError('Preencha todos os campos')
      return false
    }

    if (data.name.length < 5) {
      toast.showError('Nome deve ter no mínimo 5 caracteres')
      return false
    }

    if (data.password.length < 5) {
      toast.showError('Senha deve ter no mínimo 5 caracteres')
      return false
    }

    if (data.password !== confirmPassword) {
      toast.showError('Senhas devem ser iguais')
      return false
    }

    return true
  }

  const signup = async (data: SignupData, confirmPassword: string): Promise<boolean> => {
    if (!validateSignupData(data, confirmPassword)) return false

    isLoading.value = true

    try {
      const res = await requestWithoutAuth('/user/signup', fetchConfig(data, 'POST'))

      if (res.success) {
        if (res.message) {
          toast.showSuccess(res.message)
        }
        return true
      } else {
        if (res.message) {
          toast.showError(res.message)
        }
        return false
      }
    } catch {
      const errorMessage = 'Falha ao criar usuário. Tente novamente.'
      toast.showError(errorMessage)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    signup,
    validateSignupData,
  }
}
