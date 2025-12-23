export const isRequired = (value) => value !== null && value !== undefined && String(value).trim() !== ''

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())

export const isValidIranPhone = (value) => {
  const cleaned = String(value || '').replace(/[\s-]/g, '').trim()
  return /^(\+98|0)?9\d{9}$/.test(cleaned)
}

export const isValidUrl = (value) => {
  if (!value) return true
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return ''
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1)
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`
}
