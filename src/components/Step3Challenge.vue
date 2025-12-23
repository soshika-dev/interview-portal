<template>
  <div class="surface-card">
    <div class="p-6 md:p-8 space-y-6">
      <header class="space-y-2">
        <h2 class="text-xl md:text-2xl">مرحله ۳: مسئله کدنویسی و ارسال راه‌حل</h2>
        <p class="text-sm text-base-content/70">یکی از سطوح را انتخاب کنید و راه‌حل خود را ارسال نمایید.</p>
      </header>

      <div class="section-divider"></div>

      <div class="grid lg:grid-cols-[1.25fr_0.9fr] gap-6">
        <div class="space-y-4">
          <BaseSelect
            v-model="model.difficulty"
            label="انتخاب سطح دشواری"
            :options="difficultyOptions"
          />

          <div class="bg-base-200/70 rounded-2xl p-4 border border-base-300">
            <h3 class="font-semibold mb-3">شرح مسئله</h3>
            <div class="space-y-3 text-sm">
              <div>
                <p class="font-semibold">هدف</p>
                <p class="text-base-content/70">{{ problem.goal }}</p>
              </div>
              <div>
                <p class="font-semibold">ورودی / خروجی</p>
                <p class="text-base-content/70">{{ problem.io }}</p>
              </div>
              <div>
                <p class="font-semibold">مثال</p>
                <p class="text-base-content/70">{{ problem.example }}</p>
              </div>
              <div>
                <p class="font-semibold">محدودیت‌ها</p>
                <p class="text-base-content/70">{{ problem.constraints }}</p>
              </div>
              <div>
                <p class="font-semibold">معیار ارزیابی</p>
                <p class="text-base-content/70">{{ problem.evaluation }}</p>
              </div>
            </div>
          </div>

          <div class="bg-base-200/70 rounded-2xl p-4 border border-base-300">
            <h4 class="font-semibold mb-3">چک‌لیست ارسال</h4>
            <ul class="list-disc pr-5 text-sm space-y-1">
              <li>README شفاف شامل نحوه اجرا و تست</li>
              <li>ساختار پوشه‌بندی پیشنهادی یا توضیح تغییرات</li>
              <li>حداقل یک تست کلیدی یا توضیح استراتژی تست</li>
              <li>شرح تصمیم‌های معماری و فرضیات</li>
            </ul>
          </div>
        </div>

        <div class="space-y-4">
          <BaseSelect
            v-model="model.language"
            label="انتخاب زبان"
            :options="languageOptions"
            placeholder="انتخاب کنید"
            :error="errors.language"
            @blur="emit('validate-field', 'language')"
          />

          <BaseInput
            v-model="model.repoLink"
            label="لینک ریپازیتوری Git"
            type="url"
            placeholder="https://github.com/username/repo"
            hint="در صورت ارسال فایل ZIP الزامی نیست."
            :error="errors.repoLink"
            optional
            clearable
            @blur="emit('validate-field', 'repoLink')"
          />

          <FileUpload
            label="آپلود فایل راه‌حل (ZIP)"
            accept="application/zip"
            hint="حداکثر حجم ۲۰ مگابایت"
            :error="fileErrors.solution"
            :meta="model.solutionMeta"
            :needs-reattach="!fileState.solution && !!model.solutionMeta"
            optional
            @change="emit('solution-change', $event)"
          />

          <BaseInput
            v-model="model.liveLink"
            label="لینک اجرای آنلاین"
            type="url"
            placeholder="https://codesandbox.io/..."
            hint="در صورت داشتن نسخه دیپلوی شده وارد کنید."
            :error="errors.liveLink"
            optional
            clearable
            @blur="emit('validate-field', 'liveLink')"
          />

          <BaseTextarea
            v-model="model.approach"
            label="توضیح رویکرد"
            placeholder="خلاصه‌ای از راه‌حل و تصمیم‌های اصلی را بنویسید."
            :error="errors.approach"
            :rows="6"
            @blur="emit('validate-field', 'approach')"
          />

          <div class="space-y-2">
            <label class="flex items-center gap-3">
              <input v-model="model.ownCode" type="checkbox" class="checkbox checkbox-primary" @change="emit('validate-field', 'ownCode')" />
              <span class="text-sm">کد را خودم نوشته‌ام</span>
            </label>
            <p v-if="errors.ownCode" class="text-xs text-error flex items-center gap-1">
              <span>●</span>
              <span>{{ errors.ownCode }}</span>
            </p>
          </div>
        </div>
      </div>

      <details class="bg-base-200/80 rounded-2xl p-4 border border-base-300">
        <summary class="cursor-pointer font-semibold">پیش‌نمایش اطلاعات</summary>
        <div class="mt-4 space-y-3 text-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">اطلاعات شخصی</p>
              <p class="text-base-content/70">{{ review.step1Summary }}</p>
            </div>
            <button class="btn btn-ghost btn-xs" type="button" @click="emit('edit-step', 1)">ویرایش</button>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">مهارت‌های نرم</p>
              <p class="text-base-content/70">{{ review.step2Summary }}</p>
            </div>
            <button class="btn btn-ghost btn-xs" type="button" @click="emit('edit-step', 2)">ویرایش</button>
          </div>
        </div>
      </details>

      <div v-if="errors.repoLink" class="alert alert-warning text-sm">
        <span>{{ errors.repoLink }}</span>
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
import BaseInput from './base/BaseInput.vue'
import BaseSelect from './base/BaseSelect.vue'
import BaseTextarea from './base/BaseTextarea.vue'
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
  },
  review: {
    type: Object,
    default: () => ({
      step1Summary: '',
      step2Summary: ''
    })
  }
})

const emit = defineEmits(['save-draft', 'solution-change', 'validate-field', 'edit-step'])

const difficultyOptions = [
  { value: 'متوسط', label: 'متوسط' },
  { value: 'سخت', label: 'سخت' }
]

const languageOptions = [
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Python', label: 'Python' },
  { value: 'Java', label: 'Java' },
  { value: 'Go', label: 'Go' }
]

const problem = computed(() => {
  if (model.value.difficulty === 'سخت') {
    return {
      goal: 'یک سرویس زمان‌بندی بسازید که بازه‌های زمانی چند کاربر را دریافت و کوتاه‌ترین زمان آزاد برای جلسه ۴۵ دقیقه‌ای را پیدا کند.',
      io: 'ورودی شامل لیست بازه‌های اشغال‌شده برای هر کاربر است و خروجی اولین بازه آزاد مشترک باید برگردانده شود.',
      example: 'برای بازه‌های اشغال‌شده 09:00-11:00 و 13:00-16:00، خروجی می‌تواند 11:00-11:45 باشد.',
      constraints: 'بازه‌ها می‌توانند هم‌پوشانی داشته باشند و باید با پیچیدگی مناسب ادغام شوند.',
      evaluation: 'خوانایی، مدیریت زمان، تست‌پذیری، و توضیح تصمیم‌های الگوریتمی بررسی می‌شود.'
    }
  }

  return {
    goal: 'یک سیستم مدیریت تسک بسازید که لیست کارها را بر اساس اولویت و تاریخ سررسید مرتب کند و گزارش کارهای نزدیک به موعد ارائه دهد.',
    io: 'ورودی شامل لیستی از کارها با اولویت و تاریخ است و خروجی لیست مرتب‌شده به‌همراه کارهای نزدیک به موعد می‌باشد.',
    example: 'با سه کار دارای تاریخ نزدیک، خروجی باید ابتدا کارهای نزدیک به موعد را نشان دهد.',
    constraints: 'فرض کنید ۵۰۰ تا ۲۰۰۰ تسک در لیست وجود دارد و ترتیب باید پایدار بماند.',
    evaluation: 'ساختار داده، خوانایی، پوشش تست، و کیفیت گزارش‌گیری بررسی می‌شود.'
  }
})
</script>
