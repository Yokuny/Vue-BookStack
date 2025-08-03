<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuth } from './composables/useAuth'
import AcessView from './views/AcessView.vue'

const auth = useAuth()
</script>

<template id="app">
  <RouterView v-if="auth.isAuthenticated.value" />
  <AcessView v-else />
</template>
