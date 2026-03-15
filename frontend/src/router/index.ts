import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Layouts
import DashboardLayout from '../layouts/DashboardLayout.vue'

// Views
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: 'hospitals',
          name: 'hospitals',
          component: () => import('../views/crud/HospitalsView.vue')
        },
        {
          path: 'branches',
          name: 'branches',
          component: () => import('../views/crud/BranchesView.vue')
        },
        {
          path: 'departments',
          name: 'departments',
          component: () => import('../views/crud/DepartmentsView.vue')
        },
        {
          path: 'rooms',
          name: 'rooms',
          component: () => import('../views/crud/RoomsView.vue')
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('../views/crud/UsersView.vue')
        },
        {
          path: 'staff',
          name: 'staff',
          component: () => import('../views/crud/StaffView.vue')
        },
        {
          path: 'doctors',
          name: 'doctors',
          component: () => import('../views/crud/DoctorsView.vue')
        },
        {
          path: 'patients',
          name: 'patients',
          component: () => import('../views/crud/PatientsView.vue')
        },
        {
          path: 'schedules',
          name: 'schedules',
          component: () => import('../views/crud/SchedulesView.vue')
        },
        {
          path: 'appointments',
          name: 'appointments',
          component: () => import('../views/crud/AppointmentsView.vue')
        },
        {
          path: 'admissions',
          name: 'admissions',
          component: () => import('../views/crud/AdmissionsView.vue')
        },
        {
          path: 'beds',
          name: 'beds',
          component: () => import('../views/crud/BedsView.vue')
        },
        {
          path: 'medical-records',
          name: 'medical-records',
          component: () => import('../views/crud/MedicalRecordsView.vue')
        },
        {
          path: 'medicines',
          name: 'medicines',
          component: () => import('../views/crud/MedicinesView.vue')
        },
        {
          path: 'prescriptions',
          name: 'prescriptions',
          component: () => import('../views/crud/PrescriptionsView.vue')
        },
        {
          path: 'invoices',
          name: 'invoices',
          component: () => import('../views/crud/InvoicesView.vue')
        },
        {
          path: 'payments',
          name: 'payments',
          component: () => import('../views/crud/PaymentsView.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
