<template>
  <div class="surface-card">
    <div class="p-6 md:p-8 space-y-6">
      <header class="space-y-2">
        <h2 class="text-xl md:text-2xl">مرحله ۲: مهارت‌های نرم و ترجیح‌های کاری</h2>
        <p class="text-sm text-base-content/70">حداقل به ۸ سوال پاسخ دهید. دو سوال تشریحی الزامی هستند.</p>
      </header>

      <div class="section-divider"></div>

      <div class="bg-base-200 rounded-2xl p-4 space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span>پیشرفت پاسخ‌ها</span>
          <span class="font-semibold">{{ answeredCount }} از ۱۰</span>
        </div>
        <progress class="progress progress-primary" :value="answeredCount" max="10"></progress>
        <p class="text-xs text-base-content/70">
          برای ادامه حداقل {{ remainingRequired }} پاسخ دیگر لازم است.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <BaseRadioGroup
          v-model="model.workEnv"
          label="ترجیح محیط کاری"
          :options="workEnvOptions"
        />

        <BaseSelect
          v-model="model.feedbackStyle"
          label="نحوه دریافت بازخورد"
          :options="feedbackOptions"
          placeholder="انتخاب کنید"
        />

        <div class="form-control">
          <div class="label">
            <span class="label-text text-sm font-semibold">کار تیمی در برابر کار مستقل (۱ کم تا ۵ زیاد)</span>
          </div>
          <input v-model.number="model.teamworkScale" type="range" min="1" max="5" class="range range-primary" />
          <div class="flex justify-between text-xs px-1">
            <span>۱</span>
            <span>۵</span>
          </div>
          <p class="text-xs mt-1 text-base-content/60">مقدار انتخابی: {{ model.teamworkScale || '---' }}</p>
        </div>

        <BaseSelect
          v-model="model.ambiguousTask"
          label="وقتی تسک مبهم است چه می‌کنید؟"
          :options="ambiguousOptions"
          placeholder="انتخاب کنید"
        />

        <BaseSelect
          v-model="model.conflictHandling"
          label="مدیریت تعارض در تیم"
          :options="conflictOptions"
          placeholder="انتخاب کنید"
        />

        <BaseRadioGroup
          v-model="model.multitaskPreference"
          label="تمرکز روی چند تسک یا یک تسک؟"
          :options="multitaskOptions"
        />

        <div class="form-control">
          <div class="label">
            <span class="label-text text-sm font-semibold">میزان راحتی با ارائه دادن (۱ کم تا ۵ زیاد)</span>
          </div>
          <input v-model.number="model.presentationComfort" type="range" min="1" max="5" class="range range-primary" />
          <div class="flex justify-between text-xs px-1">
            <span>۱</span>
            <span>۵</span>
          </div>
          <p class="text-xs mt-1 text-base-content/60">مقدار انتخابی: {{ model.presentationComfort || '---' }}</p>
        </div>

        <BaseRadioGroup
          v-model="model.workHours"
          label="ساعات کاری ترجیحی"
          :options="workHoursOptions"
        />
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <BaseTextarea
          v-model="model.failureLesson"
          label="مثال کوتاه از یک شکست و چیزی که یاد گرفتید"
          :error="errors.failureLesson"
          placeholder="حداقل یک یا دو جمله کوتاه بنویسید."
          :rows="5"
          @blur="emit('validate-field', 'failureLesson')"
        />

        <BaseTextarea
          v-model="model.teamSuccess"
          label="مثال کوتاه از همکاری موفق تیمی"
          :error="errors.teamSuccess"
          placeholder="نقش شما و نتیجه را توصیف کنید."
          :rows="5"
          @blur="emit('validate-field', 'teamSuccess')"
        />
      </div>

      <div v-if="errors.progress" class="alert alert-warning text-sm">
        <span>{{ errors.progress }}</span>
      </div>

      <footer class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <button class="btn btn-outline btn-sm" type="button" @click="emit('save-draft')">ذخیره موقت</button>
        <div class="text-xs text-base-content/60" v-if="lastSavedAt">آخرین ذخیره: {{ lastSavedAt }}</div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseRadioGroup from './base/BaseRadioGroup.vue'
import BaseSelect from './base/BaseSelect.vue'
import BaseTextarea from './base/BaseTextarea.vue'

const model = defineModel({ type: Object, required: true })

defineProps({
  errors: {
    type: Object,
    default: () => ({})
  },
  lastSavedAt: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['save-draft', 'validate-field'])

const answeredCount = computed(() => {
  const values = [
    model.value.workEnv,
    model.value.feedbackStyle,
    model.value.teamworkScale,
    model.value.ambiguousTask,
    model.value.conflictHandling,
    model.value.multitaskPreference,
    model.value.presentationComfort,
    model.value.failureLesson,
    model.value.teamSuccess,
    model.value.workHours
  ]
  return values.filter((item) => item !== null && item !== undefined && String(item).trim() !== '').length
})

const remainingRequired = computed(() => Math.max(0, 8 - answeredCount.value))

const workEnvOptions = [
  { value: 'اتاق شلوغ و پرانرژی', label: 'اتاق شلوغ و پرانرژی' },
  { value: 'محیط آرام و کم‌رفت‌وآمد', label: 'محیط آرام و کم‌رفت‌وآمد' }
]

const feedbackOptions = [
  { value: 'مستقیم و سریع', label: 'مستقیم و سریع' },
  { value: 'در جلسه خصوصی', label: 'در جلسه خصوصی' },
  { value: 'کتبی', label: 'کتبی' }
]

const ambiguousOptions = [
  { value: 'سوال می‌پرسم و دامنه را شفاف می‌کنم', label: 'سوال می‌پرسم و دامنه را شفاف می‌کنم' },
  { value: 'فرضیات می‌نویسم و شروع می‌کنم', label: 'فرضیات می‌نویسم و شروع می‌کنم' },
  { value: 'از هم‌تیمی کمک می‌گیرم', label: 'از هم‌تیمی کمک می‌گیرم' },
  { value: 'نمونه مشابه پیدا می‌کنم', label: 'نمونه مشابه پیدا می‌کنم' }
]

const conflictOptions = [
  { value: 'گفت‌وگوی مستقیم و محترمانه', label: 'گفت‌وگوی مستقیم و محترمانه' },
  { value: 'درگیر کردن لید یا مدیر', label: 'درگیر کردن لید یا مدیر' },
  { value: 'مستندسازی اختلاف و حل مرحله‌ای', label: 'مستندسازی اختلاف و حل مرحله‌ای' },
  { value: 'تغییر مسئولیت برای کاهش تنش', label: 'تغییر مسئولیت برای کاهش تنش' }
]

const multitaskOptions = [
  { value: 'چند تسک موازی', label: 'چند تسک موازی' },
  { value: 'تمرکز روی یک تسک', label: 'تمرکز روی یک تسک' }
]

const workHoursOptions = [
  { value: 'شناور', label: 'شناور' },
  { value: 'ثابت', label: 'ثابت' },
  { value: 'ترکیبی', label: 'ترکیبی' }
]
</script>
