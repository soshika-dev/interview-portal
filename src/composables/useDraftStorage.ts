import { ref } from 'vue'

type DraftPayload<T> = {
  data: T
  savedAt: string
}

export const useDraftStorage = <T extends Record<string, any>>(storageKey: string) => {
  const lastSavedAt = ref<string | null>(null)

  const loadDraft = (): T | null => {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw) as DraftPayload<T>
      if (parsed?.savedAt) {
        lastSavedAt.value = parsed.savedAt
      }
      return parsed?.data ?? null
    } catch {
      return null
    }
  }

  const saveDraft = (value: T) => {
    const payload: DraftPayload<T> = {
      data: value,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem(storageKey, JSON.stringify(payload))
    lastSavedAt.value = payload.savedAt
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
