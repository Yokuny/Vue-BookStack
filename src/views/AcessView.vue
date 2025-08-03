<script setup lang="ts">
import { computed, ref } from 'vue'
import { Card, Button, Switch, AppLayout, Input, DisplayTitle } from '../components'
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
          <DisplayTitle tag="h3" size="large">Entrar</DisplayTitle>

          <Input
            v-model="signinData.name"
            label="Nome"
            type="text"
            :disabled="auth.isLoading.value"
            class="input-size"
          />
          <Input
            v-model="signinData.password"
            label="Senha"
            type="password"
            :disabled="auth.isLoading.value"
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
          <DisplayTitle tag="h3" size="large">Criar conta</DisplayTitle>

          <Input
            v-model="signupData.name"
            label="Nome"
            type="text"
            :disabled="signup.isLoading.value"
            class="input-size"
          />
          <Input
            v-model="signupData.password"
            label="Senha"
            type="password"
            :disabled="signup.isLoading.value"
            class="input-size"
          />
          <Input
            v-model="signupData.confirmPassword"
            label="Confirmar Senha"
            type="password"
            :disabled="signup.isLoading.value"
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
          <DisplayTitle tag="h3" size="medium">Carregando...</DisplayTitle>
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

.link-btn {
  color: var(--color-text);
  text-decoration: underline;
}
</style>
