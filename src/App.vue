<template>
  <div class="min-h-screen bg-base-100">
    <nav class="navbar bg-base-100 border-b border-base-200 sticky top-0 z-20">
      <div class="navbar-start">
        <div class="flex flex-col">
          <span class="text-lg font-bold">آواگستر</span>
          <span class="text-xs text-base-content/60">Avagostar</span>
        </div>
      </div>
      <div class="navbar-center hidden lg:flex">
        <span class="text-base font-semibold">پرتال جذب توسعه‌دهندگان</span>
      </div>
      <div class="navbar-end gap-2">
        <a class="btn btn-ghost btn-sm">درباره ما</a>
        <a class="btn btn-ghost btn-sm">سؤالات متداول</a>
        <a class="btn btn-ghost btn-sm">پشتیبانی</a>
      </div>
    </nav>

    <header class="bg-gradient-to-bl from-base-200 via-base-100 to-base-200">
      <div class="max-w-6xl mx-auto px-4 py-12 md:py-16 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
        <div class="space-y-6">
          <div class="badge badge-primary badge-outline">آواگستر | Avagostar</div>
          <h1 class="text-3xl md:text-4xl font-bold leading-relaxed">
            پرتال درخواست همکاری توسعه‌دهندگان نرم‌افزار
          </h1>
          <p class="text-base-content/70 leading-7">
            در آواگستر به دنبال افرادی هستیم که عاشق ساختن محصولات مقیاس‌پذیر و مدرن هستند. فرم زیر به شما کمک می‌کند
            تا سریع، شفاف و بدون پیچیدگی درخواست خود را ثبت کنید.
          </p>
          <button class="btn btn-primary" @click="startApplication">شروع درخواست</button>
        </div>
        <div class="card bg-base-100 shadow-xl border border-base-200">
          <div class="card-body space-y-4">
            <h2 class="card-title">مسیر ثبت درخواست</h2>
            <p class="text-sm text-base-content/70">سه مرحله کوتاه برای جمع‌آوری اطلاعات کلیدی شما.</p>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2"><span class="badge badge-primary">۱</span> اطلاعات شخصی و رزومه</li>
              <li class="flex items-center gap-2"><span class="badge badge-primary">۲</span> مهارت نرم و ترجیح‌های کاری</li>
              <li class="flex items-center gap-2"><span class="badge badge-primary">۳</span> چالش کدنویسی</li>
            </ul>
            <div class="alert alert-info text-sm">
              میانگین زمان تکمیل: حدود ۲۰ دقیقه
            </div>
          </div>
        </div>
      </div>
    </header>

    <main id="application" class="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <Stepper v-if="!submitted" :current-step="currentStep" />

      <div v-if="submitted">
        <Summary :data="payload" :tracking-code="trackingCode" @reset="resetApplication" />
      </div>

      <div v-else class="space-y-6">
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
        />

        <Step2SoftSkills
          v-if="currentStep === 2"
          v-model="form.step2"
          :errors="errors.step2"
          :last-saved-at="formattedSavedAt"
          @save-draft="saveDraft"
        />

        <Step3Challenge
          v-if="currentStep === 3"
          v-model="form.step3"
          :errors="errors.step3"
          :file-errors="fileErrors.step3"
          :file-state="fileState"
          :last-saved-at="formattedSavedAt"
          @save-draft="saveDraft"
          @solution-change="handleSolution"
        />

        <div class="flex flex-col md:flex-row gap-3 md:justify-between">
          <button class="btn btn-outline" type="button" :disabled="currentStep === 1" @click="goBack">
            بازگشت
          </button>
          <div class="flex gap-3">
            <button v-if="currentStep < 3" class="btn btn-primary" type="button" @click="goNext">ادامه</button>
            <button
              v-else
              class="btn btn-primary"
              type="button"
              :class="loading ? 'loading' : ''"
              @click="submitApplication"
            >
              ارسال نهایی
            </button>
          </div>
        </div>
      </div>

      <div class="alert alert-warning text-sm">
        <span>اطلاعات به صورت محلی ذخیره می‌شود و در ارسال نهایی تنها متادیتای فایل‌ها ثبت خواهد شد.</span>
      </div>
    </main>
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
import {
  formatFileSize,
  isRequired,
  isValidEmail,
  isValidIranPhone,
  isValidUrl
} from './utils/validators'
import { generateTrackingCode } from './utils/trackingCode'

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
const draft = storage.loadDraft()
const form = reactive(initialData())

if (draft) {
  Object.assign(form.step1, draft.step1 || {})
  Object.assign(form.step2, draft.step2 || {})
  Object.assign(form.step3, draft.step3 || {})
}

const fileState = reactive({
  resume: null,
  portfolio: null,
  solution: null
})

const errors = reactive({
  step1: {},
  step2: {},
  step3: {}
})

const fileErrors = reactive({
  step1: {},
  step3: {}
})

const formattedSavedAt = computed(() => {
  if (!storage.lastSavedAt.value) return ''
  return new Date(storage.lastSavedAt.value).toLocaleString('fa-IR')
})

const saveDraft = () => {
  storage.saveDraft(form)
}

watch(
  form,
  () => {
    storage.saveDraft(form)
  },
  { deep: true }
)

const startApplication = () => {
  currentStep.value = 1
  document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })
}

const handleResume = (file) => {
  fileErrors.step1.resume = ''
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
}

const validateStep1 = () => {
  errors.step1 = {}
  if (!isRequired(form.step1.fullName)) errors.step1.fullName = 'نام و نام خانوادگی الزامی است.'
  if (!isRequired(form.step1.email)) {
    errors.step1.email = 'ایمیل الزامی است.'
  } else if (!isValidEmail(form.step1.email)) {
    errors.step1.email = 'فرمت ایمیل معتبر نیست.'
  }
  if (!isRequired(form.step1.phone)) {
    errors.step1.phone = 'شماره موبایل الزامی است.'
  } else if (!isValidIranPhone(form.step1.phone)) {
    errors.step1.phone = 'فرمت شماره موبایل معتبر نیست.'
  }
  if (!isRequired(form.step1.city)) errors.step1.city = 'شهر محل سکونت الزامی است.'
  if (form.step1.github && !isValidUrl(form.step1.github)) errors.step1.github = 'لینک گیت‌هاب معتبر نیست.'
  if (form.step1.linkedin && !isValidUrl(form.step1.linkedin)) errors.step1.linkedin = 'لینک لینکدین معتبر نیست.'
  if (!isRequired(form.step1.seniority)) errors.step1.seniority = 'سطح ارشدیت الزامی است.'
  if (!isRequired(form.step1.interest)) errors.step1.interest = 'حوزه علاقه الزامی است.'
  if (!form.step1.resumeMeta) errors.step1.resume = 'رزومه الزامی است.'
  if (!form.step1.consent) errors.step1.consent = 'تأیید موافقت الزامی است.'
  return Object.keys(errors.step1).length === 0
}

const validateStep2 = () => {
  errors.step2 = {}
  if (!isRequired(form.step2.failureLesson)) errors.step2.failureLesson = 'این پاسخ الزامی است.'
  if (!isRequired(form.step2.teamSuccess)) errors.step2.teamSuccess = 'این پاسخ الزامی است.'
  const answered = Object.values(form.step2).filter((item) => isRequired(item)).length
  if (answered < 8) errors.step2.progress = 'حداقل باید به ۸ سوال پاسخ دهید.'
  return Object.keys(errors.step2).length === 0
}

const validateStep3 = () => {
  errors.step3 = {}
  if (!isRequired(form.step3.language)) errors.step3.language = 'انتخاب زبان الزامی است.'
  if (form.step3.repoLink && !isValidUrl(form.step3.repoLink)) {
    errors.step3.repoLink = 'لینک ریپازیتوری معتبر نیست.'
  }
  if (form.step3.liveLink && !isValidUrl(form.step3.liveLink)) {
    errors.step3.liveLink = 'لینک اجرای آنلاین معتبر نیست.'
  }
  if (!form.step3.repoLink && !form.step3.solutionMeta) {
    errors.step3.repoLink = 'یکی از گزینه‌های لینک ریپو یا فایل zip الزامی است.'
  }
  if (!isRequired(form.step3.approach)) errors.step3.approach = 'توضیح رویکرد الزامی است.'
  if (!form.step3.ownCode) errors.step3.ownCode = 'تأیید مالکیت کد الزامی است.'
  return Object.keys(errors.step3).length === 0
}

const goNext = () => {
  if (currentStep.value === 1 && !validateStep1()) return
  if (currentStep.value === 2 && !validateStep2()) return
  if (currentStep.value < 3) currentStep.value += 1
}

const goBack = () => {
  if (currentStep.value > 1) currentStep.value -= 1
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
  errors.step1 = {}
  errors.step2 = {}
  errors.step3 = {}
  currentStep.value = 1
  submitted.value = false
  trackingCode.value = ''
}
</script>
