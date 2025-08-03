<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Card,
  Button,
  AppLayout,
  Input,
  Textarea,
  ControlPanel,
  FavoriteButton,
  Loading,
  DisplayTitle,
  Heading,
  Text,
  Caption,
} from '../components'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useBookDetail } from '../composables/useBookDetail'
import { useToast } from '../composables/useToast'

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const toast = useToast()
const { book, fetchBookByIsbn } = useBookDetail()

const bookData = ref({
  name: '',
  description: '',
  author: '',
  stock: 0,
  isFavorite: false,
})

const isLoading = ref(false)
const isLoadingBook = ref(true)

const loadBookData = async () => {
  const isbn = route.params.isbn as string
  if (isbn) {
    isLoadingBook.value = true
    await fetchBookByIsbn(isbn)

    if (book.value) {
      bookData.value = {
        name: book.value.name,
        description: book.value.description || '',
        author: book.value.author,
        stock: book.value.stock,
        isFavorite: book.value.isFavorite || false,
      }
    }
    isLoadingBook.value = false
  }
}

const handleUpdateBook = async () => {
  if (!bookData.value.name || !bookData.value.author) {
    toast.showError('Por favor, preencha todos os campos obrigatórios')
    return
  }

  const isbn = route.params.isbn as string
  if (!isbn) {
    toast.showError('ISBN não encontrado')
    return
  }

  isLoading.value = true

  try {
    const res = await auth.makeAuthenticatedRequest(`/books/${isbn}`, 'PUT', bookData.value)

    if (res.success) {
      toast.showSuccess(res.message || 'Livro atualizado com sucesso!')

      setTimeout(() => {
        router.push(`/book/${isbn}`)
      }, 1500)
    } else {
      toast.showError(res.message || 'Erro ao atualizar livro')
    }
  } catch {
    toast.showError('Falha ao atualizar livro. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}

const handleBack = () => {
  const isbn = route.params.isbn as string
  router.push(`/book/${isbn}`)
}

onMounted(() => {
  loadBookData()
})
</script>

<template>
  <AppLayout>
    <template #actions>
      <Button @click="handleBack" variant="system">Voltar</Button>
    </template>

    <Card>
      <div class="form">
        <div class="form-group form-group-size">
          <DisplayTitle tag="h3" size="large">Editar Livro</DisplayTitle>

          <Loading v-if="isLoadingBook" message="Carregando dados do livro..." />

          <template v-else-if="book">
            <div class="isbn-field input-size">
              <div class="isbn-header">
                <Caption tag="label" variant="default">ISBN:</Caption>
                <Caption tag="p" variant="hint">O ISBN não pode ser alterado</Caption>
              </div>
              <input class="isbn-value" :value="book.isbn" disabled />
            </div>

            <Input
              v-model="bookData.name"
              label="Nome do Livro"
              type="text"
              placeholder="Digite o nome do livro"
              :disabled="isLoading"
              required
              class="input-size"
            />

            <Input
              v-model="bookData.author"
              label="Autor"
              type="text"
              placeholder="Digite o nome do autor"
              :disabled="isLoading"
              required
              class="input-size"
            />

            <Textarea
              v-model="bookData.description"
              label="Descrição"
              placeholder="Digite uma breve descrição do livro"
              :disabled="isLoading"
              :rows="4"
              class="input-size"
            />

            <Input
              v-model="bookData.stock"
              label="Estoque"
              type="number"
              min="0"
              placeholder="0"
              :disabled="isLoading"
              class="input-size"
            />

            <div class="input-group input-size">
              <ControlPanel>
                <FavoriteButton
                  :is-favorite="bookData.isFavorite"
                  :disabled="isLoading"
                  @toggle="bookData.isFavorite = !bookData.isFavorite"
                />
                <Caption tag="span" variant="hint">
                  {{ bookData.isFavorite ? 'Livro favoritado' : 'Livro não favoritado' }}
                </Caption>
              </ControlPanel>
            </div>

            <Button
              class="input-size"
              @click="handleUpdateBook"
              variant="primary"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Atualizando...' : 'Atualizar Livro' }}
            </Button>
          </template>

          <div v-else class="error-state">
            <Heading tag="h4" size="lg">Livro não encontrado</Heading>
            <Text tag="p" size="md">Não foi possível carregar os dados do livro para edição.</Text>
            <Button @click="() => router.push('/app')" variant="primary"> Voltar à Lista </Button>
          </div>
        </div>
      </div>
    </Card>
  </AppLayout>
</template>

<style scoped>
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
  max-width: 500px;
  width: 100%;
}

.input-size {
  width: 100%;
}

.isbn-field {
  margin-bottom: 1rem;
}

.isbn-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.isbn-value {
  padding: 0.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 0.375rem;
  width: 100%;
  background-color: var(--color-gray-50);
  cursor: not-allowed;
  color: var(--color-text-secondary);
}

.error-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
}


</style>
