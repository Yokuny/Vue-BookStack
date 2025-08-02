import { createRouter, createWebHistory } from 'vue-router'
import AppView from '../views/AppView.vue'
import AddBookView from '../views/AddBookView.vue'
import BookDetailView from '../views/BookDetailView.vue'

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
      name: 'newBook',
      component: AddBookView,
    },
    {
      path: '/add-book',
      name: 'addBook',
      component: AddBookView,
    },
    {
      path: '/book/:isbn',
      name: 'bookDetail',
      component: BookDetailView,
    },
  ],
})

export default router
