<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Akun Pengguna</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola data login pengguna sistem</p>
      </div>
    </div>

    <DataTable 
      title="Pengguna"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-isActive="{ row }">
        <span :class="row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 rounded-full text-xs font-medium">
          {{ row.isActive ? 'Aktif' : 'Nonaktif' }}
        </span>
      </template>
      <template #col-role="{ row }">
        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold tracking-wide">
          {{ row.role }}
        </span>
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Pengguna' : 'Tambah Pengguna Baru'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
        <input v-model="form.email" type="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password <span v-if="!isEditing" class="text-red-500">*</span></label>
        <input v-model="form.password" type="password" :required="!isEditing" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" :placeholder="isEditing ? 'Kosongkan jika tidak ingin mengubah password' : ''" />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Hak Akses (Role) <span class="text-red-500">*</span></label>
        <select v-model="form.role" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
        </select>
      </div>

      <div class="flex items-center mt-4">
        <input v-model="form.isActive" type="checkbox" id="isActive" class="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent" />
        <label for="isActive" class="ml-2 block text-sm text-gray-900">
          Akun Aktif
        </label>
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
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'isActive', label: 'Status' }
]

const roles = ['ADMIN', 'DOCTOR', 'NURSE', 'PHARMACIST', 'RECEPTIONIST', 'LAB_TECHNICIAN', 'PATIENT']

const items = ref([])
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  email: '',
  password: '',
  role: 'PATIENT',
  isActive: true
})

const resetForm = () => {
  form.value = { email: '', password: '', role: 'PATIENT', isActive: true }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/users')
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const openModal = (item = null) => {
  resetForm()
  if (item) {
    isEditing.value = true
    editingId.value = item.id
    form.value = { 
      email: item.email, 
      password: '', // do not populate password
      role: item.role, 
      isActive: item.isActive 
    }
  }
  isModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = { ...form.value }
    if (isEditing.value && !payload.password) {
      delete payload.password // don't send empty password if editing
    }

    if (isEditing.value) {
      await axios.patch(`/users/${editingId.value}`, payload)
    } else {
      await axios.post('/users', payload)
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
  if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${item.email}?`)) {
    try {
      await axios.delete(`/users/${item.id}`)
      await fetchItems()
    } catch (error) {
      alert('Gagal menghapus data')
    }
  }
}

onMounted(() => {
  fetchItems()
})
</script>
