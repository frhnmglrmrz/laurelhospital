<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 transition-opacity">
    <div class="relative w-full max-w-md bg-surface rounded-xl shadow-2xl p-6 transform transition-all">
      <!-- Header -->
      <div class="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
        <h3 class="text-xl font-bold text-gray-800">{{ title }}</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
          ✕
        </button>
      </div>
      
      <!-- Body -->
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <slot></slot>
        </div>
        
        <!-- Footer / Actions -->
        <div class="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            type="button" 
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
          >
            <span v-if="isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: 'Form' },
  isLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleSubmit = () => {
  emit('submit')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}
</style>
