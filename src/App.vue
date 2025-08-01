<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, ref } from 'vue'

const route = useRoute()
const currentMode = ref('signin')
const signinData = ref({ name: '', password: '' })
const signupData = ref({ name: '', password: '', confirmPassword: '' })

const showAccessPage = computed(() => {
  return route.name === 'access'
})

const setMode = (mode: string) => {
  currentMode.value = mode
}

const handleSignin = () => {
  console.log('Signin:', signinData.value)
}

const handleSignup = () => {
  console.log('Signup:', signupData.value)
}

const handleGuest = () => {
  currentMode.value = 'guest'
  console.log('Guest login...')
}
</script>

<template id="app">
  <header v-if="showAccessPage" class="header">
    <div class="template-header">
      <p class="logo">Book Stack</p>
      <div style="display: flex; gap: 1rem">
        <button @click="setMode('signin')" class="nav-link">Entrar</button>
        <button @click="setMode('signup')" class="nav-link">Novo usuário</button>
        <button @click="handleGuest" class="nav-link">Visitante</button>
      </div>
    </div>

    <div v-if="currentMode === 'signin'">
      <h3>Entrar</h3>
      <div>
        <label>Nome:</label>
        <input v-model="signinData.name" type="text" />
      </div>
      <div>
        <label>Senha:</label>
        <input v-model="signinData.password" type="password" />
      </div>
      <button @click="handleSignin">Entrar</button>
    </div>

    <div v-if="currentMode === 'signup'">
      <h3>Criar Conta</h3>
      <div>
        <label>Nome:</label>
        <input v-model="signupData.name" type="text" />
      </div>
      <div>
        <label>Senha:</label>
        <input v-model="signupData.password" type="password" />
      </div>
      <div>
        <label>Confirmar Senha:</label>
        <input v-model="signupData.confirmPassword" type="password" />
      </div>
      <button @click="handleSignup">Criar Conta</button>
    </div>

    <div v-if="currentMode === 'guest'">
      <h3>Carregando...</h3>
      <p>Entrando como visitante...</p>
    </div>
  </header>

  <main v-else class="main">
    <RouterView />
  </main>
</template>

<style>
.header,
.main {
  background-color: var(--base);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 2rem;
}

.logo {
  color: var(--vt-c-text-light-2);
  font-family: 'Luckiest Guy', cursive;
  font-weight: 400;
  font-style: normal;
}
</style>
