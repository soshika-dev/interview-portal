<template>
  <div class="bg-base-200 border border-base-300 rounded-2xl p-4">
    <ul class="steps w-full">
      <li class="step" :class="currentStep >= 1 ? 'step-primary' : ''">اطلاعات شخصی</li>
      <li class="step" :class="currentStep >= 2 ? 'step-primary' : ''">مهارت نرم</li>
      <li class="step" :class="currentStep >= 3 ? 'step-primary' : ''">چالش کدنویسی</li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true
  }
})
</script>
