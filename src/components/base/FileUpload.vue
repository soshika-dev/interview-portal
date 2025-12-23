<template>
  <div class="form-control">
    <div class="label">
      <span class="label-text text-sm font-semibold">
        {{ label }}
        <span v-if="optional" class="text-xs text-base-content/50">(اختیاری)</span>
      </span>
    </div>
    <input type="file" class="file-input file-input-bordered w-full" :accept="accept" @change="onChange" />
    <p v-if="hint" class="mt-1 text-xs text-base-content/60">{{ hint }}</p>
    <p v-if="error" class="mt-1 text-xs text-error flex items-center gap-1">
      <span>●</span>
      <span>{{ error }}</span>
    </p>
    <p v-else-if="meta" class="mt-1 text-xs text-base-content/70">
      فایل ذخیره شده: {{ meta.name }} ({{ meta.sizeLabel }})
      <span v-if="needsReattach" class="text-warning"> - نیاز به بارگذاری مجدد برای ارسال نهایی</span>
    </p>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  accept: {
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
  meta: {
    type: Object,
    default: null
  },
  optional: {
    type: Boolean,
    default: false
  },
  needsReattach: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change'])

const onChange = (event) => {
  const file = event.target.files?.[0] || null
  emit('change', file)
}
</script>
