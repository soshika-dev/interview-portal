<template>
  <div class="surface-card">
    <div class="p-6 md:p-8 space-y-6">
      <header class="space-y-2">
        <h2 class="text-xl md:text-2xl">مرحله ۱: اطلاعات شخصی و رزومه</h2>
        <p class="text-sm text-base-content/70">
          لطفاً اطلاعات پایه خود را وارد کنید تا ارتباط اولیه با شما دقیق و سریع انجام شود.
        </p>
      </header>

      <div class="section-divider"></div>

      <div class="grid md:grid-cols-2 gap-4">
        <BaseInput
          v-model="model.fullName"
          label="نام و نام خانوادگی"
          placeholder="نمونه: سارا محمدی"
          :error="errors.fullName"
          @blur="emit('validate-field', 'fullName')"
        />
        <BaseInput
          v-model="model.email"
          label="ایمیل"
          type="email"
          placeholder="name@example.com"
          :error="errors.email"
          @blur="emit('validate-field', 'email')"
        />
        <BaseInput
          v-model="model.phone"
          label="شماره موبایل"
          type="tel"
          placeholder="نمونه: ۰۹۱۲۱۲۳۴۵۶۷ یا +۹۸۹۱۲..."
          inputmode="tel"
          :error="errors.phone"
          hint="از فرمت‌های متداول ایران پشتیبانی می‌شود."
          @blur="emit('validate-field', 'phone')"
        />
        <BaseInput
          v-model="model.city"
          label="شهر محل سکونت"
          placeholder="نمونه: تهران"
          :error="errors.city"
          @blur="emit('validate-field', 'city')"
        />
        <BaseInput
          v-model="model.github"
          label="لینک گیت‌هاب"
          type="url"
          placeholder="https://github.com/username"
          hint="در صورت داشتن نمونه کد عمومی وارد کنید."
          :error="errors.github"
          optional
          clearable
          @blur="emit('validate-field', 'github')"
        />
        <BaseInput
          v-model="model.linkedin"
          label="لینک لینکدین"
          type="url"
          placeholder="https://linkedin.com/in/username"
          hint="پروفایل حرفه‌ای شما به تصمیم‌گیری کمک می‌کند."
          :error="errors.linkedin"
          optional
          clearable
          @blur="emit('validate-field', 'linkedin')"
        />
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <BaseSelect
          v-model="model.seniority"
          label="سطح ارشدیت"
          :options="seniorityOptions"
          placeholder="انتخاب کنید"
          :error="errors.seniority"
          @blur="emit('validate-field', 'seniority')"
        />
        <BaseSelect
          v-model="model.interest"
          label="حوزه علاقه"
          :options="interestOptions"
          placeholder="انتخاب کنید"
          :error="errors.interest"
          @blur="emit('validate-field', 'interest')"
        />
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <FileUpload
          label="آپلود رزومه"
          accept="application/pdf"
          hint="فرمت PDF تا سقف ۵ مگابایت"
          :error="fileErrors.resume || errors.resume"
          :meta="model.resumeMeta"
          :needs-reattach="!fileState.resume && !!model.resumeMeta"
          @change="emit('resume-change', $event)"
        />
        <FileUpload
          label="نمونه‌کار / پورتفولیو"
          accept="application/pdf,application/zip"
          hint="فرمت PDF یا ZIP تا سقف ۱۵ مگابایت"
          :error="fileErrors.portfolio"
          :meta="model.portfolioMeta"
          :needs-reattach="!fileState.portfolio && !!model.portfolioMeta"
          optional
          @change="emit('portfolio-change', $event)"
        />
      </div>

      <div class="section-divider"></div>

      <div class="space-y-2">
        <label class="flex items-center gap-3">
          <input v-model="model.consent" type="checkbox" class="checkbox checkbox-primary" @change="emit('validate-field', 'consent')" />
          <span class="text-sm">با پردازش اطلاعات برای استخدام موافقم</span>
        </label>
        <p v-if="errors.consent" class="text-xs text-error flex items-center gap-1">
          <span>●</span>
          <span>{{ errors.consent }}</span>
        </p>
      </div>

      <footer class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <button class="btn btn-outline btn-sm" type="button" @click="emit('save-draft')">
          ذخیره موقت
        </button>
        <div class="text-xs text-base-content/60" v-if="lastSavedAt">آخرین ذخیره: {{ lastSavedAt }}</div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import BaseInput from './base/BaseInput.vue'
import BaseSelect from './base/BaseSelect.vue'
import FileUpload from './base/FileUpload.vue'

const model = defineModel({ type: Object, required: true })

defineProps({
  errors: {
    type: Object,
    default: () => ({})
  },
  fileErrors: {
    type: Object,
    default: () => ({})
  },
  fileState: {
    type: Object,
    default: () => ({})
  },
  lastSavedAt: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['save-draft', 'resume-change', 'portfolio-change', 'validate-field'])

const seniorityOptions = [
  { value: 'کارآموز', label: 'کارآموز' },
  { value: 'جونیور', label: 'جونیور' },
  { value: 'میدل', label: 'میدل' },
  { value: 'سینیور', label: 'سینیور' }
]

const interestOptions = [
  { value: 'Frontend', label: 'Front-end' },
  { value: 'Backend', label: 'Back-end' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Data', label: 'Data' },
  { value: 'Full-stack', label: 'Full-stack' }
]
</script>
