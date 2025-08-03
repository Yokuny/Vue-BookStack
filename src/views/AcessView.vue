<script setup lang="ts">
import { computed, ref } from 'vue'
import { Card, Button, Switch, AppLayout, Input } from '../components'
import { useAuth } from '../composables/useAuth'
import { useSignup } from '../composables/useSignup'

const currentMode = ref('signin')
const signinData = ref({ name: '', password: '' })
const signupData = ref({ name: '', password: '', confirmPassword: '' })

const auth = useAuth()
const signup = useSignup()

const isSignup = computed({
  get: () => currentMode.value === 'signup',
  set: (value: boolean) => {
    currentMode.value = value ? 'signup' : 'signin'
    auth.clearMessages()
    signup.clearMessages()
  },
})

const handleSignin = async () => {
  const success = await auth.signin(signinData.value)
  if (success) signinData.value = { name: '', password: '' }
}

const handleSignup = async () => {
  const res = await signup.signup(
    { name: signupData.value.name, password: signupData.value.password },
    signupData.value.confirmPassword,
  )

  if (res) {
    signupData.value = { name: '', password: '', confirmPassword: '' }
    currentMode.value = 'signin'
  }
}

const handleGuest = () => {
  currentMode.value = 'guest'
}
</script>

<template>
  <AppLayout>
    <template #actions>
      <Switch v-model="isSignup" left-label="Entrar" right-label="Registrar" />
      <Button v-if="currentMode !== 'guest'" @click="handleGuest" variant="system">
        Visitante
      </Button>
    </template>

    <Card>
      <div v-if="currentMode === 'signin'" class="form">
        <div class="form-group form-group-size">
          <h3 class="form-title">Entrar</h3>

          <div v-if="auth.error.value" class="message error-message">
            {{ auth.error.value }}
          </div>
          <div v-if="auth.success.value" class="message success-message">
            {{ auth.success.value }}
          </div>

          <Input
            v-model="signinData.name"
            label="Nome"
            type="text"
            :disabled="auth.isLoading.value"
            @input="auth.clearMessages"
            class="input-size"
          />
          <Input
            v-model="signinData.password"
            label="Senha"
            type="password"
            :disabled="auth.isLoading.value"
            @input="auth.clearMessages"
            @keyup.enter="handleSignin"
            class="input-size"
          />
          <Button
            class="input-size"
            @click="handleSignin"
            variant="primary"
            :disabled="auth.isLoading.value"
          >
            {{ auth.isLoading.value ? 'Entrando...' : 'Entrar' }}
          </Button>
          <div>
            <span> Não tem uma conta? </span>
            <a class="link-btn" href="#" @click="isSignup = true">Criar conta</a>
          </div>
        </div>
      </div>

      <div v-if="currentMode === 'signup'" class="form">
        <div class="form-group form-group-size">
          <h3 class="form-title">Criar conta</h3>

          <div v-if="signup.error.value" class="message error-message">
            {{ signup.error.value }}
          </div>
          <div v-if="signup.success.value" class="message success-message">
            {{ signup.success.value }}
          </div>

          <Input
            v-model="signupData.name"
            label="Nome"
            type="text"
            :disabled="signup.isLoading.value"
            @input="signup.clearMessages"
            class="input-size"
          />
          <Input
            v-model="signupData.password"
            label="Senha"
            type="password"
            :disabled="signup.isLoading.value"
            @input="signup.clearMessages"
            class="input-size"
          />
          <Input
            v-model="signupData.confirmPassword"
            label="Confirmar Senha"
            type="password"
            :disabled="signup.isLoading.value"
            @input="signup.clearMessages"
            @keyup.enter="handleSignup"
            class="input-size"
          />
          <Button
            class="input-size"
            @click="handleSignup"
            variant="primary"
            :disabled="signup.isLoading.value"
          >
            {{ signup.isLoading.value ? 'Criando conta...' : 'Criar Conta' }}
          </Button>
          <div>
            <span> Já tem uma conta? </span>
            <a class="link-btn" href="#" @click="isSignup = false">Entrar</a>
          </div>
        </div>
      </div>

      <div v-if="currentMode === 'guest'" class="form">
        <div>
          <h3>Carregando...</h3>
          <p>Entrando como visitante...</p>
        </div>
      </div>
    </Card>
  </AppLayout>
</template>

<style>
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

.message {
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  width: 100%;
  text-align: center;
  font-weight: 500;
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.success-message {
  background-color: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.link-btn {
  color: var(--color-text);
  text-decoration: underline;
}
</style>
