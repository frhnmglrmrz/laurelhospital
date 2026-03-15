<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Pasien</h1>
        <p class="text-gray-500 text-sm mt-1">Daftar pasien yang terdaftar di sistem</p>
      </div>
    </div>

    <DataTable 
      title="Pasien"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-gender="{ row }">
        <span :class="row.gender === 'MALE' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'" class="px-2 py-1 rounded-full text-xs font-bold">
          {{ row.gender === 'MALE' ? 'Laki-Laki' : 'Perempuan' }}
        </span>
      </template>
      <template #col-dateOfBirth="{ row }">
        {{ new Date(row.dateOfBirth).toLocaleDateString('id-ID') }}
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Pasien' : 'Daftar Pasien Baru'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Akun Pengguna (User ID) <span class="text-red-500">*</span></label>
        <select v-model="form.userId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="" disabled>Pilih Akun User</option>
          <option v-for="u in users" :key="u.id" :value="u.id">{{ u.email }}</option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Pilih relasi ke akun login pasien. Pastikan role user adalah PATIENT.</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Induk Kependudukan (NIK) <span class="text-red-500">*</span></label>
        <input v-model="form.nik" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label>
        <input v-model="form.fullName" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir <span class="text-red-500">*</span></label>
          <input v-model="form.dateOfBirth" type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin <span class="text-red-500">*</span></label>
          <select v-model="form.gender" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
            <option value="MALE">Laki-Laki (MALE)</option>
            <option value="FEMALE">Perempuan (FEMALE)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Golongan Darah</label>
          <select v-model="form.bloodType" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
            <option value="">-- Pilih --</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
          <input v-model="form.phone" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
        </div>
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap <span class="text-red-500">*</span></label>
        <textarea v-model="form.address" required rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"></textarea>
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
  { key: 'nik', label: 'NIK' },
  { key: 'fullName', label: 'Nama Pasien' },
  { key: 'gender', label: 'L/P' },
  { key: 'dateOfBirth', label: 'Tgl Lahir' },
  { key: 'phone', label: 'No Telepon' }
]

const items = ref([])
const users = ref<any[]>([])
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  userId: '',
  nik: '',
  fullName: '',
  dateOfBirth: '',
  gender: 'MALE',
  bloodType: '',
  phone: '',
  address: ''
})

const resetForm = () => {
  form.value = { userId: '', nik: '', fullName: '', dateOfBirth: '', gender: 'MALE', bloodType: '', phone: '', address: '' }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/patients')
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const fetchUsers = async () => {
  try {
    const res = await axios.get('/users?role=PATIENT') // Try to fetch only patient users, or fallback to all.
    users.value = res.data
  } catch (error) {
    console.error('Failed to fetch dependencies', error)
  }
}

const openModal = (item = null) => {
  resetForm()
  if (item) {
    isEditing.value = true
    editingId.value = item.id
    
    // Format date string for the input field 'yyyy-mm-dd'
    let formattedDate = ''
    if (item.dateOfBirth) {
      formattedDate = new Date(item.dateOfBirth).toISOString().split('T')[0]
    }
    
    form.value = { ...item, dateOfBirth: formattedDate }
  }
  isModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = { ...form.value }
    // Clean empty bloodType if needed
    if (!payload.bloodType) delete payload.bloodType;
    
    // Convert to ISO string explicitly if needed based on backend expectation
    payload.dateOfBirth = new Date(payload.dateOfBirth).toISOString()

    if (isEditing.value) {
      await axios.patch(`/patients/${editingId.value}`, payload)
    } else {
      await axios.post('/patients', payload)
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
  if (confirm(`Apakah Anda yakin ingin menghapus pasien ${item.fullName}?`)) {
    try {
      await axios.delete(`/patients/${item.id}`)
      await fetchItems()
    } catch (error) {
      alert('Gagal menghapus data')
    }
  }
}

onMounted(() => {
  fetchUsers()
  fetchItems()
})
</script>
