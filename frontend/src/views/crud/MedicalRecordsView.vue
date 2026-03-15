<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Rekam Medis (Medical Records)</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola riwayat pemeriksaan dan rekam medis pasien</p>
      </div>
    </div>

    <DataTable 
      title="Rekam Medis"
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
        {{ new Date(row.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'}) }}
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Rekam Medis' : 'Tambah Rekam Medis Baru'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div v-if="!isEditing">
        <label class="block text-sm font-medium text-gray-700 mb-1">Janji Temu Terkait (Opsional)</label>
        <select v-model="form.appointmentId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white" @change="populateFromAppointment">
          <option value="">Pilih Janji Temu</option>
          <option v-for="a in appointments" :key="a.id" :value="a.id">
            Tgl: {{ new Date(a.date).toLocaleDateString() }} - Pasien: {{ getPatientName(a.patientId) }}
          </option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Memilih janji temu akan otomatis mengisi data pasien dan dokter.</p>
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Dokter Pemeriksa <span class="text-red-500">*</span></label>
          <select v-model="form.doctorId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
            <option value="" disabled>Pilih Dokter</option>
            <option v-for="d in doctors" :key="d.id" :value="d.id">{{ d.fullName }}</option>
          </select>
        </div>
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Diagnosis Utama <span class="text-red-500">*</span></label>
        <textarea v-model="form.diagnosis" required rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="Masukkan ringkasan diagnosis"></textarea>
      </div>
      
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Gejala (Symptoms)</label>
        <textarea v-model="form.symptoms" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"></textarea>
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Terapi / Tindakan (Treatment)</label>
        <textarea v-model="form.treatment" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"></textarea>
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Resep / Instruksi Kepulangan</label>
        <textarea v-model="form.prescription" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"></textarea>
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
  { key: 'date', label: 'Waktu Kunjungan' },
  { key: 'patientId', label: 'Nama Pasien' },
  { key: 'doctorId', label: 'Dokter' },
  { key: 'diagnosis', label: 'Diagnosis' }
]

const items = ref([])
const patients = ref<any[]>([])
const doctors = ref<any[]>([])
const appointments = ref<any[]>([])

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  appointmentId: '',
  patientId: '',
  doctorId: '',
  diagnosis: '',
  symptoms: '',
  treatment: '',
  prescription: ''
})

const resetForm = () => {
  form.value = { 
    appointmentId: '', patientId: '', doctorId: '', 
    diagnosis: '', symptoms: '', treatment: '', prescription: '' 
  }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/medical-records')
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const fetchDependencies = async () => {
  try {
    const [resPatients, resDoctors, resAppts] = await Promise.all([
      axios.get('/patients'),
      axios.get('/doctors'),
      // Only fetch pending/in_progress appointments potentially
      axios.get('/appointments') 
    ])
    patients.value = resPatients.data
    doctors.value = resDoctors.data
    appointments.value = resAppts.data
  } catch (error) {
    console.error('Failed to fetch dependencies', error)
  }
}

const populateFromAppointment = () => {
  if (form.value.appointmentId) {
    const appt = appointments.value.find(a => a.id === form.value.appointmentId)
    if (appt) {
      form.value.patientId = appt.patientId
      form.value.doctorId = appt.doctorId
      form.value.symptoms = appt.reason || ''
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
    if (!payload.appointmentId) delete payload.appointmentId

    // Backend typically sets the date on creation, but we can pass it if needed.
    // If Prisma schema auto-defaults createdAt/date we might not need to.
    
    if (isEditing.value) {
      await axios.patch(`/medical-records/${editingId.value}`, payload)
    } else {
      await axios.post('/medical-records', payload)
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
  if (confirm(`Apakah Anda yakin ingin menghapus rekam medis pasien ini (TIDAK DISARANKAN)?`)) {
    try {
      await axios.delete(`/medical-records/${item.id}`)
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
