<template>
  <div class="card bg-base-100 shadow-lg border border-base-200">
    <div class="card-body space-y-6">
      <div>
        <h2 class="card-title text-xl">مرحله ۲: سوالات مهارت نرم و ترجیح‌های کاری</h2>
        <p class="text-sm text-base-content/70">حداقل به ۸ سوال پاسخ دهید. دو سوال تشریحی الزامی هستند.</p>
      </div>

      <div class="bg-base-200 rounded-xl p-4">
        <div class="flex items-center justify-between text-sm">
          <span>پیشرفت پاسخ‌ها</span>
          <span class="font-semibold">{{ answeredCount }} از ۱۰</span>
        </div>
        <progress class="progress progress-primary mt-2" :value="answeredCount" max="10"></progress>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <label class="form-control">
          <div class="label"><span class="label-text">ترجیح محیط کاری</span></div>
          <div class="flex flex-col gap-2">
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="model.workEnv" type="radio" class="radio radio-primary" value="اتاق شلوغ و پرانرژی" />
              <span class="label-text">اتاق شلوغ و پرانرژی</span>
            </label>
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="model.workEnv" type="radio" class="radio radio-primary" value="محیط آرام و کم‌رفت‌وآمد" />
              <span class="label-text">محیط آرام و کم‌رفت‌وآمد</span>
            </label>
          </div>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">نحوه دریافت بازخورد</span></div>
          <select v-model="model.feedbackStyle" class="select select-bordered">
            <option value="" disabled>انتخاب کنید</option>
            <option value="مستقیم و سریع">مستقیم و سریع</option>
            <option value="در جلسه خصوصی">در جلسه خصوصی</option>
            <option value="کتبی">کتبی</option>
          </select>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">کار تیمی در برابر کار مستقل (۱ کم تا ۵ زیاد)</span></div>
          <input v-model.number="model.teamworkScale" type="range" min="1" max="5" class="range range-primary" />
          <div class="flex justify-between text-xs px-1">
            <span>۱</span>
            <span>۵</span>
          </div>
          <p class="text-xs mt-1 text-base-content/60">مقدار انتخابی: {{ model.teamworkScale || '---' }}</p>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">وقتی تسک مبهم است چه می‌کنید؟</span></div>
          <select v-model="model.ambiguousTask" class="select select-bordered">
            <option value="" disabled>انتخاب کنید</option>
            <option value="سوال می‌پرسم و دامنه را شفاف می‌کنم">سوال می‌پرسم و دامنه را شفاف می‌کنم</option>
            <option value="فرضیات می‌نویسم و شروع می‌کنم">فرضیات می‌نویسم و شروع می‌کنم</option>
            <option value="از هم‌تیمی کمک می‌گیرم">از هم‌تیمی کمک می‌گیرم</option>
            <option value="نمونه مشابه پیدا می‌کنم">نمونه مشابه پیدا می‌کنم</option>
          </select>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">مدیریت تعارض در تیم</span></div>
          <select v-model="model.conflictHandling" class="select select-bordered">
            <option value="" disabled>انتخاب کنید</option>
            <option value="گفت‌وگوی مستقیم و محترمانه">گفت‌وگوی مستقیم و محترمانه</option>
            <option value="درگیر کردن لید یا مدیر">درگیر کردن لید یا مدیر</option>
            <option value="مستندسازی اختلاف و حل مرحله‌ای">مستندسازی اختلاف و حل مرحله‌ای</option>
            <option value="تغییر مسئولیت برای کاهش تنش">تغییر مسئولیت برای کاهش تنش</option>
          </select>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">ترجیح می‌دهید هم‌زمان چند تسک داشته باشید یا تمرکز روی یکی؟</span></div>
          <div class="flex flex-col gap-2">
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="model.multitaskPreference" type="radio" class="radio radio-primary" value="چند تسک موازی" />
              <span class="label-text">چند تسک موازی</span>
            </label>
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="model.multitaskPreference" type="radio" class="radio radio-primary" value="تمرکز روی یک تسک" />
              <span class="label-text">تمرکز روی یک تسک</span>
            </label>
          </div>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">میزان راحتی با ارائه دادن (۱ کم تا ۵ زیاد)</span></div>
          <input v-model.number="model.presentationComfort" type="range" min="1" max="5" class="range range-primary" />
          <div class="flex justify-between text-xs px-1">
            <span>۱</span>
            <span>۵</span>
          </div>
          <p class="text-xs mt-1 text-base-content/60">مقدار انتخابی: {{ model.presentationComfort || '---' }}</p>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">ساعات کاری ترجیحی</span></div>
          <div class="flex flex-col gap-2">
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="model.workHours" type="radio" class="radio radio-primary" value="شناور" />
              <span class="label-text">شناور</span>
            </label>
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="model.workHours" type="radio" class="radio radio-primary" value="ثابت" />
              <span class="label-text">ثابت</span>
            </label>
            <label class="label cursor-pointer justify-start gap-3">
              <input v-model="model.workHours" type="radio" class="radio radio-primary" value="ترکیبی" />
              <span class="label-text">ترکیبی</span>
            </label>
          </div>
        </label>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <label class="form-control">
          <div class="label"><span class="label-text">مثال کوتاه از یک شکست و چیزی که یاد گرفتید</span></div>
          <textarea v-model="model.failureLesson" class="textarea textarea-bordered min-h-[120px]"></textarea>
          <p v-if="errors.failureLesson" class="text-error text-xs mt-1">{{ errors.failureLesson }}</p>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">مثال کوتاه از همکاری موفق تیمی</span></div>
          <textarea v-model="model.teamSuccess" class="textarea textarea-bordered min-h-[120px]"></textarea>
          <p v-if="errors.teamSuccess" class="text-error text-xs mt-1">{{ errors.teamSuccess }}</p>
        </label>
      </div>

      <div class="alert alert-info">
        <span>برای ادامه، حداقل به ۸ سوال پاسخ دهید. پاسخ‌های تشریحی الزامی هستند.</span>
      </div>
      <div v-if="errors.progress" class="alert alert-warning">
        <span>{{ errors.progress }}</span>
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
  lastSavedAt: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['save-draft'])

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
</script>
