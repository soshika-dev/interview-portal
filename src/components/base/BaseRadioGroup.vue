<template>
  <div class="form-control">
    <div class="label">
      <span class="label-text text-sm font-semibold">{{ label }}</span>
    </div>
    <div class="flex flex-col gap-2">
      <label v-for="option in options" :key="option.value" class="label cursor-pointer justify-start gap-3">
        <input v-model="model" type="radio" class="radio radio-primary" :value="option.value" @change="emit('change')" />
        <span class="label-text">{{ option.label }}</span>
      </label>
    </div>
    <p v-if="error" class="mt-1 text-xs text-error flex items-center gap-1">
      <span>●</span>
      <span>{{ error }}</span>
    </p>
  </div>
</template>

<script setup>
const model = defineModel({ type: String, default: '' })

defineProps({
  label: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    default: () => []
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change'])
</script>
