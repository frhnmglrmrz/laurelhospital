<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Master Obat (Medicines)</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola data master obat dan persediaan</p>
      </div>
    </div>

    <DataTable 
      title="Daftar Obat"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-price="{ row }">
        Rp {{ row.price?.toLocaleString('id-ID') || 0 }}
      </template>
      <template #col-requiresPrescription="{ row }">
        <span :class="row.requiresPrescription ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" class="px-2 py-1 rounded-full text-xs font-medium">
          {{ row.requiresPrescription ? 'Ya' : 'Tidak' }}
        </span>
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Obat' : 'Tambah Obat Baru'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama / Merk Obat <span class="text-red-500">*</span></label>
        <input v-model="form.name" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="Cth: Paracetamol 500mg" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Kategori / Jenis Obat <span class="text-red-500">*</span></label>
          <input v-model="form.category" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="Cth: Analgesik, Sirup" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Produsen / Pabrik <span class="text-red-500">*</span></label>
          <input v-model="form.manufacturer" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Harga Satuan (Rp) <span class="text-red-500">*</span></label>
          <input v-model="form.price" type="number" required min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Batas Stok Minimum (Peringatan) <span class="text-red-500">*</span></label>
          <input v-model="form.minStockLevel" type="number" required min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" />
        </div>
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Tambahan</label>
        <textarea v-model="form.description" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"></textarea>
      </div>

      <div class="flex items-center mt-4">
        <input v-model="form.requiresPrescription" type="checkbox" id="requiresPrescription" class="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent" />
        <label for="requiresPrescription" class="ml-2 block text-sm text-gray-900 font-medium">
          Wajib Resep Dokter
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
  { key: 'name', label: 'Nama Obat' },
  { key: 'category', label: 'Kategori' },
  { key: 'manufacturer', label: 'Produsen' },
  { key: 'price', label: 'Harga' },
  { key: 'requiresPrescription', label: 'Butuh Resep' }
]

const items = ref([])

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  description: '',
  category: '',
  manufacturer: '',
  price: 0,
  requiresPrescription: false,
  minStockLevel: 10
})

const resetForm = () => {
  form.value = { 
    name: '', description: '', category: '', 
    manufacturer: '', price: 0, requiresPrescription: false, minStockLevel: 10
  }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/medicines')
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
    form.value = { ...item, price: Number(item.price), minStockLevel: Number(item.minStockLevel) }
  }
  isModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = { 
      ...form.value, 
      price: Number(form.value.price),
      minStockLevel: Number(form.value.minStockLevel)
    }
    
    if (isEditing.value) {
      await axios.patch(`/medicines/${editingId.value}`, payload)
    } else {
      await axios.post('/medicines', payload)
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
  if (confirm(`Apakah Anda yakin ingin menghapus data obat ${item.name}?`)) {
    try {
      await axios.delete(`/medicines/${item.id}`)
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
