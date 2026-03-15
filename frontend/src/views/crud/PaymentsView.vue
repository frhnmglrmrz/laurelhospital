<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Pembayaran Tagihan (Payments)</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola data penerimaan pembayaran pasien</p>
      </div>
    </div>

    <DataTable 
      title="Riwayat Pembayaran"
      :columns="columns"
      :data="items"
      @add="openModal()"
      @edit="openModal($event)"
      @delete="confirmDelete"
    >
      <template #col-paymentDate="{ row }">
        {{ new Date(row.paymentDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
      </template>
      <template #col-amount="{ row }">
        <span class="font-bold text-green-700">Rp {{ row.amount?.toLocaleString('id-ID') || 0 }}</span>
      </template>
      <template #col-paymentMethod="{ row }">
        <span class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">
          {{ row.paymentMethod }}
        </span>
      </template>
    </DataTable>

    <DynamicModal 
      v-model="isModalOpen" 
      :title="isEditing ? 'Ubah Bukti Bayar' : 'Terima Pembayaran Baru'"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Tagihan (Invoice) <span class="text-red-500">*</span></label>
        <select v-model="form.invoiceId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
          <option value="" disabled>Pilih Tagihan</option>
          <option v-for="inv in invoices" :key="inv.id" :value="inv.id">
            No: {{ inv.invoiceNumber || inv.id.substring(0,8) }} - Total: Rp {{ inv.amount?.toLocaleString('id-ID') }} - Status: {{ inv.status }}
          </option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Dibayar (Rp) <span class="text-red-500">*</span></label>
          <input v-model="form.amount" type="number" required min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none text-xl font-bold text-green-700" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran <span class="text-red-500">*</span></label>
          <select v-model="form.paymentMethod" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white">
            <option value="CASH">Tunai (CASH)</option>
            <option value="CREDIT_CARD">Kartu Kredit (CREDIT_CARD)</option>
            <option value="DEBIT_CARD">Kartu Debit (DEBIT_CARD)</option>
            <option value="BANK_TRANSFER">Transfer Bank (BANK_TRANSFER)</option>
            <option value="INSURANCE">Asuransi (INSURANCE)</option>
            <option value="E_WALLET">E-Wallet (E_WALLET)</option>
          </select>
        </div>
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Transaksi / Referensi Bank</label>
        <input v-model="form.transactionId" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="Cth: TRX-BCA-9238491" />
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
        <textarea v-model="form.notes" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"></textarea>
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
  { key: 'invoiceId', label: 'Tagihan ID' },
  { key: 'paymentDate', label: 'Waktu Pembayaran' },
  { key: 'amount', label: 'Nominal' },
  { key: 'paymentMethod', label: 'Metode' },
  { key: 'transactionId', label: 'No Ref' }
]

const items = ref([])
const invoices = ref<any[]>([])

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  invoiceId: '',
  amount: 0,
  paymentMethod: 'CASH',
  transactionId: '',
  notes: ''
})

const resetForm = () => {
  form.value = { 
    invoiceId: '', amount: 0, paymentMethod: 'CASH', transactionId: '', notes: '' 
  }
  isEditing.value = false
  editingId.value = null
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/payments')
    items.value = res.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

const fetchInvoices = async () => {
  try {
    const res = await axios.get('/invoices') // Consider fetching only UNPAID or PARTIALLY_PAID
    invoices.value = res.data
  } catch (error) {
    console.error('Failed to fetch dependencies', error)
  }
}

const openModal = (item = null) => {
  resetForm()
  if (item) {
    isEditing.value = true
    editingId.value = item.id
    form.value = { ...item, amount: Number(item.amount) }
  }
  isModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = { 
      ...form.value,
      amount: Number(form.value.amount) 
    }
    
    if (isEditing.value) {
      await axios.patch(`/payments/${editingId.value}`, payload)
    } else {
      await axios.post('/payments', payload)
    }
    await fetchItems()
    await fetchInvoices() // Refresh invoice statuses
    isModalOpen.value = false
  } catch (error: any) {
    alert('Terjadi kesalahan saat menyimpan: ' + (error.response?.data?.message || error.message))
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async (item: any) => {
  if (confirm(`Apakah Anda yakin ingin menghapus data pembayaran ini?`)) {
    try {
      await axios.delete(`/payments/${item.id}`)
      await fetchItems()
      await fetchInvoices()
    } catch (error) {
      alert('Gagal menghapus data')
    }
  }
}

onMounted(() => {
  fetchInvoices()
  fetchItems()
})
</script>
