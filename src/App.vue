<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const showLogIn = computed(() => {
  return route.name !== 'login'
})

</script>

<template>
  <div id="app">
    <header v-if="showLogIn" class="header">
          <RouterLink to="/signin" class="nav-link">Entrar</RouterLink>
          <RouterLink to="/signup" class="nav-link">Novo usuário</RouterLink>
          <RouterLink to="/guest" class="nav-link">Visitante</RouterLink>
    </header>

    <main v-else class="main">
        <RouterView />
    </main>
  </div>
</template>

<style>

</style>
