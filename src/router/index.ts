import { createRouter, createWebHistory } from 'vue-router'
import AppView from '../views/AppView.vue'
import AddBookView from '../views/AddBookView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppView,
    },
    {
      path: '/app',
      name: 'app',
      component: AppView,
    },
    {
      path: '/newbook',
      name: 'addBook',
      component: AddBookView,
    },
  ],
})

export default router
