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

const toggleSignMode = () => {
  if (currentMode.value === 'signin') {
    currentMode.value = 'signup'
  } else {
    currentMode.value = 'signin'
  }
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
  <div v-if="showAccessPage" class="card">
    <header class="template-header">
      <p class="logo">Book Stack</p>
      <div class="navigation-controls">
        <!-- Switch para alternar entre Signin e Signup -->
        <div class="switch-container">
          <div class="switch" @click="toggleSignMode">
            <span class="switch-option left" :class="{ active: currentMode === 'signin' }"
              >Entrar</span
            >
            <span class="switch-option right" :class="{ active: currentMode === 'signup' }"
              >Registrar</span
            >
            <div class="switch-slider" :class="{ 'slide-right': currentMode === 'signup' }"></div>
          </div>
        </div>

        <!-- Botão separado para visitante -->
        <button v-if="currentMode !== 'guest'" @click="handleGuest" class="button-system">
          Visitante
        </button>
      </div>
    </header>

    <div v-if="currentMode === 'signin'" class="form">
      <div class="form-group form-group-size">
        <h3 class="form-title">Entrar</h3>
        <div class="input-group input-size">
          <label>Nome:</label>
          <input v-model="signinData.name" type="text" />
        </div>
        <div class="input-group input-size">
          <label>Senha:</label>
          <input v-model="signinData.password" type="password" />
        </div>
        <button class="button-primary input-size" @click="handleSignin">Entrar</button>
      </div>
    </div>

    <div v-if="currentMode === 'signup'" class="form">
      <div class="form-group form-group-size">
        <h3 class="form-title">Criar conta</h3>
        <div class="input-group input-size">
          <label>Nome:</label>
          <input v-model="signupData.name" type="text" />
        </div>
        <div class="input-group input-size">
          <label>Senha:</label>
          <input v-model="signupData.password" type="password" />
        </div>
        <div class="input-group input-size">
          <label>Confirmar Senha:</label>
          <input v-model="signupData.confirmPassword" type="password" />
        </div>
        <button class="button-primary input-size" @click="handleSignup">Criar Conta</button>
      </div>
    </div>

    <div v-if="currentMode === 'guest'" class="form">
      <div>
        <h3>Carregando...</h3>
        <p>Entrando como visitante...</p>
      </div>
    </div>

    <footer class="template-footer" style="padding: 2rem">
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis ipsum, hic quod eos animi
        pariatur sapiente repellendus aliquid. Amet nisi, dolor architecto odit ut provident iste
        deserunt obcaecati ad quas!
      </p>
    </footer>
  </div>

  <main v-else class="card">
    <RouterView />
  </main>
</template>

<style>
.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  font-size: 2rem;
}

.form {
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  min-height: 50vh;
  height: 100%;
  padding: 1rem;
}

.form-title {
  font-family: 'Whisper', cursive;
  font-weight: 400;
  font-style: normal;
  font-size: 4rem;
}

.form-group-size {
  display: flex;
  align-items: center;
  flex-direction: column;
  max-width: 400px;
  width: 100%;
}

.input-size {
  width: 100%;
}

.navigation-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
