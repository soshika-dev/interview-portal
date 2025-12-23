import { ref } from 'vue'

export const useDraftStorage = (storageKey, initialValue) => {
  const lastSavedAt = ref(null)

  const loadDraft = () => {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  const saveDraft = (value) => {
    localStorage.setItem(storageKey, JSON.stringify(value))
    lastSavedAt.value = new Date().toISOString()
  }

  const clearDraft = () => {
    localStorage.removeItem(storageKey)
    lastSavedAt.value = null
  }

  return {
    lastSavedAt,
    loadDraft,
    saveDraft,
    clearDraft
  }
}
