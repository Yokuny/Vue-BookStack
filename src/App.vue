<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { Card, Button, Switch } from './components'

const route = useRoute()
const currentMode = ref('signin')
const signinData = ref({ name: '', password: '' })
const signupData = ref({ name: '', password: '', confirmPassword: '' })

const showAccessPage = computed(() => {
  return route.name === 'access'
})

const isSignup = computed({
  get: () => currentMode.value === 'signup',
  set: (value: boolean) => {
    currentMode.value = value ? 'signup' : 'signin'
  },
})

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
  <Card v-if="showAccessPage">
    <header class="template-header">
      <p class="logo">Book Stack</p>
      <div class="navigation-controls">
        <Switch v-model="isSignup" left-label="Entrar" right-label="Registrar" />

        <Button v-if="currentMode !== 'guest'" @click="handleGuest" variant="system">
          Visitante
        </Button>
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
        <Button class="input-size" @click="handleSignin" variant="primary">Entrar</Button>
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
        <Button class="input-size" @click="handleSignup" variant="primary">Criar Conta</Button>
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
  </Card>

  <Card v-else>
    <RouterView />
  </Card>
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
