import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// import axios from '../api/axios' // Uncomment when axios is ready

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<{ id: string; email: string; role: string } | null>(null)
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || 'GUEST')

  async function login(email: string, password: string) {
    try {
      // Mock login for now
      // const response = await axios.post('/auth/login', { email, password })
      // token.value = response.data.token
      // user.value = response.data.user
      
      // Temporary mock logic
      token.value = 'dummy-token'
      user.value = { id: '1', email, role: 'ADMIN' }
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed', error)
      throw error
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  // Load user from local storage if exists
  function init() {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        logout()
      }
    }
  }

  return { token, user, isAuthenticated, userRole, login, logout, init }
})
