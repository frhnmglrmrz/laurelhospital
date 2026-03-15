<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Resep Obat (Prescriptions)</h1>
        <p class="text-gray-500 text-sm mt-1">Daftar resep yang diberikan kepada pasien</p>
      </div>
    </div>

    <DataTable 
      title="Resep Obat"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-patientId="{ row }">
        {{ getPatientName(row.patientId) }}
      </template>
      <template #col-doctorId="{ row }">
        {{ getDoctorName(row.doctorId) }}
      </template>
      <template #col-date="{ row }">
        {{ new Date(row.date).toLocaleDateString('id-ID') }}
      </template>
      <template #col-status="{ row }">
        <span class="px-2 py-1 rounded-full text-xs font-bold" :class="{
          'bg-yellow-100 text-yellow-800': row.status === 'PENDING',
          'bg-blue-100 text-blue-800': row.status === 'PREPARING',
          'bg-green-100 text-green-800': row.status === 'READY',
          'bg-gray-100 text-gray-800': row.status === 'DISPENSED'
        }">
          {{ row.status }}
        </span>
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Status Resep' : 'Tulis Resep Baru'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div v-if="!isEditing">
        <label class="block text-sm font-medium text-gray-700 mb-1">Relasi Kunjungan/Rekam Medis (Opsional)</label>
        <select v-model="form.medicalRecordId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white" @change="populateFromRecord">
          <option value="">-- Pilih --</option>
          <option v-for="mr in medicalRecords" :key="mr.id" :value="mr.id">
            Tgl: {{ new Date(mr.date).toLocaleDateString() }} - Pasien: {{ getPatientName(mr.patientId) }}
          </option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Pasien <span class="text-red-500">*</span></label>
          <select v-model="form.patientId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
            <option value="" disabled>Pilih Pasien</option>
            <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.fullName }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Dokter Pemberi Resep <span class="text-red-500">*</span></label>
          <select v-model="form.doctorId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
            <option value="" disabled>Pilih Dokter</option>
            <option v-for="d in doctors" :key="d.id" :value="d.id">{{ d.fullName }}</option>
          </select>
        </div>
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Resep <span class="text-red-500">*</span></label>
        <textarea v-model="form.notes" required rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="Tuliskan daftar obat, dosis, dan frekuensi"></textarea>
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Status Resep di Apotek <span class="text-red-500">*</span></label>
        <select v-model="form.status" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="PENDING">PENDING (Menunggu Apotek)</option>
          <option value="PREPARING">PREPARING (Sedang Disiapkan Apoteker)</option>
          <option value="READY">READY (Siap Diambil)</option>
          <option value="DISPENSED">DISPENSED (Sudah Diserahkan)</option>
        </select>
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
  { key: 'date', label: 'Tanggal' },
  { key: 'patientId', label: 'Nama Pasien' },
  { key: 'doctorId', label: 'Dokter' },
  { key: 'status', label: 'Status Apotek' }
]

const items = ref([])
const patients = ref<any[]>([])
const doctors = ref<any[]>([])
const medicalRecords = ref<any[]>([])

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  medicalRecordId: '',
  patientId: '',
  doctorId: '',
  notes: '',
  status: 'PENDING'
})

const resetForm = () => {
  form.value = { 
    medicalRecordId: '', patientId: '', doctorId: '', notes: '', status: 'PENDING' 
  }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/prescriptions')
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const fetchDependencies = async () => {
  try {
    const [resPatients, resDoctors, resRecords] = await Promise.all([
      axios.get('/patients'),
      axios.get('/doctors'),
      axios.get('/medical-records')
    ])
    patients.value = resPatients.data
    doctors.value = resDoctors.data
    medicalRecords.value = resRecords.data
  } catch (error) {
    console.error('Failed to fetch dependencies', error)
  }
}

const populateFromRecord = () => {
  if (form.value.medicalRecordId) {
    const record = medicalRecords.value.find(r => r.id === form.value.medicalRecordId)
    if (record) {
      form.value.patientId = record.patientId
      form.value.doctorId = record.doctorId
      form.value.notes = record.prescription || ''
    }
  }
}

const getPatientName = (id: string) => {
  const p = patients.value.find(item => item.id === id)
  return p ? p.fullName : id
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
    form.value = { ...item }
  }
  isModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = { ...form.value }
    if (!payload.medicalRecordId) delete payload.medicalRecordId
    
    if (isEditing.value) {
      await axios.patch(`/prescriptions/${editingId.value}`, payload)
    } else {
      await axios.post('/prescriptions', payload)
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
  if (confirm(`Apakah Anda yakin ingin membatalkan/menghapus resep ini?`)) {
    try {
      await axios.delete(`/prescriptions/${item.id}`)
      await fetchItems()
    } catch (error) {
      alert('Gagal menghapus data')
    }
  }
}

onMounted(() => {
  fetchDependencies()
  fetchItems()
})
</script>
