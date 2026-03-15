<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Navbar -->
    <nav class="bg-surface shadow-md py-4 px-8 flex justify-between items-center">
      <div class="text-2xl font-bold text-accent tracking-widest flex items-center gap-2">
        <span class="text-3xl">✦</span> Laurel 
      </div>
      <div>
        <router-link to="/login" class="text-primary font-medium hover:text-accent transition mr-6">Login</router-link>
        <router-link to="/login" class="bg-accent hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-full transition-colors shadow-sm">
          Portal Pasien
        </router-link>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="flex-1 flex flex-col items-center justify-center text-center px-4">
      <div class="max-w-3xl">
        <h1 class="text-5xl md:text-6xl font-extrabold text-primary mb-6 leading-tight">
          Layanan Kesehatan <br />
          <span class="text-accent text-transparent bg-clip-text bg-gradient-to-r from-accent to-teal-400">Terbaik & Modern</span>
        </h1>
        <p class="text-lg md:text-xl text-gray-600 mb-10 font-sans max-w-2xl mx-auto">
          Sistem Manajemen Rumah Sakit Laurel mengintegrasikan seluruh layanan medis dalam satu platform yang mudah digunakan, cepat, dan aman untuk para dokter, staf, dan pasien.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/login" class="bg-primary hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg">
            Dashboard Staf
          </router-link>
          <router-link to="/login" class="bg-surface border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold py-3 px-8 rounded-lg shadow-sm transition-all text-lg">
            Masuk sebagai Pasien
          </router-link>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-primary text-gray-400 text-center py-6 mt-auto">
      <p>&copy; 2026 Laurel Hospital. Hak Cipta Dilindungi.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>
