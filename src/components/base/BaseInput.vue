<template>
  <div class="form-control">
    <div class="label">
      <span class="label-text text-sm font-semibold">
        {{ label }}
        <span v-if="optional" class="text-xs text-base-content/50">(اختیاری)</span>
      </span>
    </div>
    <div class="relative">
      <input
        :id="id"
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        :inputmode="inputmode"
        :autocomplete="autocomplete"
        class="input-base"
        :class="clearable ? 'pl-10' : ''"
        @blur="emit('blur')"
      />
      <button
        v-if="clearable && model"
        type="button"
        class="btn btn-ghost btn-xs absolute left-2 top-1/2 -translate-y-1/2 text-base-content/50"
        @click="clear"
      >
        پاک کردن
      </button>
    </div>
    <p v-if="hint" class="mt-1 text-xs text-base-content/60">{{ hint }}</p>
    <p v-if="error" class="mt-1 text-xs text-error flex items-center gap-1">
      <span>●</span>
      <span>{{ error }}</span>
    </p>
  </div>
</template>

<script setup>
const model = defineModel({ type: [String, Number], default: '' })

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  inputmode: {
    type: String,
    default: undefined
  },
  autocomplete: {
    type: String,
    default: undefined
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
  },
  clearable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['blur', 'clear'])

const clear = () => {
  model.value = ''
  emit('clear')
}
</script>
