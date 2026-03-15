<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Rumah Sakit</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola data rumah sakit utama</p>
      </div>
    </div>

    <DataTable 
      title="Rumah Sakit"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    />

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Rumah Sakit' : 'Tambah Rumah Sakit'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Rumah Sakit <span class="text-red-500">*</span></label>
        <input v-model="form.name" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Kode Cabang <span class="text-red-500">*</span></label>
        <input v-model="form.code" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon <span class="text-red-500">*</span></label>
        <input v-model="form.phone" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input v-model="form.email" type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Alamat <span class="text-red-500">*</span></label>
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
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Nama RS' },
  { key: 'phone', label: 'Telepon' },
  { key: 'email', label: 'Email' }
]

const items = ref([])
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  code: '',
  phone: '',
  email: '',
  address: ''
})

const resetForm = () => {
  form.value = { name: '', code: '', phone: '', email: '', address: '' }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/hospitals')
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
    form.value = { ...item }
  }
  isModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await axios.patch(`/hospitals/${editingId.value}`, form.value)
    } else {
      await axios.post('/hospitals', form.value)
    }
    await fetchItems()
    isModalOpen.value = false
  } catch (error: any) {
    alert('Buku Terjadi kesalahan saat menyimpan: ' + (error.response?.data?.message || error.message))
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async (item: any) => {
  if (confirm(`Apakah Anda yakin ingin menghapus rumah sakit ${item.name}?`)) {
    try {
      await axios.delete(`/hospitals/${item.id}`)
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
