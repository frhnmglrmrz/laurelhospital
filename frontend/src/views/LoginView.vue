<template>
  <div class="min-h-screen bg-background flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-surface rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      <!-- Header -->
      <div class="bg-primary py-8 px-6 text-center">
        <router-link to="/" class="inline-block text-accent text-3xl mb-2">✦</router-link>
        <h2 class="text-2xl font-bold text-white">Selamat Datang</h2>
        <p class="text-gray-300 text-sm mt-1">Silakan masuk ke akun Anda</p>
      </div>

      <!-- Form -->
      <div class="p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              v-model="email" 
              type="email" 
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
              placeholder="nama@email.com"
            />
          </div>
          
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <a href="#" class="text-sm text-accent hover:underline">Lupa password?</a>
            </div>
            <input 
              v-model="password" 
              type="password" 
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-accent hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg shadow hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            <span v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ isLoading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>
        
        <div class="mt-8 text-center text-sm text-gray-500">
          <p>Belum punya akun pasien? <a href="#" class="text-accent font-medium hover:underline">Daftar sekarang</a></p>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const authStore = useAuthStore()

const handleLogin = async () => {
  if (!email.value || !password.value) return
  
  isLoading.value = true
  try {
    await authStore.login(email.value, password.value)
    // Router push handled in store
  } catch (error) {
    alert('Login gagal. Silakan periksa kembali email & password.')
  } finally {
    isLoading.value = false
  }
}
</script>
