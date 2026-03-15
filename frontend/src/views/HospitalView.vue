<template>
  <div>
    <!-- Header Area -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-primary">Data Rumah Sakit</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola data seluruh jaringan rumah sakit</p>
      </div>
      <button 
        @click="openModal()" 
        class="bg-accent hover:bg-teal-700 text-white font-medium py-2 px-4 rounded shadow-sm transition-colors flex items-center text-sm"
      >
        <span class="mr-2 text-lg leading-none">+</span> Tambah Data
      </button>
    </div>

    <!-- Data Table -->
    <div v-if="loading && items.length === 0" class="text-center py-12 text-gray-400">
      Memuat data...
    </div>
    
    <DataTable 
      v-else
      :columns="columns" 
      :data="items" 
      @edit="openModal" 
      @delete="confirmDelete" 
    />

    <!-- Form Modal -->
    <FormModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Rumah Sakit' : 'Tambah Rumah Sakit'"
      :loading="saving"
      @submit="save"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nama Rumah Sakit <span class="text-danger">*</span></label>
          <input 
            v-model="form.name" 
            type="text" 
            required
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            placeholder="Contoh: Laurel Hospital Pusat"
          >
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kode Unik <span class="text-danger">*</span></label>
            <input 
              v-model="form.code" 
              type="text" 
              required
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              placeholder="Contoh: LHP-01"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Telepon <span class="text-danger">*</span></label>
            <input 
              v-model="form.phone" 
              type="text" 
              required
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              placeholder="021-1234567"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            placeholder="info@laurelhospital.com"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap <span class="text-danger">*</span></label>
          <textarea 
            v-model="form.address" 
            required
            rows="3"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
            placeholder="Jl. Kesehatan No. 123..."
          ></textarea>
        </div>
      </div>
    </FormModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { hospitalService } from '../api/services/hospital'
import DataTable from '../components/DataTable.vue'
import FormModal from '../components/FormModal.vue'

// State
const items = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const isModalOpen = ref(false)
const isEditing = ref(false)

const columns = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Nama Cabang' },
  { key: 'phone', label: 'Telepon' },
  { key: 'email', label: 'Email' },
]

// Form State
const defaultForm: any = {
  id: '',
  name: '',
  code: '',
  address: '',
  phone: '',
  email: ''
}
const form = ref({ ...defaultForm })

// Methods
const fetchItems = async () => {
  loading.value = true
  try {
    const response = await hospitalService.getAll()
    items.value = response.data
  } catch (error) {
    console.error('Failed to fetch data:', error)
    alert('Gagal mengambil data dari server')
  } finally {
    loading.value = false
  }
}

const openModal = (item?: any) => {
  if (item) {
    isEditing.value = true
    form.value = { ...item }
  } else {
    isEditing.value = false
    form.value = { ...defaultForm }
  }
  isModalOpen.value = true
}

const save = async () => {
  saving.value = true
  try {
    const payload = { ...form.value }
    const id = payload.id
    delete payload.id // Remove ID from payload for NestJS DTO validation
    
    if (isEditing.value) {
      await hospitalService.update(id, payload)
    } else {
      await hospitalService.create(payload)
    }
    
    isModalOpen.value = false
    await fetchItems() // Refresh table
  } catch (error: any) {
    console.error('Failed to save:', error)
    alert(error.response?.data?.message || 'Gagal menyimpan data')
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (item: any) => {
  if (confirm(`Apakah Anda yakin ingin menghapus ${item.name}?`)) {
    try {
      await hospitalService.remove(item.id)
      await fetchItems() // Refresh table
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Gagal menghapus data')
    }
  }
}

// Lifecycle
onMounted(() => {
  fetchItems()
})
</script>
