<template>
  <div class="bg-base-100/80 backdrop-blur border border-base-300 rounded-2xl p-4 shadow-soft">
    <div class="grid grid-cols-3 gap-2 text-xs md:text-sm">
      <div v-for="step in steps" :key="step.id" class="flex items-center gap-2">
        <span
          class="w-7 h-7 rounded-full flex items-center justify-center border text-xs font-semibold"
          :class="step.id < currentStep ? 'bg-primary text-white border-primary' : step.id === currentStep ? 'bg-base-200 border-primary text-primary' : 'border-base-300 text-base-content/50'"
        >
          <svg v-if="step.id < currentStep" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <span v-else>{{ step.id }}</span>
        </span>
        <div>
          <p class="font-semibold" :class="step.id === currentStep ? 'text-primary' : 'text-base-content'">{{ step.title }}</p>
          <p class="text-[11px] text-base-content/60">{{ step.caption }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentStep: {
    type: Number,
    required: true
  }
})

const steps = [
  { id: 1, title: 'اطلاعات شخصی', caption: 'رزومه و تماس' },
  { id: 2, title: 'مهارت نرم', caption: 'فرهنگ و سبک کاری' },
  { id: 3, title: 'چالش کدنویسی', caption: 'ارسال راه‌حل' }
]
</script>
