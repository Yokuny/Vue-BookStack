<script setup lang="ts">
import { ref } from 'vue'
import { Card, Button, AppLayout, Input, Textarea, DisplayTitle } from '../components'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const router = useRouter()
const auth = useAuth()
const toast = useToast()

const bookData = ref({
  isbn: '',
  name: '',
  description: '',
  author: '',
  stock: 0,
})

const isLoading = ref(false)

const handleAddBook = async () => {
  if (!bookData.value.isbn || !bookData.value.name || !bookData.value.author) {
    toast.showError('Por favor, preencha todos os campos obrigatórios')
    return
  }

  isLoading.value = true

  try {
    const res = await auth.makeAuthenticatedRequest('/books', 'POST', bookData.value)

    if (res.success) {
      toast.showSuccess(res.message || 'Livro adicionado com sucesso!')
      bookData.value = {
        isbn: '',
        name: '',
        description: '',
        author: '',
        stock: 0,
      }

      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      toast.showError(res.message || 'Erro ao adicionar livro')
    }
  } catch {
    toast.showError('Falha ao adicionar livro. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}

const handleBack = () => {
  router.push('/')
}
</script>

<template>
  <AppLayout>
    <template #actions>
      <Button @click="handleBack" variant="system">Voltar</Button>
    </template>

    <Card>
      <div class="form">
        <div class="form-group form-group-size">
          <DisplayTitle tag="h3" size="large">Adicionar Livro</DisplayTitle>

          <Input
            v-model="bookData.isbn"
            label="ISBN"
            type="text"
            placeholder="Ex: 978-0-123456-47-2"
            :disabled="isLoading"
            required
          />

          <Input
            v-model="bookData.name"
            label="Nome do Livro"
            type="text"
            placeholder="Digite o nome do livro"
            :disabled="isLoading"
            required
          />

          <Input
            v-model="bookData.author"
            label="Autor"
            type="text"
            placeholder="Digite o nome do autor"
            :disabled="isLoading"
            required
          />

          <Textarea
            v-model="bookData.description"
            label="Descrição"
            placeholder="Digite uma breve descrição do livro"
            :disabled="isLoading"
            :rows="4"
          />

          <Input
            v-model="bookData.stock"
            label="Estoque"
            type="number"
            min="0"
            placeholder="0"
            :disabled="isLoading"
          />

          <Button
            style="width: 100%"
            @click="handleAddBook"
            variant="primary"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Adicionando...' : 'Adicionar Livro' }}
          </Button>
        </div>
      </div>
    </Card>
  </AppLayout>
</template>

<style scoped></style>
