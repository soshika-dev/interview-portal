<template>
  <div class="card bg-base-100 shadow-lg border border-base-200">
    <div class="card-body space-y-6">
      <div>
        <h2 class="card-title text-xl">مرحله ۳: مسئله کدنویسی و ارسال راه‌حل</h2>
        <p class="text-sm text-base-content/70">یکی از سطوح را انتخاب کنید و راه‌حل خود را ارسال نمایید.</p>
      </div>

      <div class="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        <div class="space-y-4">
          <label class="form-control">
            <div class="label"><span class="label-text">انتخاب سطح دشواری</span></div>
            <select v-model="model.difficulty" class="select select-bordered">
              <option value="متوسط">متوسط</option>
              <option value="سخت">سخت</option>
            </select>
          </label>

          <div class="card bg-base-200 border border-base-300">
            <div class="card-body space-y-3">
              <h3 class="font-semibold">صورت مسئله</h3>
              <p class="text-sm leading-7">{{ problemStatement }}</p>
              <ul class="list-disc pr-5 text-sm space-y-1">
                <li>زمان پیشنهادی: ۹۰ تا ۱۲۰ دقیقه</li>
                <li>خروجی را به صورت README واضح توضیح دهید.</li>
                <li>معیار ارزیابی: خوانایی، تست‌پذیری، و کیفیت معماری.</li>
              </ul>
            </div>
          </div>

          <div class="card bg-base-200 border border-base-300">
            <div class="card-body space-y-2">
              <h4 class="font-semibold">راهنمای ساختار پیشنهادی</h4>
              <p class="text-sm">
                <span class="badge badge-outline">/src</span>
                <span class="badge badge-outline">/tests</span>
                <span class="badge badge-outline">README.md</span>
                <span class="badge badge-outline">/docs</span>
              </p>
              <p class="text-xs text-base-content/60">ساختار واقعی را بر اساس راه‌حل خود تنظیم کنید.</p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <label class="form-control">
            <div class="label"><span class="label-text">انتخاب زبان</span></div>
            <select v-model="model.language" class="select select-bordered">
              <option value="" disabled>انتخاب کنید</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="Go">Go</option>
            </select>
            <p v-if="errors.language" class="text-error text-xs mt-1">{{ errors.language }}</p>
          </label>

          <label class="form-control">
            <div class="label"><span class="label-text">لینک ریپازیتوری Git (الزامی اگر فایل ارسال نمی‌کنید)</span></div>
            <input v-model="model.repoLink" type="url" class="input input-bordered" placeholder="https://github.com/username/repo" />
            <p v-if="errors.repoLink" class="text-error text-xs mt-1">{{ errors.repoLink }}</p>
          </label>

          <label class="form-control">
            <div class="label"><span class="label-text">آپلود فایل راه‌حل (zip)</span></div>
            <input type="file" class="file-input file-input-bordered" accept="application/zip" @change="onSolutionChange" />
            <p v-if="fileErrors.solution" class="text-error text-xs mt-1">{{ fileErrors.solution }}</p>
            <p v-else-if="model.solutionMeta" class="text-xs mt-1 text-base-content/70">
              فایل ذخیره شده: {{ model.solutionMeta.name }} ({{ model.solutionMeta.sizeLabel }})
              <span v-if="!fileState.solution" class="text-warning"> - نیاز به بارگذاری مجدد برای ارسال نهایی</span>
            </p>
          </label>

          <label class="form-control">
            <div class="label"><span class="label-text">لینک اجرای آنلاین (اختیاری)</span></div>
            <input v-model="model.liveLink" type="url" class="input input-bordered" placeholder="https://codesandbox.io/..." />
            <p v-if="errors.liveLink" class="text-error text-xs mt-1">{{ errors.liveLink }}</p>
          </label>

          <label class="form-control">
            <div class="label"><span class="label-text">توضیح رویکرد</span></div>
            <textarea v-model="model.approach" class="textarea textarea-bordered min-h-[140px]"></textarea>
            <p v-if="errors.approach" class="text-error text-xs mt-1">{{ errors.approach }}</p>
          </label>

          <label class="form-control">
            <label class="cursor-pointer flex items-center gap-3">
              <input v-model="model.ownCode" type="checkbox" class="checkbox checkbox-primary" />
              <span class="label-text">کد را خودم نوشته‌ام</span>
            </label>
            <p v-if="errors.ownCode" class="text-error text-xs mt-1">{{ errors.ownCode }}</p>
          </label>
        </div>
      </div>

      <div class="alert alert-info">
        <span>ارسال راه‌حل از طریق لینک گیت یا فایل zip انجام می‌شود. یکی از این دو لازم است.</span>
      </div>

      <div class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <button class="btn btn-outline" type="button" @click="emit('save-draft')">ذخیره موقت</button>
        <div class="text-xs text-base-content/60" v-if="lastSavedAt">آخرین ذخیره: {{ lastSavedAt }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

const emit = defineEmits(['save-draft', 'solution-change'])

const problemStatement = computed(() => {
  if (model.value.difficulty === 'سخت') {
    return 'یک سرویس زمان‌بندی بسازید که بازه‌های زمانی متعدد را دریافت و کوتاه‌ترین زمان آزاد برای جلسه ۴۵ دقیقه‌ای را پیدا کند. ورودی شامل بازه‌های اشغال‌شده چند کاربر است و باید خروجی به صورت اولین بازه آزاد بازگردانده شود.'
  }
  return 'یک سیستم مدیریت تسک بسازید که بتواند لیست کارها را بر اساس اولویت و تاریخ سررسید مرتب کند، و همچنین گزارشی از کارهای نزدیک به موعد ارائه دهد.'
})

const onSolutionChange = (event) => {
  const file = event.target.files?.[0] || null
  emit('solution-change', file)
}
</script>
