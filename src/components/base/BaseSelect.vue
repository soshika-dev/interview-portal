<template>
  <div class="form-control">
    <div class="label">
      <span class="label-text text-sm font-semibold">
        {{ label }}
        <span v-if="optional" class="text-xs text-base-content/50">(اختیاری)</span>
      </span>
    </div>
    <select v-model="model" class="select-base" @blur="emit('blur')">
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="hint" class="mt-1 text-xs text-base-content/60">{{ hint }}</p>
    <p v-if="error" class="mt-1 text-xs text-error flex items-center gap-1">
      <span>●</span>
      <span>{{ error }}</span>
    </p>
  </div>
</template>

<script setup>
const model = defineModel({ type: [String, Number], default: '' })

defineProps({
  label: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  optional: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['blur'])
</script>
