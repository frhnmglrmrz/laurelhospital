<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Janji Temu (Antrian)</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola pendaftaran janji temu pasien dengan dokter</p>
      </div>
    </div>

    <DataTable 
      title="Janji Temu"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-date="{ row }">
        {{ new Date(row.date).toLocaleDateString('id-ID') }}
      </template>
      <template #col-patientId="{ row }">
        {{ getPatientName(row.patientId) }}
      </template>
      <template #col-doctorId="{ row }">
        {{ getDoctorName(row.doctorId) }}
      </template>
      <template #col-status="{ row }">
        <span class="px-2 py-1 rounded-full text-xs font-bold" :class="{
          'bg-yellow-100 text-yellow-800': row.status === 'PENDING',
          'bg-blue-100 text-blue-800': row.status === 'CONFIRMED',
          'bg-purple-100 text-purple-800': row.status === 'IN_PROGRESS',
          'bg-green-100 text-green-800': row.status === 'COMPLETED',
          'bg-red-100 text-red-800': row.status === 'CANCELLED'
        }">
          {{ row.status }}
        </span>
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Janji Temu' : 'Buat Janji Temu Baru'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Kantor Cabang <span class="text-red-500">*</span></label>
        <select v-model="form.branchId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="" disabled>Pilih Cabang</option>
          <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Pasien <span class="text-red-500">*</span></label>
          <select v-model="form.patientId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
            <option value="" disabled>Pilih Pasien</option>
            <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.fullName }} ({{ p.nik }})</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Dokter <span class="text-red-500">*</span></label>
          <select v-model="form.doctorId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
            <option value="" disabled>Pilih Dokter</option>
            <option v-for="d in doctors" :key="d.id" :value="d.id">{{ d.fullName }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal <span class="text-red-500">*</span></label>
          <input v-model="form.date" type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Jam (Estimasi) <span class="text-red-500">*</span></label>
          <input v-model="form.time" type="time" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status Janji Temu <span class="text-red-500">*</span></label>
        <select v-model="form.status" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="PENDING">PENDING (Menunggu)</option>
          <option value="CONFIRMED">CONFIRMED (Terkonfirmasi)</option>
          <option value="IN_PROGRESS">IN_PROGRESS (Sedang Periksa)</option>
          <option value="COMPLETED">COMPLETED (Selesai)</option>
          <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Keluhan / Alasan Kunjungan</label>
        <textarea v-model="form.reason" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"></textarea>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
        <textarea v-model="form.notes" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"></textarea>
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
  { key: 'time', label: 'Jam' },
  { key: 'patientId', label: 'Pasien' },
  { key: 'doctorId', label: 'Dokter' },
  { key: 'queueNo', label: 'No Antrian' },
  { key: 'status', label: 'Status' }
]

const items = ref([])
const branches = ref<any[]>([])
const patients = ref<any[]>([])
const doctors = ref<any[]>([])

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  branchId: '',
  patientId: '',
  doctorId: '',
  date: '',
  time: '',
  status: 'PENDING',
  reason: '',
  notes: ''
})

const resetForm = () => {
  form.value = { branchId: '', patientId: '', doctorId: '', date: '', time: '', status: 'PENDING', reason: '', notes: '' }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/appointments')
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const fetchDependencies = async () => {
  try {
    const [resBranches, resPatients, resDoctors] = await Promise.all([
      axios.get('/branches'),
      axios.get('/patients'),
      axios.get('/doctors')
    ])
    branches.value = resBranches.data
    patients.value = resPatients.data
    doctors.value = resDoctors.data
  } catch (error) {
    console.error('Failed to fetch dependencies', error)
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
    
    let formattedDate = ''
    if (item.date) {
      formattedDate = new Date(item.date).toISOString().split('T')[0]
    }

    form.value = { ...item, date: formattedDate }
  }
  isModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = { ...form.value }
    payload.date = new Date(payload.date).toISOString() // Ensure ISO datetime

    if (isEditing.value) {
      await axios.patch(`/appointments/${editingId.value}`, payload)
    } else {
      await axios.post('/appointments', payload)
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
  if (confirm(`Apakah Anda yakin ingin membatalkan dan menghapus janji temu ini?`)) {
    try {
      await axios.delete(`/appointments/${item.id}`)
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
