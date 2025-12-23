<template>
  <div class="surface-card">
    <div class="p-6 md:p-8 space-y-6">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-2xl bg-success/15 text-success flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M2.25 12a9.75 9.75 0 1 1 19.5 0 9.75 9.75 0 0 1-19.5 0Zm14.28-1.72a.75.75 0 0 0-1.06-1.06l-4.72 4.72-1.72-1.72a.75.75 0 0 0-1.06 1.06l2.25 2.25c.3.3.77.3 1.06 0l5.25-5.25Z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl md:text-2xl">درخواست شما با موفقیت ثبت شد</h2>
          <p class="text-sm text-base-content/70">کد رهگیری: <span class="font-semibold">{{ trackingCode }}</span></p>
        </div>
      </div>

      <div class="grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
        <div class="bg-base-200 rounded-2xl p-4 space-y-3">
          <h3 class="font-semibold">خلاصه اطلاعات</h3>
          <div class="grid md:grid-cols-2 gap-3 text-sm">
            <div class="space-y-1">
              <p>نام: {{ data.step1.fullName }}</p>
              <p>ایمیل: {{ maskEmail(data.step1.email) }}</p>
              <p>موبایل: {{ maskPhone(data.step1.phone) }}</p>
              <p>شهر: {{ data.step1.city }}</p>
            </div>
            <div class="space-y-1">
              <p>سطح ارشدیت: {{ data.step1.seniority }}</p>
              <p>حوزه علاقه: {{ data.step1.interest }}</p>
              <p>گیت‌هاب: {{ data.step1.github || '---' }}</p>
              <p>لینکدین: {{ data.step1.linkedin || '---' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-base-200 rounded-2xl p-4 text-sm space-y-2">
          <p>سطح چالش: {{ data.step3.difficulty }}</p>
          <p>زبان انتخابی: {{ data.step3.language }}</p>
          <p>لینک ریپو: {{ data.step3.repoLink || '---' }}</p>
          <p>فایل راه‌حل: {{ data.step3.solutionMeta?.name || '---' }}</p>
          <p>لینک اجرای آنلاین: {{ data.step3.liveLink || '---' }}</p>
        </div>
      </div>

      <div class="bg-base-200 rounded-2xl p-4 text-sm space-y-2">
        <h3 class="font-semibold">گام‌های بعدی</h3>
        <ul class="list-disc pr-5 space-y-1">
          <li>اطلاعات شما تا ۷ روز کاری بررسی می‌شود.</li>
          <li>در صورت نیاز، هماهنگی مصاحبه فنی از طریق ایمیل انجام خواهد شد.</li>
          <li>برای پیگیری از کد رهگیری استفاده کنید.</li>
        </ul>
      </div>

      <div class="flex flex-col md:flex-row gap-3">
        <button class="btn btn-primary" type="button" @click="copyTracking">کپی کد رهگیری</button>
        <button class="btn btn-outline" type="button" @click="exportJson">دانلود خروجی JSON</button>
        <button class="btn btn-ghost" type="button" @click="emit('reset')">ثبت درخواست جدید</button>
      </div>

      <p v-if="copied" class="text-xs text-success">کد رهگیری کپی شد.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  trackingCode: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['reset'])

const copied = ref(false)

const maskEmail = (email) => {
  if (!email) return ''
  const [name, domain] = email.split('@')
  return `${name.slice(0, 2)}***@${domain}`
}

const maskPhone = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\s+/g, '')
  return `${cleaned.slice(0, 4)}***${cleaned.slice(-2)}`
}

const exportJson = () => {
  const payload = JSON.stringify(props.data, null, 2)
  const blob = new Blob([payload], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `avagostar-application-${props.trackingCode}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const copyTracking = async () => {
  try {
    await navigator.clipboard.writeText(props.trackingCode)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch {
    copied.value = false
  }
}
</script>
