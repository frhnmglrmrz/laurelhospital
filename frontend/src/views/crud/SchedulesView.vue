<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Jadwal Praktek Dokter</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola jadwal harian dokter</p>
      </div>
    </div>

    <DataTable 
      title="Jadwal Praktek"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-doctorId="{ row }">
        {{ getDoctorName(row.doctorId) }}
      </template>
      <template #col-dayOfWeek="{ row }">
        <span class="font-medium">{{ getDayName(row.dayOfWeek) }}</span>
      </template>
      <template #col-time="{ row }">
        {{ row.startTime }} - {{ row.endTime }}
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Jadwal' : 'Tambah Jadwal'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Dokter <span class="text-red-500">*</span></label>
        <select v-model="form.doctorId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="" disabled>Pilih Dokter</option>
          <option v-for="d in doctors" :key="d.id" :value="d.id">{{ d.fullName }} ({{ d.specialization }})</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Hari <span class="text-red-500">*</span></label>
        <select v-model="form.dayOfWeek" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option :value="1">Senin</option>
          <option :value="2">Selasa</option>
          <option :value="3">Rabu</option>
          <option :value="4">Kamis</option>
          <option :value="5">Jumat</option>
          <option :value="6">Sabtu</option>
          <option :value="0">Minggu</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Jam Mulai <span class="text-red-500">*</span></label>
          <input v-model="form.startTime" type="time" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Jam Selesai <span class="text-red-500">*</span></label>
          <input v-model="form.endTime" type="time" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
        </div>
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Maksimal Kuota Pasien <span class="text-red-500">*</span></label>
        <input v-model="form.maxSlots" type="number" required min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>
    </DynamicModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '../../components/DataTable.vue'
import DynamicModal from '../../components/DynamicModal.vue'
import axios from '../../api/axios'

const columns = [
  { key: 'doctorId', label: 'Nama Dokter' },
  { key: 'dayOfWeek', label: 'Hari' },
  { key: 'time', label: 'Jam Praktek' },
  { key: 'maxSlots', label: 'Kuota' }
]

const items = ref([])
const doctors = ref<any[]>([])
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  doctorId: '',
  dayOfWeek: 1,
  startTime: '08:00',
  endTime: '12:00',
  maxSlots: 20
})

const getDayName = (day: number) => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  return days[day] || '-'
}

const resetForm = () => {
  form.value = { doctorId: '', dayOfWeek: 1, startTime: '08:00', endTime: '12:00', maxSlots: 20 }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/doctor-schedules') // Adjust backend endpoint if different
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const fetchDoctors = async () => {
  try {
    const res = await axios.get('/doctors')
    doctors.value = res.data
  } catch (error) {
    console.error('Failed to fetch doctors', error)
  }
}

const getDoctorName = (id: string) => {
  const d = doctors.value.find(item => item.id === id)
  return d ? d.fullName : id
}

const openModal = (item = null) => {
  resetForm()
  if (item) {
    isEditing.value = true
    editingId.value = item.id
    form.value = { ...item, dayOfWeek: Number(item.dayOfWeek), maxSlots: Number(item.maxSlots) }
  }
  isModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = { 
      ...form.value, 
      dayOfWeek: Number(form.value.dayOfWeek),
      maxSlots: Number(form.value.maxSlots)
    }
    
    if (isEditing.value) {
      await axios.patch(`/doctor-schedules/${editingId.value}`, payload)
    } else {
      await axios.post('/doctor-schedules', payload)
    }
    await fetchItems()
    isModalOpen.value = false
  } catch (error: any) {
    alert('Terjadi kesalahan saat menyimpan: ' + (error.response?.data?.message || error.message))
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async (item: any) => {
  if (confirm(`Apakah Anda yakin ingin menghapus jadwal ini?`)) {
    try {
      await axios.delete(`/doctor-schedules/${item.id}`)
      await fetchItems()
    } catch (error) {
      alert('Gagal menghapus data')
    }
  }
}

onMounted(() => {
  fetchDoctors()
  fetchItems()
})
</script>
