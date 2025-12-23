import { reactive } from 'vue'

type Rule<T> = (value: any, data: T) => string | null

type Rules<T> = Record<string, Record<string, Rule<T>>>

type ErrorBag = Record<string, Record<string, string>>

export const useFormValidation = <T extends Record<string, any>>(rules: Rules<T>) => {
  const errors = reactive<ErrorBag>({})

  const setFieldError = (step: string, field: string, message: string | null) => {
    if (!errors[step]) errors[step] = {}
    if (message) {
      errors[step][field] = message
    } else {
      delete errors[step][field]
    }
  }

  const validateField = (step: string, field: string, data: T) => {
    const stepRules = rules[step]
    if (!stepRules || !stepRules[field]) return true
    const message = stepRules[field](data[field], data)
    setFieldError(step, field, message)
    return !message
  }

  const validateStep = (step: string, data: T) => {
    errors[step] = {}
    const stepRules = rules[step]
    if (!stepRules) return true
    Object.entries(stepRules).forEach(([field, rule]) => {
      const message = rule(data[field], data)
      if (message) errors[step][field] = message
    })
    return Object.keys(errors[step]).length === 0
  }

  return {
    errors,
    validateField,
    validateStep,
    setFieldError
  }
}
