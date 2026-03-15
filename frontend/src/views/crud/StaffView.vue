<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Staf RS</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola data profil staf dan pegawai</p>
      </div>
    </div>

    <DataTable 
      title="Staf"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-branchId="{ row }">
        {{ getBranchName(row.branchId) }}
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Staf' : 'Tambah Staf Profil'"
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
        <label class="block text-sm font-medium text-gray-700 mb-1">Kantor Cabang <span class="text-red-500">*</span></label>
        <select v-model="form.branchId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="" disabled>Pilih Cabang</option>
          <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label>
        <input v-model="form.fullName" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Posisi / Jabatan <span class="text-red-500">*</span></label>
        <input v-model="form.position" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
        <input v-model="form.phone" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
        <textarea v-model="form.address" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"></textarea>
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
  { key: 'fullName', label: 'Nama Lengkap' },
  { key: 'position', label: 'Jabatan' },
  { key: 'branchId', label: 'Cabang' },
  { key: 'phone', label: 'Telepon' },
]

const items = ref([])
const users = ref<any[]>([])
const branches = ref<any[]>([])
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  userId: '',
  branchId: '',
  fullName: '',
  position: '',
  phone: '',
  address: ''
})

const resetForm = () => {
  form.value = { userId: '', branchId: '', fullName: '', position: '', phone: '', address: '' }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/staffs') // Assuming endpoint is plural
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const fetchDependencies = async () => {
  try {
    const [resUsers, resBranches] = await Promise.all([
      axios.get('/users'),
      axios.get('/branches')
    ])
    // Filter users to only staff-like roles if necessary, or just all
    users.value = resUsers.data
    branches.value = resBranches.data
  } catch (error) {
    console.error('Failed to fetch dependencies', error)
  }
}

const getBranchName = (id: string) => {
  const b = branches.value.find(item => item.id === id)
  return b ? b.name : id
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
      await axios.patch(`/staffs/${editingId.value}`, form.value)
    } else {
      await axios.post('/staffs', form.value)
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
  if (confirm(`Apakah Anda yakin ingin menghapus staf ${item.fullName}?`)) {
    try {
      await axios.delete(`/staffs/${item.id}`)
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
