<template>
  <div class="flex h-screen bg-background">
    <!-- Sidebar -->
    <aside class="w-64 bg-primary text-white flex flex-col shadow-lg shrink-0 transition-all duration-300">
      <div class="h-16 flex items-center px-6 font-bold text-xl tracking-wide border-b border-primary-light shrink-0">
        <router-link to="/" class="flex items-center hover:text-gray-200 transition">
          <span class="text-accent mr-2 text-2xl">✦</span> Laurel
        </router-link>
      </div>
      
      <div class="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav class="px-4 space-y-1">
          <!-- Main Dashboard -->
          <router-link to="/dashboard" class="block px-4 py-2 mb-4 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" exact-active-class="bg-accent text-white hover:bg-accent font-medium">
            <span class="mr-2">📊</span> Dashboard Utama
          </router-link>

          <!-- ADMIN / HR / MGT -->
          <template v-if="['ADMIN', 'RECEPTIONIST'].includes(userRole)">
            <p class="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">Organisasi & Master</p>
            <router-link v-if="userRole === 'ADMIN'" to="/dashboard/hospitals" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Rumah Sakit
            </router-link>
            <router-link v-if="userRole === 'ADMIN'" to="/dashboard/branches" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Kantor Cabang
            </router-link>
            <router-link v-if="userRole === 'ADMIN'" to="/dashboard/departments" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Departemen
            </router-link>
            <router-link v-if="userRole === 'ADMIN'" to="/dashboard/rooms" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Kamar & Bed
            </router-link>
            <router-link v-if="userRole === 'ADMIN'" to="/dashboard/users" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Akun Pengguna
            </router-link>
            <router-link v-if="userRole === 'ADMIN'" to="/dashboard/staff" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Staf RS
            </router-link>
          </template>

          <!-- MEDICAL EXPERTS & ADMIN -->
          <template v-if="['ADMIN', 'DOCTOR', 'NURSE'].includes(userRole)">
            <p class="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Medis & Dokter</p>
            <router-link to="/dashboard/doctors" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Data Dokter
            </router-link>
            <router-link to="/dashboard/schedules" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Jadwal Praktek
            </router-link>
            <router-link to="/dashboard/medical-records" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Rekam Medis (EMR)
            </router-link>
          </template>

          <!-- FRONTDESK / OPERATIONS -->
          <template v-if="['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE'].includes(userRole)">
            <p class="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Operasional & Pasien</p>
            <router-link to="/dashboard/patients" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Data Pasien
            </router-link>
            <router-link to="/dashboard/appointments" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Janji Temu (Antrian)
            </router-link>
            <router-link to="/dashboard/admissions" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Rawat Inap (Admission)
            </router-link>
          </template>

          <!-- PHARMACY & LAB -->
          <template v-if="['ADMIN', 'PHARMACIST', 'LAB_TECHNICIAN'].includes(userRole)">
            <p class="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Farmasi & Laboratorium</p>
            <router-link v-if="['ADMIN', 'PHARMACIST'].includes(userRole)" to="/dashboard/medicines" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Obat & Farmasi
            </router-link>
            <router-link v-if="['ADMIN', 'PHARMACIST'].includes(userRole)" to="/dashboard/prescriptions" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Resep Pasien
            </router-link>
            <router-link v-if="['ADMIN', 'LAB_TECHNICIAN'].includes(userRole)" to="/dashboard/lab-tests" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Hasil Lab
            </router-link>
          </template>

          <!-- BILLING -->
          <template v-if="['ADMIN', 'RECEPTIONIST'].includes(userRole)">
            <p class="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Pembayaran</p>
            <router-link to="/dashboard/invoices" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Tagihan (Invoice)
            </router-link>
          </template>
          
          <!-- PATIENT SPECIFIC -->
          <template v-if="userRole === 'PATIENT'">
            <p class="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Portal Pasien</p>
            <router-link to="/dashboard/my-appointments" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Janji Temu Saya
            </router-link>
            <router-link to="/dashboard/my-records" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Riwayat Medis
            </router-link>
            <router-link to="/dashboard/my-invoices" class="block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors" active-class="bg-gray-800 text-white font-medium border-l-2 border-accent">
              Tagihan & Pembayaran
            </router-link>
          </template>

        </nav>
      </div>
      
      <div class="p-4 border-t border-primary-light shrink-0">
        <button @click="authStore.logout()" class="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-red-900/50 rounded transition-colors group">
          <span class="mr-2 group-hover:scale-110 transition-transform">🚪</span> Keluar Sesi
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
      <!-- Top header -->
      <header class="h-16 bg-surface shadow-sm flex items-center justify-between px-8 z-10 shrink-0">
        <h2 class="text-lg font-medium text-gray-800 truncate">Dashboard RS Laurel</h2>
        <div class="flex items-center gap-4">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-bold text-gray-800 truncate max-w-[150px]">{{ userEmail }}</p>
            <p class="text-xs text-accent font-medium uppercase">{{ userRole }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-inner">
            {{ userInitial }}
          </div>
        </div>
      </header>

      <!-- Main scrollable area -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const userRole = computed(() => authStore.userRole)
const userEmail = computed(() => authStore.user?.email || 'Unknown User')
const userInitial = computed(() => userEmail.value.charAt(0).toUpperCase())
</script>

<style scoped>
.border-primary-light {
  border-color: #2a2a4a;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #2a2a4a;
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #4a4a6a;
}
</style>
