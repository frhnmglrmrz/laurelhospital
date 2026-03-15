<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Rawat Inap (Admission)</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola data pasien rawat inap dan penggunaan kamar</p>
      </div>
    </div>

    <DataTable 
      title="Rawat Inap"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-patientId="{ row }">
        {{ getPatientName(row.patientId) }}
      </template>
      <template #col-bedId="{ row }">
        {{ getBedInfo(row.bedId) }}
      </template>
      <template #col-admissionDate="{ row }">
        {{ new Date(row.admissionDate).toLocaleDateString('id-ID') }}
      </template>
      <template #col-status="{ row }">
        <span class="px-2 py-1 rounded-full text-xs font-bold" :class="{
          'bg-blue-100 text-blue-800': row.status === 'ADMITTED',
          'bg-green-100 text-green-800': row.status === 'DISCHARGED',
          'bg-orange-100 text-orange-800': row.status === 'TRANSFERRED'
        }">
          {{ row.status }}
        </span>
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Data Rawat Inap' : 'Pendaftaran Rawat Inap'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Pasien <span class="text-red-500">*</span></label>
          <select v-model="form.patientId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
            <option value="" disabled>Pilih Pasien</option>
            <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.fullName }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Dokter Penanggung Jawab <span class="text-red-500">*</span></label>
          <select v-model="form.doctorId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
            <option value="" disabled>Pilih Dokter</option>
            <option v-for="d in doctors" :key="d.id" :value="d.id">{{ d.fullName }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tempat Tidur (Kamar) <span class="text-red-500">*</span></label>
        <select v-model="form.bedId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="" disabled>Pilih Bed</option>
          <option v-for="b in beds" :key="b.id" :value="b.id">Kamar {{ getRoomNumber(b.roomId) }} - Bed {{ b.number }} ({{ b.status }})</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status Rawat Inap <span class="text-red-500">*</span></label>
          <select v-model="form.status" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
            <option value="ADMITTED">ADMITTED (Sedang Dirawat)</option>
            <option value="DISCHARGED">DISCHARGED (Sudah Pulang)</option>
            <option value="TRANSFERRED">TRANSFERRED (Pindah Kamar/RS)</option>
          </select>
        </div>
        <div v-if="form.status === 'DISCHARGED'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Keluar (Discharge)</label>
          <input v-model="form.dischargeDate" type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Diagnosis Masuk</label>
        <textarea v-model="form.diagnosis" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"></textarea>
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
  { key: 'patientId', label: 'Pasien' },
  { key: 'bedId', label: 'Kamar & Bed' },
  { key: 'admissionDate', label: 'Tgl Masuk' },
  { key: 'status', label: 'Status' }
]

const items = ref([])
const patients = ref<any[]>([])
const doctors = ref<any[]>([])
const beds = ref<any[]>([])
const rooms = ref<any[]>([])

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  patientId: '',
  doctorId: '',
  bedId: '',
  status: 'ADMITTED',
  dischargeDate: '',
  diagnosis: '',
  notes: ''
})

const resetForm = () => {
  form.value = { 
    patientId: '', doctorId: '', bedId: '', 
    status: 'ADMITTED', dischargeDate: '', diagnosis: '', notes: '' 
  }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/admissions')
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const fetchDependencies = async () => {
  try {
    const [resPatients, resDoctors, resBeds, resRooms] = await Promise.all([
      axios.get('/patients'),
      axios.get('/doctors'),
      axios.get('/beds'),
      axios.get('/rooms')
    ])
    patients.value = resPatients.data
    doctors.value = resDoctors.data
    beds.value = resBeds.data
    rooms.value = resRooms.data
  } catch (error) {
    console.error('Failed to fetch dependencies', error)
  }
}

const getPatientName = (id: string) => {
  const p = patients.value.find(item => item.id === id)
  return p ? p.fullName : id
}

const getRoomNumber = (roomId: string) => {
  const r = rooms.value.find(item => item.id === roomId)
  return r ? r.number : roomId
}

const getBedInfo = (bedId: string) => {
  const b = beds.value.find(item => item.id === bedId)
  if (!b) return bedId
  const roomName = getRoomNumber(b.roomId)
  return `Kamar ${roomName} - Bed ${b.number}`
}

const openModal = (item = null) => {
  resetForm()
  if (item) {
    isEditing.value = true
    editingId.value = item.id
    
    let formattedDischarge = ''
    if (item.dischargeDate) {
      formattedDischarge = new Date(item.dischargeDate).toISOString().split('T')[0]
    }

    form.value = { ...item, dischargeDate: formattedDischarge }
  }
  isModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = { ...form.value }
    if (payload.status !== 'DISCHARGED') {
      delete payload.dischargeDate
    } else if (payload.dischargeDate) {
      payload.dischargeDate = new Date(payload.dischargeDate).toISOString()
    }

    if (isEditing.value) {
      await axios.patch(`/admissions/${editingId.value}`, payload)
    } else {
      await axios.post('/admissions', payload)
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
  if (confirm(`Apakah Anda yakin ingin menghapus data rawat inap ini?`)) {
    try {
      await axios.delete(`/admissions/${item.id}`)
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
