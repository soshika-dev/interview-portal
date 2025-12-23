<template>
  <div class="form-control">
    <div class="label">
      <span class="label-text text-sm font-semibold">
        {{ label }}
        <span v-if="optional" class="text-xs text-base-content/50">(اختیاری)</span>
      </span>
    </div>
    <textarea
      v-model="model"
      :placeholder="placeholder"
      :rows="rows"
      class="textarea-base"
      @blur="emit('blur')"
    ></textarea>
    <p v-if="hint" class="mt-1 text-xs text-base-content/60">{{ hint }}</p>
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
  placeholder: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 4
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
