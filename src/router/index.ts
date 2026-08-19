import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: () => (isAuthenticated() ? '/home' : '/login'),
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/cadastro',
    component: () => import('@/views/RegisterPage.vue'),
  },
  {
    path: '/home',
    component: () => import('@/views/HomePage.vue'),
    beforeEnter: (_, __, next) => {
      if (isAuthenticated()) {
        next()
        return
      }
      next('/login')
    },
  },
  {
    path: '/sobre',
    component: () => import('@/views/AboutPage.vue'),
    beforeEnter: (_, __, next) => {
      if (isAuthenticated()) {
        next()
        return
      }
      next('/login')
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
