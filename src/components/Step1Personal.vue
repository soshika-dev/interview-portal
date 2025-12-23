<template>
  <div class="card bg-base-100 shadow-lg border border-base-200">
    <div class="card-body space-y-6">
      <div>
        <h2 class="card-title text-xl">مرحله ۱: اطلاعات شخصی و رزومه</h2>
        <p class="text-sm text-base-content/70">لطفاً اطلاعات پایه خود را وارد کنید تا با شما در تماس باشیم.</p>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <label class="form-control">
          <div class="label"><span class="label-text">نام و نام خانوادگی</span></div>
          <input v-model="model.fullName" type="text" class="input input-bordered" />
          <p v-if="errors.fullName" class="text-error text-xs mt-1">{{ errors.fullName }}</p>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">ایمیل</span></div>
          <input v-model="model.email" type="email" class="input input-bordered" />
          <p v-if="errors.email" class="text-error text-xs mt-1">{{ errors.email }}</p>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">شماره موبایل</span></div>
          <input v-model="model.phone" type="tel" class="input input-bordered" placeholder="09xxxxxxxxx یا +98" />
          <p v-if="errors.phone" class="text-error text-xs mt-1">{{ errors.phone }}</p>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">شهر محل سکونت</span></div>
          <input v-model="model.city" type="text" class="input input-bordered" />
          <p v-if="errors.city" class="text-error text-xs mt-1">{{ errors.city }}</p>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">لینک گیت‌هاب (اختیاری)</span></div>
          <input v-model="model.github" type="url" class="input input-bordered" placeholder="https://github.com/username" />
          <p v-if="errors.github" class="text-error text-xs mt-1">{{ errors.github }}</p>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">لینک لینکدین (اختیاری)</span></div>
          <input v-model="model.linkedin" type="url" class="input input-bordered" placeholder="https://linkedin.com/in/username" />
          <p v-if="errors.linkedin" class="text-error text-xs mt-1">{{ errors.linkedin }}</p>
        </label>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <label class="form-control">
          <div class="label"><span class="label-text">سطح ارشدیت</span></div>
          <select v-model="model.seniority" class="select select-bordered">
            <option value="" disabled>انتخاب کنید</option>
            <option value="کارآموز">کارآموز</option>
            <option value="جونیور">جونیور</option>
            <option value="میدل">میدل</option>
            <option value="سینیور">سینیور</option>
          </select>
          <p v-if="errors.seniority" class="text-error text-xs mt-1">{{ errors.seniority }}</p>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">حوزه علاقه</span></div>
          <select v-model="model.interest" class="select select-bordered">
            <option value="" disabled>انتخاب کنید</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Mobile">Mobile</option>
            <option value="DevOps">DevOps</option>
            <option value="Data">Data</option>
            <option value="Full-stack">Full-stack</option>
          </select>
          <p v-if="errors.interest" class="text-error text-xs mt-1">{{ errors.interest }}</p>
        </label>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <label class="form-control">
          <div class="label">
            <span class="label-text">آپلود رزومه (PDF فقط، حداکثر ۵ مگابایت)</span>
          </div>
          <input
            type="file"
            class="file-input file-input-bordered"
            accept="application/pdf"
            @change="onResumeChange"
          />
          <p v-if="fileErrors.resume" class="text-error text-xs mt-1">{{ fileErrors.resume }}</p>
          <p v-else-if="errors.resume" class="text-error text-xs mt-1">{{ errors.resume }}</p>
          <p v-else-if="model.resumeMeta" class="text-xs mt-1 text-base-content/70">
            رزومه ذخیره شده: {{ model.resumeMeta.name }} ({{ model.resumeMeta.sizeLabel }})
            <span v-if="!fileState.resume" class="text-warning"> - نیاز به بارگذاری مجدد برای ارسال نهایی</span>
          </p>
        </label>

        <label class="form-control">
          <div class="label">
            <span class="label-text">آپلود نمونه‌کار/پورتفولیو (اختیاری، zip/pdf، حداکثر ۱۵ مگابایت)</span>
          </div>
          <input
            type="file"
            class="file-input file-input-bordered"
            accept="application/pdf,application/zip"
            @change="onPortfolioChange"
          />
          <p v-if="fileErrors.portfolio" class="text-error text-xs mt-1">{{ fileErrors.portfolio }}</p>
          <p v-else-if="model.portfolioMeta" class="text-xs mt-1 text-base-content/70">
            نمونه‌کار ذخیره شده: {{ model.portfolioMeta.name }} ({{ model.portfolioMeta.sizeLabel }})
            <span v-if="!fileState.portfolio" class="text-warning"> - نیاز به بارگذاری مجدد برای ارسال نهایی</span>
          </p>
        </label>
      </div>

      <label class="form-control">
        <label class="cursor-pointer flex items-center gap-3">
          <input v-model="model.consent" type="checkbox" class="checkbox checkbox-primary" />
          <span class="label-text">با پردازش اطلاعات برای استخدام موافقم</span>
        </label>
        <p v-if="errors.consent" class="text-error text-xs mt-1">{{ errors.consent }}</p>
      </label>

      <div class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <button class="btn btn-outline" type="button" @click="emit('save-draft')">ذخیره موقت</button>
        <div class="text-xs text-base-content/60" v-if="lastSavedAt">آخرین ذخیره: {{ lastSavedAt }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

const emit = defineEmits(['save-draft', 'resume-change', 'portfolio-change'])

const onResumeChange = (event) => {
  const file = event.target.files?.[0] || null
  emit('resume-change', file)
}

const onPortfolioChange = (event) => {
  const file = event.target.files?.[0] || null
  emit('portfolio-change', file)
}
</script>
