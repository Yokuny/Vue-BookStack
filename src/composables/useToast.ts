import { toast } from 'vue3-toastify'

export interface ToastOptions {
  autoClose?: number
  position?:
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center'
}

export const useToast = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      autoClose: 3000,
      ...options,
    })
  }

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      autoClose: 5000,
      ...options,
    })
  }

  const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(message, {
      autoClose: 3000,
      ...options,
    })
  }

  const showWarning = (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      autoClose: 4000,
      ...options,
    })
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}
