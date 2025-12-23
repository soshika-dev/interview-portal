<template>
  <div class="min-h-screen text-base-content">
    <nav class="navbar bg-base-100/80 backdrop-blur border-b border-base-300 sticky top-0 z-30">
      <div class="navbar-start">
        <div class="flex flex-col">
          <span class="text-lg font-bold tracking-tight">{{ uiText.brand.fa }}</span>
          <span class="text-xs text-base-content/50">{{ uiText.brand.en }}</span>
        </div>
      </div>
      <div class="navbar-center hidden lg:flex">
        <span class="text-sm font-semibold text-base-content/70">{{ uiText.nav.title }}</span>
      </div>
      <div class="navbar-end gap-2">
        <a v-for="link in uiText.nav.links" :key="link" class="btn btn-ghost btn-xs">{{ link }}</a>
      </div>
    </nav>

    <header class="relative">
      <div class="max-w-4xl mx-auto px-4 py-10 md:py-14 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
        <div class="space-y-5">
          <div class="badge badge-outline badge-primary text-xs">{{ uiText.hero.badge }}</div>
          <h1 class="text-3xl md:text-[32px] leading-relaxed">{{ uiText.hero.title }}</h1>
          <p class="text-base-content/70 text-sm md:text-base">{{ uiText.hero.subtitle }}</p>
          <div class="flex flex-col sm:flex-row gap-3">
            <button class="btn btn-primary" @click="startApplication">{{ uiText.hero.cta }}</button>
            <button class="btn btn-ghost">دانلود بروشور موقعیت‌ها</button>
          </div>
          <div class="grid sm:grid-cols-3 gap-2 text-xs text-base-content/70">
            <div v-for="trust in uiText.hero.trust" :key="trust" class="flex items-center gap-2 bg-base-100/70 border border-base-300 rounded-2xl px-3 py-2">
              <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span>{{ trust }}</span>
            </div>
          </div>
        </div>
        <div class="surface-card">
          <div class="p-6 space-y-4">
            <h2 class="text-lg font-semibold">مسیر ثبت درخواست</h2>
            <p class="text-sm text-base-content/70">سه مرحله کوتاه برای جمع‌آوری اطلاعات کلیدی شما.</p>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2"><span class="badge badge-primary badge-sm">۱</span> اطلاعات شخصی و رزومه</li>
              <li class="flex items-center gap-2"><span class="badge badge-primary badge-sm">۲</span> مهارت نرم و ترجیح‌های کاری</li>
              <li class="flex items-center gap-2"><span class="badge badge-primary badge-sm">۳</span> چالش کدنویسی</li>
            </ul>
            <div class="alert bg-base-200 border border-base-300 text-sm">زمان تکمیل حدود ۱۰ دقیقه</div>
          </div>
        </div>
      </div>
    </header>

    <main id="application" class="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div v-if="!submitted" class="lg:sticky lg:top-4 z-20">
        <Stepper :current-step="currentStep" />
      </div>

      <transition name="fade-slide" mode="out-in">
        <div v-if="submitted" key="summary">
          <Summary :data="payload" :tracking-code="trackingCode" @reset="resetApplication" />
        </div>

        <div v-else key="steps" class="space-y-6">
          <Step1Personal
            v-if="currentStep === 1"
            v-model="form.step1"
            :errors="errors.step1"
            :file-errors="fileErrors.step1"
            :file-state="fileState"
            :last-saved-at="formattedSavedAt"
            @save-draft="saveDraft"
            @resume-change="handleResume"
            @portfolio-change="handlePortfolio"
            @validate-field="(field) => validateField('step1', field)"
          />

          <Step2SoftSkills
            v-if="currentStep === 2"
            v-model="form.step2"
            :errors="errors.step2"
            :last-saved-at="formattedSavedAt"
            @save-draft="saveDraft"
            @validate-field="(field) => validateField('step2', field)"
          />

          <Step3Challenge
            v-if="currentStep === 3"
            v-model="form.step3"
            :errors="errors.step3"
            :file-errors="fileErrors.step3"
            :file-state="fileState"
            :last-saved-at="formattedSavedAt"
            :review="review"
            @save-draft="saveDraft"
            @solution-change="handleSolution"
            @validate-field="(field) => validateField('step3', field)"
            @edit-step="jumpToStep"
          />

          <div class="flex flex-col md:flex-row gap-3 md:justify-between">
            <button class="btn btn-outline" type="button" :disabled="currentStep === 1 || loading" @click="goBack">
              بازگشت
            </button>
            <div class="flex gap-3">
              <button v-if="currentStep < 3" class="btn btn-primary" type="button" @click="goNext">
                ادامه
              </button>
              <button
                v-else
                class="btn btn-primary"
                type="button"
                :class="loading ? 'loading' : ''"
                :disabled="loading"
                @click="submitApplication"
              >
                ارسال نهایی
              </button>
            </div>
          </div>
        </div>
      </transition>

      <div class="alert bg-base-100 border border-base-300 text-xs">
        <span>{{ uiText.footerNote }}</span>
      </div>
    </main>

    <div v-if="showDraftModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">پیش‌نویس ذخیره‌شده یافت شد</h3>
        <p class="py-4 text-sm text-base-content/70">
          یک پیش‌نویس قبلی در مرورگر شما وجود دارد. آیا می‌خواهید آن را بازیابی کنید؟
        </p>
        <div class="modal-action">
          <button class="btn btn-primary" type="button" @click="restoreDraft">بازیابی</button>
          <button class="btn btn-ghost" type="button" @click="discardDraft">حذف پیش‌نویس</button>
        </div>
      </div>
    </div>

    <div class="toast toast-bottom toast-end z-50">
      <div v-for="toast in toasts" :key="toast.id" class="alert shadow-soft" :class="toastClass(toast.tone)">
        <span class="text-xs">{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import Stepper from './components/Stepper.vue'
import Step1Personal from './components/Step1Personal.vue'
import Step2SoftSkills from './components/Step2SoftSkills.vue'
import Step3Challenge from './components/Step3Challenge.vue'
import Summary from './components/Summary.vue'
import { useDraftStorage } from './composables/useDraftStorage'
import { useFormValidation } from './composables/useFormValidation'
import { useToast } from './composables/useToast'
import {
  formatFileSize,
  isRequired,
  isValidEmail,
  isValidIranPhone,
  isValidUrl
} from './utils/validators'
import { generateTrackingCode } from './utils/trackingCode'
import { uiText } from './utils/uiText'

const currentStep = ref(1)
const submitted = ref(false)
const loading = ref(false)
const trackingCode = ref('')

const initialData = () => ({
  step1: {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    github: '',
    linkedin: '',
    seniority: '',
    interest: '',
    resumeMeta: null,
    portfolioMeta: null,
    consent: false
  },
  step2: {
    workEnv: '',
    feedbackStyle: '',
    teamworkScale: '',
    ambiguousTask: '',
    conflictHandling: '',
    multitaskPreference: '',
    presentationComfort: '',
    failureLesson: '',
    teamSuccess: '',
    workHours: ''
  },
  step3: {
    difficulty: 'متوسط',
    language: '',
    repoLink: '',
    solutionMeta: null,
    liveLink: '',
    approach: '',
    ownCode: false
  }
})

const storage = useDraftStorage('avagostar-application-draft')
const form = reactive(initialData())
const pendingDraft = ref(null)
const showDraftModal = ref(false)
const autosaveEnabled = ref(true)

const { toasts, show: showToast } = useToast()

const draft = storage.loadDraft()
if (draft) {
  pendingDraft.value = draft
  showDraftModal.value = true
  autosaveEnabled.value = false
}

const restoreDraft = () => {
  if (!pendingDraft.value) return
  Object.assign(form.step1, pendingDraft.value.step1 || {})
  Object.assign(form.step2, pendingDraft.value.step2 || {})
  Object.assign(form.step3, pendingDraft.value.step3 || {})
  errors.step1 = {}
  errors.step2 = {}
  errors.step3 = {}
  showDraftModal.value = false
  autosaveEnabled.value = true
  showToast('پیش‌نویس بازیابی شد', 'info')
}

const discardDraft = () => {
  storage.clearDraft()
  pendingDraft.value = null
  showDraftModal.value = false
  autosaveEnabled.value = true
  showToast('پیش‌نویس حذف شد', 'warning')
}

const fileState = reactive({
  resume: null,
  portfolio: null,
  solution: null
})

const fileErrors = reactive({
  step1: {},
  step3: {}
})

const validationRules = {
  step1: {
    fullName: (value) => (isRequired(value) ? null : 'نام و نام خانوادگی الزامی است.'),
    email: (value) => {
      if (!isRequired(value)) return 'ایمیل الزامی است.'
      return isValidEmail(value) ? null : 'فرمت ایمیل معتبر نیست.'
    },
    phone: (value) => {
      if (!isRequired(value)) return 'شماره موبایل الزامی است.'
      return isValidIranPhone(value) ? null : 'فرمت شماره موبایل معتبر نیست.'
    },
    city: (value) => (isRequired(value) ? null : 'شهر محل سکونت الزامی است.'),
    github: (value) => (value && !isValidUrl(value) ? 'لینک گیت‌هاب معتبر نیست.' : null),
    linkedin: (value) => (value && !isValidUrl(value) ? 'لینک لینکدین معتبر نیست.' : null),
    seniority: (value) => (isRequired(value) ? null : 'سطح ارشدیت الزامی است.'),
    interest: (value) => (isRequired(value) ? null : 'حوزه علاقه الزامی است.'),
    consent: (value) => (value ? null : 'تأیید موافقت الزامی است.')
  },
  step2: {
    failureLesson: (value) => (isRequired(value) ? null : 'این پاسخ الزامی است.'),
    teamSuccess: (value) => (isRequired(value) ? null : 'این پاسخ الزامی است.')
  },
  step3: {
    language: (value) => (isRequired(value) ? null : 'انتخاب زبان الزامی است.'),
    repoLink: (value, data) => {
      if (value && !isValidUrl(value)) return 'لینک ریپازیتوری معتبر نیست.'
      if (!value && !data.solutionMeta) return 'یکی از گزینه‌های لینک ریپو یا فایل ZIP الزامی است.'
      return null
    },
    liveLink: (value) => (value && !isValidUrl(value) ? 'لینک اجرای آنلاین معتبر نیست.' : null),
    approach: (value) => (isRequired(value) ? null : 'توضیح رویکرد الزامی است.'),
    ownCode: (value) => (value ? null : 'تأیید مالکیت کد الزامی است.')
  }
}

const { errors, validateField: validateFieldBase, validateStep, setFieldError } = useFormValidation(
  validationRules
)

errors.step1 = {}
errors.step2 = {}
errors.step3 = {}

const formattedSavedAt = computed(() => {
  if (!storage.lastSavedAt.value) return ''
  return new Date(storage.lastSavedAt.value).toLocaleString('fa-IR')
})

const step2AnsweredCount = computed(() => {
  const values = Object.values(form.step2)
  return values.filter((item) => item !== null && item !== undefined && String(item).trim() !== '').length
})

const review = computed(() => ({
  step1Summary: `${form.step1.fullName || '---'} · ${form.step1.seniority || '---'} · ${form.step1.city || '---'}`,
  step2Summary: `پاسخ داده‌شده: ${step2AnsweredCount.value} از ۱۰`
}))

let autosaveTimer = null
let lastToastAt = 0

watch(step2AnsweredCount, (value) => {
  if (value >= 8) {
    setFieldError('step2', 'progress', null)
  }
})

const saveDraft = () => {
  storage.saveDraft(JSON.parse(JSON.stringify(form)))
  showToast('ذخیره شد', 'info')
}

watch(
  form,
  () => {
    if (!autosaveEnabled.value) return
    clearTimeout(autosaveTimer)
    autosaveTimer = setTimeout(() => {
      storage.saveDraft(JSON.parse(JSON.stringify(form)))
      const now = Date.now()
      if (now - lastToastAt > 2000) {
        showToast('ذخیره شد', 'info')
        lastToastAt = now
      }
    }, 800)
  },
  { deep: true }
)

const startApplication = () => {
  currentStep.value = 1
  document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })
}

const handleResume = (file) => {
  fileErrors.step1.resume = ''
  setFieldError('step1', 'resume', null)
  if (!file) {
    fileState.resume = null
    form.step1.resumeMeta = null
    return
  }
  if (file.type !== 'application/pdf') {
    fileErrors.step1.resume = 'فرمت فایل رزومه باید PDF باشد.'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    fileErrors.step1.resume = 'حجم رزومه نباید بیشتر از ۵ مگابایت باشد.'
    return
  }
  fileState.resume = file
  form.step1.resumeMeta = {
    name: file.name,
    size: file.size,
    type: file.type,
    sizeLabel: formatFileSize(file.size)
  }
}

const handlePortfolio = (file) => {
  fileErrors.step1.portfolio = ''
  if (!file) {
    fileState.portfolio = null
    form.step1.portfolioMeta = null
    return
  }
  if (!['application/pdf', 'application/zip'].includes(file.type)) {
    fileErrors.step1.portfolio = 'فرمت نمونه‌کار باید PDF یا ZIP باشد.'
    return
  }
  if (file.size > 15 * 1024 * 1024) {
    fileErrors.step1.portfolio = 'حجم نمونه‌کار نباید بیشتر از ۱۵ مگابایت باشد.'
    return
  }
  fileState.portfolio = file
  form.step1.portfolioMeta = {
    name: file.name,
    size: file.size,
    type: file.type,
    sizeLabel: formatFileSize(file.size)
  }
}

const handleSolution = (file) => {
  fileErrors.step3.solution = ''
  if (!file) {
    fileState.solution = null
    form.step3.solutionMeta = null
    return
  }
  if (file.type !== 'application/zip') {
    fileErrors.step3.solution = 'فرمت فایل راه‌حل باید ZIP باشد.'
    return
  }
  if (file.size > 20 * 1024 * 1024) {
    fileErrors.step3.solution = 'حجم فایل راه‌حل نباید بیشتر از ۲۰ مگابایت باشد.'
    return
  }
  fileState.solution = file
  form.step3.solutionMeta = {
    name: file.name,
    size: file.size,
    type: file.type,
    sizeLabel: formatFileSize(file.size)
  }
  validateField('step3', 'repoLink')
}

const validateField = (step, field) => {
  validateFieldBase(step, field, form[step])
}

const validateStep1 = () => {
  const valid = validateStep('step1', form.step1)
  if (!form.step1.resumeMeta) {
    setFieldError('step1', 'resume', 'رزومه الزامی است.')
  }
  return valid && !!form.step1.resumeMeta
}

const validateStep2 = () => {
  const valid = validateStep('step2', form.step2)
  if (step2AnsweredCount.value < 8) {
    setFieldError('step2', 'progress', 'حداقل باید به ۸ سوال پاسخ دهید.')
    return false
  }
  setFieldError('step2', 'progress', null)
  return valid
}

const validateStep3 = () => {
  const valid = validateStep('step3', form.step3)
  return valid
}

const goNext = () => {
  if (currentStep.value === 1 && !validateStep1()) return
  if (currentStep.value === 2 && !validateStep2()) return
  if (currentStep.value < 3) currentStep.value += 1
}

const goBack = () => {
  if (currentStep.value > 1) currentStep.value -= 1
}

const jumpToStep = (step) => {
  currentStep.value = step
  document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })
}

const payload = computed(() => ({
  ...form,
  submittedAt: new Date().toISOString()
}))

const submitApplication = async () => {
  if (!validateStep1() || !validateStep2() || !validateStep3()) return
  loading.value = true
  const requestPayload = payload.value
  await new Promise((resolve) => {
    setTimeout(() => {
      fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      })
        .catch(() => null)
        .finally(resolve)
    }, 1200)
  })
  trackingCode.value = generateTrackingCode()
  submitted.value = true
  loading.value = false
  storage.clearDraft()
}

const resetApplication = () => {
  Object.assign(form.step1, initialData().step1)
  Object.assign(form.step2, initialData().step2)
  Object.assign(form.step3, initialData().step3)
  fileState.resume = null
  fileState.portfolio = null
  fileState.solution = null
  fileErrors.step1 = {}
  fileErrors.step3 = {}
  errors.step1 = {}
  errors.step2 = {}
  errors.step3 = {}
  currentStep.value = 1
  submitted.value = false
  trackingCode.value = ''
}

const toastClass = (tone) => {
  if (tone === 'warning') return 'alert-warning'
  if (tone === 'info') return 'alert-info'
  return 'alert-success'
}
</script>
