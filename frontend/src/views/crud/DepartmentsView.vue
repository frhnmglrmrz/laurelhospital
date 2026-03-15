<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Departemen</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola divisi / departemen di setiap cabang</p>
      </div>
    </div>

    <DataTable 
      title="Departemen"
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
      :title="isEditing ? 'Ubah Departemen' : 'Tambah Departemen'"
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

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Departemen <span class="text-red-500">*</span></label>
        <input v-model="form.name" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Kode Departemen <span class="text-red-500">*</span></label>
        <input v-model="form.code" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Lantai Ruangan</label>
        <input v-model="form.floor" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="Contoh: Lantai 2 Sayap Kiri" />
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
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Nama Departemen' },
  { key: 'branchId', label: 'Cabang' },
  { key: 'floor', label: 'Lantai' },
]

const items = ref([])
const branches = ref<any[]>([])
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  branchId: '',
  name: '',
  code: '',
  floor: ''
})

const resetForm = () => {
  form.value = { branchId: '', name: '', code: '', floor: '' }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/departments')
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const fetchBranches = async () => {
  try {
    const res = await axios.get('/branches')
    branches.value = res.data
  } catch (error) {
    console.error('Failed to fetch branches', error)
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
      await axios.patch(`/departments/${editingId.value}`, form.value)
    } else {
      await axios.post('/departments', form.value)
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
  if (confirm(`Apakah Anda yakin ingin menghapus departemen ${item.name}?`)) {
    try {
      await axios.delete(`/departments/${item.id}`)
      await fetchItems()
    } catch (error) {
      alert('Gagal menghapus data')
    }
  }
}

onMounted(() => {
  fetchBranches()
  fetchItems()
})
</script>
