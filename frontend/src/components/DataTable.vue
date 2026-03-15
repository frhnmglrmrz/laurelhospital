<template>
  <div class="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Toolbar -->
    <div class="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="relative w-full sm:w-64">
        <input 
          type="text" 
          v-model="searchQuery"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-accent focus:border-accent outline-none"
          placeholder="Cari..."
        />
        <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>
      <div>
        <button 
          @click="$emit('add')"
          class="bg-accent hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
        >
          <span class="mr-2">➕</span> Tambah {{ title }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th 
              v-for="col in columns" 
              :key="col.key" 
              class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              {{ col.label }}
            </th>
            <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="filteredData.length === 0" class="hover:bg-gray-50/50">
            <td :colspan="columns.length + 1" class="px-6 py-8 text-center text-gray-500">
              Tidak ada data ditemukan
            </td>
          </tr>
          <tr 
            v-for="(row, index) in filteredData" 
            :key="row.id || index"
            class="hover:bg-gray-50/80 transition-colors"
          >
            <td 
              v-for="col in columns" 
              :key="col.key" 
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
            >
              <slot :name="'col-' + col.key" :row="row">
                <!-- Default rendering -->
                {{ formatValue(row[col.key], col.format) }}
              </slot>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="$emit('edit', row)" class="text-blue-600 hover:text-blue-900 mr-3">Ubah</button>
              <button @click="$emit('delete', row)" class="text-red-600 hover:text-red-900">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  title: string,
  columns: Array<{ key: string, label: string, format?: string }>,
  data: Array<any>
}>()

defineEmits(['add', 'edit', 'delete'])

const searchQuery = ref('')

const filteredData = computed(() => {
  if (!searchQuery.value) return props.data
  const query = searchQuery.value.toLowerCase()
  return props.data.filter(row => {
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(query)
    )
  })
})

const formatValue = (val: any, format?: string) => {
  if (val === null || val === undefined) return '-'
  if (format === 'date') return new Date(val).toLocaleDateString('id-ID')
  if (format === 'currency') return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)
  return val
}
</script>
