<script setup lang="ts">
import { useAuth } from './composables/useAuth'
import AcessView from './views/AcessView.vue'
import AppView from './views/AppView.vue'
const auth = useAuth()
</script>

<template id="app">
  <AppView v-if="auth.isAuthenticated.value" />
  <AcessView v-else />
</template>
