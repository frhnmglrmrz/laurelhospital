<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Dokter</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola data dokter, spesialisasi, dan departemen</p>
      </div>
    </div>

    <DataTable 
      title="Dokter"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-departmentId="{ row }">
        {{ getDepartmentName(row.departmentId) }}
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Dokter' : 'Tambah Dokter'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Akun Pengguna (User ID) <span class="text-red-500">*</span></label>
        <select v-model="form.userId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="" disabled>Pilih Akun User</option>
          <option v-for="u in users" :key="u.id" :value="u.id">{{ u.email }} ({{ u.role }})</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Departemen <span class="text-red-500">*</span></label>
        <select v-model="form.departmentId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="" disabled>Pilih Departemen</option>
          <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap (beserta Gelar) <span class="text-red-500">*</span></label>
        <input v-model="form.fullName" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="dr. Budi Santoso, Sp.A" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Spesialisasi <span class="text-red-500">*</span></label>
        <input v-model="form.specialization" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="Dokter Spesialis Anak" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Izin Praktik (SIP) <span class="text-red-500">*</span></label>
        <input v-model="form.licenseNumber" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
        <input v-model="form.phone" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
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
  { key: 'fullName', label: 'Nama Dokter' },
  { key: 'specialization', label: 'Spesialisasi' },
  { key: 'departmentId', label: 'Departemen' },
  { key: 'licenseNumber', label: 'No SIP' },
]

const items = ref([])
const users = ref<any[]>([])
const departments = ref<any[]>([])
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  userId: '',
  departmentId: '',
  fullName: '',
  specialization: '',
  licenseNumber: '',
  phone: ''
})

const resetForm = () => {
  form.value = { userId: '', departmentId: '', fullName: '', specialization: '', licenseNumber: '', phone: '' }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/doctors')
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const fetchDependencies = async () => {
  try {
    const [resUsers, resDepts] = await Promise.all([
      axios.get('/users'),
      axios.get('/departments')
    ])
    users.value = resUsers.data
    departments.value = resDepts.data
  } catch (error) {
    console.error('Failed to fetch dependencies', error)
  }
}

const getDepartmentName = (id: string) => {
  if (!id) return '-'
  const d = departments.value.find(item => item.id === id)
  return d ? d.name : id
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
    if (isEditing.value) {
      await axios.patch(`/doctors/${editingId.value}`, form.value)
    } else {
      await axios.post('/doctors', form.value)
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
  if (confirm(`Apakah Anda yakin ingin menghapus dokter ${item.fullName}?`)) {
    try {
      await axios.delete(`/doctors/${item.id}`)
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
