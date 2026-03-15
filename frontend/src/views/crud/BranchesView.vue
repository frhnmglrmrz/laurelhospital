<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Kantor Cabang</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola data cabang rumah sakit</p>
      </div>
    </div>

    <DataTable 
      title="Cabang"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-hospitalId="{ row }">
        {{ getHospitalName(row.hospitalId) }}
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Cabang' : 'Tambah Cabang'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Rumah Sakit Induk <span class="text-red-500">*</span></label>
        <select v-model="form.hospitalId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="" disabled>Pilih Rumah Sakit</option>
          <option v-for="h in hospitals" :key="h.id" :value="h.id">{{ h.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Cabang <span class="text-red-500">*</span></label>
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
  { key: 'name', label: 'Nama Cabang' },
  { key: 'hospitalId', label: 'RS Induk' },
  { key: 'phone', label: 'Telepon' },
]

const items = ref([])
const hospitals = ref<any[]>([])
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  hospitalId: '',
  name: '',
  code: '',
  phone: '',
  email: '',
  address: ''
})

const resetForm = () => {
  form.value = { hospitalId: '', name: '', code: '', phone: '', email: '', address: '' }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/branches')
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const fetchHospitals = async () => {
  try {
    const res = await axios.get('/hospitals')
    hospitals.value = res.data
  } catch (error) {
    console.error('Failed to fetch hospitals', error)
  }
}

const getHospitalName = (id: string) => {
  const h = hospitals.value.find(item => item.id === id)
  return h ? h.name : id
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
      await axios.patch(`/branches/${editingId.value}`, form.value)
    } else {
      await axios.post('/branches', form.value)
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
  if (confirm(`Apakah Anda yakin ingin menghapus cabang ${item.name}?`)) {
    try {
      await axios.delete(`/branches/${item.id}`)
      await fetchItems()
    } catch (error) {
      alert('Gagal menghapus data')
    }
  }
}

onMounted(() => {
  fetchHospitals()
  fetchItems()
})
</script>
