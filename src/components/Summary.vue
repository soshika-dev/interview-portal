<template>
  <div class="card bg-base-100 shadow-xl border border-base-200">
    <div class="card-body space-y-6">
      <div class="flex items-center gap-3">
        <div class="badge badge-success badge-lg">موفق</div>
        <div>
          <h2 class="card-title text-xl">درخواست شما با موفقیت ثبت شد</h2>
          <p class="text-sm text-base-content/70">کد رهگیری: <span class="font-semibold">{{ trackingCode }}</span></p>
        </div>
      </div>

      <div class="bg-base-200 rounded-xl p-4">
        <h3 class="font-semibold mb-3">خلاصه اطلاعات</h3>
        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p>نام: {{ data.step1.fullName }}</p>
            <p>ایمیل: {{ maskEmail(data.step1.email) }}</p>
            <p>موبایل: {{ maskPhone(data.step1.phone) }}</p>
            <p>شهر: {{ data.step1.city }}</p>
            <p>سطح ارشدیت: {{ data.step1.seniority }}</p>
            <p>حوزه علاقه: {{ data.step1.interest }}</p>
          </div>
          <div>
            <p>گیت‌هاب: {{ data.step1.github || '---' }}</p>
            <p>لینکدین: {{ data.step1.linkedin || '---' }}</p>
            <p>رزومه: {{ data.step1.resumeMeta?.name || '---' }}</p>
            <p>نمونه‌کار: {{ data.step1.portfolioMeta?.name || '---' }}</p>
            <p>سوالات مهارت نرم: {{ softSkillAnsweredCount }} از ۱۰</p>
          </div>
        </div>
      </div>

      <div class="bg-base-200 rounded-xl p-4 text-sm space-y-2">
        <p>سطح چالش: {{ data.step3.difficulty }}</p>
        <p>زبان انتخابی: {{ data.step3.language }}</p>
        <p>لینک ریپو: {{ data.step3.repoLink || '---' }}</p>
        <p>فایل راه‌حل: {{ data.step3.solutionMeta?.name || '---' }}</p>
        <p>لینک اجرای آنلاین: {{ data.step3.liveLink || '---' }}</p>
      </div>

      <div class="flex flex-col md:flex-row gap-3">
        <button class="btn btn-primary" type="button" @click="exportJson">دانلود خروجی JSON</button>
        <button class="btn btn-outline" type="button" @click="emit('reset')">ثبت درخواست جدید</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

const softSkillAnsweredCount = computed(() => {
  const values = Object.values(props.data.step2)
  return values.filter((item) => item !== null && item !== undefined && String(item).trim() !== '').length
})

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
</script>
