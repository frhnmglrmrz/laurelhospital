<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Tagihan & Invoices</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola tagihan biaya perawatan rumah sakit</p>
      </div>
    </div>

    <DataTable 
      title="Daftar Tagihan"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-patientId="{ row }">
        {{ getPatientName(row.patientId) }}
      </template>
      <template #col-amount="{ row }">
        <span class="font-medium text-gray-900">Rp {{ row.amount?.toLocaleString('id-ID') || 0 }}</span>
      </template>
      <template #col-dueDate="{ row }">
        {{ new Date(row.dueDate).toLocaleDateString('id-ID') }}
      </template>
      <template #col-status="{ row }">
        <span class="px-2 py-1 rounded-full text-xs font-bold" :class="{
          'bg-yellow-100 text-yellow-800': row.status === 'UNPAID',
          'bg-blue-100 text-blue-800': row.status === 'PARTIALLY_PAID',
          'bg-green-100 text-green-800': row.status === 'PAID',
          'bg-red-100 text-red-800': row.status === 'OVERDUE',
          'bg-gray-100 text-gray-800': row.status === 'CANCELLED'
        }">
          {{ row.status }}
        </span>
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Tagihan' : 'Buat Tagihan Baru'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div v-if="!isEditing">
        <label class="block text-sm font-medium text-gray-700 mb-1">Terkait Rekam Medis (Opsional)</label>
        <select v-model="form.medicalRecordId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white" @change="populateFromRecord">
          <option value="">-- Pilih Rekam Medis --</option>
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Jatuh Tempo <span class="text-red-500">*</span></label>
          <input v-model="form.dueDate" type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
        </div>
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Total Tagihan (Rp) <span class="text-red-500">*</span></label>
        <input v-model="form.amount" type="number" required min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none text-xl font-bold text-gray-800" />
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Status Pembayaran <span class="text-red-500">*</span></label>
        <select v-model="form.status" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="UNPAID">UNPAID (Belum Lunas)</option>
          <option value="PARTIALLY_PAID">PARTIALLY PAID (Dibayar Sebagian)</option>
          <option value="PAID">PAID (Lunas)</option>
          <option value="OVERDUE">OVERDUE (Jatuh Tempo)</option>
          <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
        </select>
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Rincian Tagihan (Deskripsi Item)</label>
        <textarea v-model="form.details" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="- Biaya Konsultasi: Rp 150.000&#10;- Biaya Obat: Rp 200.000"></textarea>
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
  { key: 'invoiceNumber', label: 'No Invoice' },
  { key: 'patientId', label: 'Pasien' },
  { key: 'amount', label: 'Total Tagihan' },
  { key: 'dueDate', label: 'Jatuh Tempo' },
  { key: 'status', label: 'Status' }
]

const items = ref([])
const patients = ref<any[]>([])
const medicalRecords = ref<any[]>([])

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  medicalRecordId: '',
  patientId: '',
  amount: 0,
  details: '',
  status: 'UNPAID',
  dueDate: ''
})

const resetForm = () => {
  form.value = { 
    medicalRecordId: '', patientId: '', amount: 0, 
    details: '', status: 'UNPAID', dueDate: '' 
  }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/invoices')
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const fetchDependencies = async () => {
  try {
    const [resPatients, resRecords] = await Promise.all([
      axios.get('/patients'),
      axios.get('/medical-records')
    ])
    patients.value = resPatients.data
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
    }
  }
}

const getPatientName = (id: string) => {
  const p = patients.value.find(item => item.id === id)
  return p ? p.fullName : id
}

const openModal = (item = null) => {
  resetForm()
  if (item) {
    isEditing.value = true
    editingId.value = item.id
    
    let formattedDue = ''
    if (item.dueDate) {
      formattedDue = new Date(item.dueDate).toISOString().split('T')[0]
    }

    form.value = { ...item, amount: Number(item.amount), dueDate: formattedDue }
  }
  isModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = { 
      ...form.value,
      amount: Number(form.value.amount) 
    }
    
    if (payload.dueDate) {
      payload.dueDate = new Date(payload.dueDate).toISOString()
    }

    if (!payload.medicalRecordId) delete payload.medicalRecordId
    
    if (isEditing.value) {
      await axios.patch(`/invoices/${editingId.value}`, payload)
    } else {
      await axios.post('/invoices', payload)
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
  if (confirm(`Apakah Anda yakin ingin menghapus tagihan ini?`)) {
    try {
      await axios.delete(`/invoices/${item.id}`)
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
