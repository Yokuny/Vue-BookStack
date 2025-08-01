import { createRouter, createWebHistory } from 'vue-router'
import AccessView from '../views/AcessView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'access',
      component: AccessView,
    },
  ],
})

export default router
