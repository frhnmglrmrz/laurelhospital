<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div class="text-sm text-gray-500">
        {{ new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
      </div>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl mr-4">
          👥
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Total Pasien</p>
          <p class="text-2xl font-bold text-gray-800">
            <span v-if="isLoading">...</span>
            <span v-else>{{ totalPatients.toLocaleString('id-ID') }}</span>
          </p>
        </div>
      </div>
      
      <div class="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div class="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xl mr-4">
          📅
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Jadwal Hari Ini</p>
          <p class="text-2xl font-bold text-gray-800">
            <span v-if="isLoading">...</span>
            <span v-else>{{ todaySchedules.toLocaleString('id-ID') }}</span>
          </p>
        </div>
      </div>
      
      <div class="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div class="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl mr-4">
          🛏️
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Kamar Tersedia</p>
          <p class="text-2xl font-bold text-gray-800">
            <span v-if="isLoading">...</span>
            <span v-else>{{ availableBeds.toLocaleString('id-ID') }}</span>
          </p>
        </div>
      </div>
      
      <div class="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div class="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl mr-4">
          💊
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Resep Tertunda</p>
          <p class="text-2xl font-bold text-gray-800">
            <span v-if="isLoading">...</span>
            <span v-else>{{ pendingPrescriptions.toLocaleString('id-ID') }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Main visual area -->
    <div class="bg-surface border border-gray-100 rounded-xl shadow-sm p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
      <div class="text-5xl mb-4">👋</div>
      <h2 class="text-xl font-semibold text-gray-800 mb-2">Selamat datang kembali!</h2>
      <p class="text-gray-500 max-w-lg">
        Gunakan menu navigasi di sebelah kiri untuk mengelola master data, jadwal dokter, antrian pasien, atau operasi rumah sakit lainnya sesuai dengan hak akses Anda.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '../api/axios'

const isLoading = ref(true)
const totalPatients = ref(0)
const todaySchedules = ref(0)
const availableBeds = ref(0)
const pendingPrescriptions = ref(0)

const fetchDashboardStats = async () => {
  isLoading.value = true
  try {
    const [patientsRes, appointmentsRes, bedsRes, prescriptionsRes] = await Promise.all([
      axios.get('/patients'),
      axios.get('/appointments'),
      axios.get('/beds'),
      axios.get('/prescriptions')
    ])

    // Total patients
    totalPatients.value = patientsRes.data.length || 0

    // Today's appointments (Jadwal Hari Ini)
    const todayStr = new Date().toISOString().split('T')[0]
    todaySchedules.value = appointmentsRes.data.filter((a: any) => {
      if (!a.date) return false
      return new Date(a.date).toISOString().split('T')[0] === todayStr
    }).length

    // Available beds
    availableBeds.value = bedsRes.data.filter((b: any) => b.status === 'AVAILABLE').length

    // Pending prescriptions
    pendingPrescriptions.value = prescriptionsRes.data.filter((p: any) => p.status === 'PENDING').length

  } catch (error) {
    console.error('Failed to fetch dashboard stats', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDashboardStats()
})
</script>
