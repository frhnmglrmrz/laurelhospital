<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Tempat Tidur (Bed)</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola ketersediaan tempat tidur dalam kamar</p>
      </div>
    </div>

    <DataTable 
      title="Bed"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-roomId="{ row }">
        Kamar {{ getRoomNumber(row.roomId) }} (Lantai {{ getRoomFloor(row.roomId) }})
      </template>
      <template #col-status="{ row }">
        <span class="px-2 py-1 rounded-full text-xs font-bold" :class="{
          'bg-green-100 text-green-800': row.status === 'AVAILABLE',
          'bg-red-100 text-red-800': row.status === 'OCCUPIED',
          'bg-yellow-100 text-yellow-800': row.status === 'MAINTENANCE'
        }">
          {{ row.status }}
        </span>
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Tempat Tidur' : 'Tambah Tempat Tidur'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Kamar <span class="text-red-500">*</span></label>
        <select v-model="form.roomId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="" disabled>Pilih Kamar</option>
          <option v-for="r in rooms" :key="r.id" :value="r.id">Kamar {{ r.number }} (Tipe: {{ r.type }})</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nomor/Kode Bed <span class="text-red-500">*</span></label>
        <input v-model="form.number" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="Cth: Bed A, Bed 01" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status Ketersediaan <span class="text-red-500">*</span></label>
        <select v-model="form.status" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="AVAILABLE">AVAILABLE (Tersedia)</option>
          <option value="OCCUPIED">OCCUPIED (Terisi)</option>
          <option value="MAINTENANCE">MAINTENANCE (Pemeliharaan)</option>
        </select>
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
  { key: 'roomId', label: 'Info Kamar' },
  { key: 'number', label: 'No Bed' },
  { key: 'status', label: 'Status' }
]

const items = ref([])
const rooms = ref<any[]>([])

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  roomId: '',
  number: '',
  status: 'AVAILABLE'
})

const resetForm = () => {
  form.value = { roomId: '', number: '', status: 'AVAILABLE' }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/beds')
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const fetchRooms = async () => {
  try {
    const res = await axios.get('/rooms')
    rooms.value = res.data
  } catch (error) {
    console.error('Failed to fetch rooms', error)
  }
}

const getRoomNumber = (roomId: string) => {
  const r = rooms.value.find(item => item.id === roomId)
  return r ? r.number : roomId
}

const getRoomFloor = (roomId: string) => {
  const r = rooms.value.find(item => item.id === roomId)
  return r ? r.floor : '-'
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
      await axios.patch(`/beds/${editingId.value}`, form.value)
    } else {
      await axios.post('/beds', form.value)
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
  if (confirm(`Apakah Anda yakin ingin menghapus Bed ${item.number}?`)) {
    try {
      await axios.delete(`/beds/${item.id}`)
      await fetchItems()
    } catch (error) {
      alert('Gagal menghapus data')
    }
  }
}

onMounted(() => {
  fetchRooms()
  fetchItems()
})
</script>
