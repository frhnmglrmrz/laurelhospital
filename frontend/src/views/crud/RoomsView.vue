<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Kamar & Ruangan</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola data kamar rawat inap / ruangan RS</p>
      </div>
    </div>

    <DataTable 
      title="Kamar"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-branchId="{ row }">
        {{ getBranchName(row.branchId) }}
      </template>
      <template #col-price="{ row }">
        Rp {{ row.price?.toLocaleString('id-ID') || 0 }}
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Kamar' : 'Tambah Kamar'"
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
        <label class="block text-sm font-medium text-gray-700 mb-1">Tipe Ruangan <span class="text-red-500">*</span></label>
        <select v-model="form.type" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option v-for="t in roomTypes" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Kamar <span class="text-red-500">*</span></label>
        <input v-model="form.number" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Lantai</label>
        <input v-model="form.floor" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tarif per Malam (Rp) <span class="text-red-500">*</span></label>
        <input v-model="form.price" type="number" required min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
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
  { key: 'number', label: 'No Kamar' },
  { key: 'type', label: 'Tipe' },
  { key: 'branchId', label: 'Cabang' },
  { key: 'floor', label: 'Lantai' },
  { key: 'price', label: 'Tarif/Malam' },
]

const roomTypes = ['GENERAL', 'VIP', 'VVIP', 'ICU', 'NICU', 'ISOLATION', 'EMERGENCY']

const items = ref([])
const branches = ref<any[]>([])
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  branchId: '',
  number: '',
  type: 'GENERAL',
  floor: '',
  price: 0
})

const resetForm = () => {
  form.value = { branchId: '', number: '', type: 'GENERAL', floor: '', price: 0 }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/rooms')
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
    form.value = { ...item, price: Number(item.price) }
  }
  isModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = { ...form.value, price: Number(form.value.price) }
    if (isEditing.value) {
      await axios.patch(`/rooms/${editingId.value}`, payload)
    } else {
      await axios.post('/rooms', payload)
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
  if (confirm(`Apakah Anda yakin ingin menghapus kamar ${item.number}?`)) {
    try {
      await axios.delete(`/rooms/${item.id}`)
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
