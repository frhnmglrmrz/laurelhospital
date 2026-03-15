<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
    <div 
      class="bg-surface rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 class="text-lg font-bold text-primary">{{ title }}</h3>
        <button 
          @click="close" 
          class="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <!-- Body -->
      <form @submit.prevent="submit">
        <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <slot></slot>
        </div>
        
        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 text-sm">
          <button 
            type="button" 
            @click="close" 
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 text-white bg-accent rounded hover:bg-teal-700 transition-colors font-medium shadow-sm"
            :disabled="loading"
          >
            <span v-if="loading">Menyimpan...</span>
            <span v-else>Simpan</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">


const props = defineProps<{
  modelValue: boolean
  title: string
  loading?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const close = () => {
  emit('update:modelValue', false)
}

const submit = () => {
  emit('submit')
}
</script>
