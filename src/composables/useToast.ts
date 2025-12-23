import { ref } from 'vue'

export type ToastTone = 'success' | 'info' | 'warning'

type ToastItem = {
  id: number
  message: string
  tone: ToastTone
}

export const useToast = () => {
  const toasts = ref<ToastItem[]>([])
  let counter = 0

  const show = (message: string, tone: ToastTone = 'success', duration = 1800) => {
    const id = counter++
    toasts.value = [...toasts.value, { id, message, tone }]
    setTimeout(() => {
      toasts.value = toasts.value.filter((toast) => toast.id !== id)
    }, duration)
  }

  return {
    toasts,
    show
  }
}
