# Vue-BookStack 🌟

> **Frontend Moderno para Gerenciamento de Livros**  
> Interface responsiva construída com Vue.js 3, TypeScript e Composition API

## 🎯 **Visão Geral**

Este projeto é um **desafio técnico** que demonstra maestria em:
- **Vue.js 3** - Framework reativo moderno
- **Composition API** - Paradigma funcional e reusabilidade
- **TypeScript** - Tipagem forte no frontend
- **Composables** - Lógica reutilizável e state management
- **Component Architecture** - Componentes modulares e escaláveis
- **Responsive Design** - Interface adaptável
- **Testing** - Testes unitários com Vitest

---

## 🧩 **Conceitos Vue.js Demonstrados**

### **1. v-model - Reatividade Bidirecional**
```vue
<!-- src/views/AcessView.vue -->
<template>
  <Input
    v-model="signinData.name"
    label="Nome"
    type="text"
    :disabled="auth.isLoading.value"
  />
</template>

<script setup lang="ts">
const signinData = ref({ name: '', password: '' })
</script>
```

**Por que v-model?**
- **Reatividade automática**: Mudanças no input atualizam o estado
- **Sintaxe simplificada**: Substitui `:value` + `@input`
- **Two-way binding**: Estado sincronizado com a interface

### **2. Event Handling com @**
```vue
<!-- src/views/AcessView.vue -->
<template>
  <Button @click="handleSignin" variant="primary">
    {{ auth.isLoading.value ? 'Entrando...' : 'Entrar' }}
  </Button>
  
  <Input 
    @keyup.enter="handleSignin"
    v-model="signinData.password"
  />
</template>

<script setup lang="ts">
const handleSignin = async () => {
  const success = await auth.signin(signinData.value)
  if (success) signinData.value = { name: '', password: '' }
}
</script>
```

**Por que usar @eventos?**
- **Declarativo**: Clara intenção de comportamento
- **Modificadores**: `.enter`, `.prevent`, `.stop` para casos específicos
- **Flexibilidade**: Pode executar expressões ou chamar métodos

### **3. Renderização Condicional (v-if)**
```vue
<!-- src/views/AppView.vue -->
<template>
  <!-- Estados mutuamente exclusivos -->
  <Loading v-if="booksLoading" message="Carregando livros..." />
  
  <div v-else-if="books.length === 0" class="no-books">
    <p>Nenhum livro encontrado</p>
    <Button @click="() => router.push('/add-book')">
      Adicionar Primeiro Livro
    </Button>
  </div>
  
  <div v-else class="books-list">
    <!-- Lista de livros -->
  </div>
</template>
```

**Por que v-if?** 
- **Performance**: Elementos não são renderizados quando falsos
- **Lazy**: Componentes condicionais só carregam quando necessários
- **Clean DOM**: Evita elementos desnecessários no DOM

### **4. Renderização de Listas (v-for)**
```vue
<!-- src/views/AppView.vue -->
<template>
  <!-- Paginação dinâmica -->
  <Button
    v-for="page in getVisiblePages()"
    :key="page"
    @click="goToPage(page)"
    :variant="page === pagination.currentPage ? 'primary' : 'outline'"
  >
    {{ page }}
  </Button>
</template>

<script setup lang="ts">
const getVisiblePages = () => {
  const current = pagination.value.currentPage
  const total = pagination.value.totalPages
  const delta = 2

  let start = Math.max(1, current - delta)
  let end = Math.min(total, current + delta)

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
}
</script>
```

**Por que v-for?**
- **Renderização dinâmica**: Lista se adapta aos dados
- **Reatividade**: Atualiza automaticamente quando dados mudam
- **Performance**: Vue otimiza re-renderização com `:key`

---

## 🏗️ **Arquitetura de Componentes**

### **Componentes Modulares**
```vue
<!-- src/views/AppView.vue -->
<template>
  <AppLayout>
    <template #actions>
      <Button @click="() => router.push('/add-book')">Adicionar Livro</Button>
      <Button @click="handleLogout">Sair</Button>
    </template>

    <Card>
      <BookList
        :books="books"
        @book-click="(book) => router.push(`/book/${book.isbn}`)"
        @toggle-favorite="handleToggleFavorite"
      />
    </Card>
  </AppLayout>
</template>
```

**Por que componentizar?**
- **Reutilização**: Componentes usados em múltiplas telas
- **Manutenibilidade**: Código organizado e fácil de manter
- **Testabilidade**: Cada componente pode ser testado isoladamente
- **Separação de responsabilidades**: Cada componente tem uma função específica

### **Template Slots - Flexibilidade**
```vue
<!-- src/components/AppLayout.vue -->
<template>
  <div class="app-layout">
    <AppHeader>
      <template #actions>
        <slot name="actions" />  <!-- 🔌 Slot nomeado -->
      </template>
    </AppHeader>
    
    <main class="main-content">
      <slot />  <!-- 🔌 Slot padrão -->
    </main>
  </div>
</template>
```

**Por que usar slots?**
- **Flexibilidade**: Permite customizar conteúdo sem modificar o componente
- **Composição**: Facilita criação de layouts complexos
- **Reusabilidade**: Mesmo layout com conteúdos diferentes

---

## 🔄 **Composables - Lógica Reutilizável**

### **useAuth.ts - Gerenciamento de Autenticação**
```typescript
// src/composables/useAuth.ts
export const useAuth = () => {
  const isLoading = ref(false)
  const toast = useToast()

  // 🔐 Login com credenciais
  const signin = async (data: SigninData): Promise<boolean> => {
    if (!data.name || !data.password) {
      toast.showError('Por favor, preencha todos os campos')
      return false
    }

    isLoading.value = true
    try {
      const res = await requestWithoutAuth('/auth/signin', fetchConfig(data, 'POST'))
      
      if (res.success && res.data?.accessToken) {
        accessToken.value = res.data.accessToken
        isAuthenticated.value = true
        currentUser.value = data.name
        return true
      }
    } finally {
      isLoading.value = false
    }
  }

  // 🔄 Renovação automática de token
  const refreshAccessToken = async (): Promise<boolean> => {
    const res = await requestWithoutAuth('/auth/refresh', fetchConfig({}, 'POST'))
    
    if (res.success && res.data?.accessToken) {
      accessToken.value = res.data.accessToken
      isAuthenticated.value = true
      return true
    }
    return false
  }

  // 🔗 Requisições autenticadas com retry
  const makeAuthenticatedRequest = async (path: string, method: Method = 'GET', body?: object) => {
    let res = await basicRequest(path, fetchConfig(body, method, accessToken.value))
    
    // 🔄 Auto-refresh em caso de token expirado
    if (res.success === false && res.message?.includes('401')) {
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        res = await basicRequest(path, fetchConfig(body, method, accessToken.value))
      } else {
        logout()
      }
    }
    
    return res
  }

  return {
    isAuthenticated,
    currentUser,
    signin,
    logout,
    makeAuthenticatedRequest,
  }
}
```

**Por que usar Composables?**
- **Reatividade**: Estado compartilhado entre componentes
- **Encapsulamento**: Lógica de negócio isolada
- **Testabilidade**: Fácil de testar isoladamente
- **Reutilização**: Lógica compartilhada sem duplicação

### **Estado Global Reativo**
```typescript
// Estado global compartilhado
const isAuthenticated = ref(false)
const currentUser = ref<string | null>(null)
const accessToken = ref<string | null>(null)

// Qualquer componente pode acessar
export const useAuth = () => {
  // ... lógica do composable
  
  return {
    isAuthenticated,  // ✅ Reativo globalmente
    currentUser,      // ✅ Reativo globalmente
    // ... métodos
  }
}
```

---

## 📱 **Interface Responsiva**

### **Design Adaptável**
```vue
<style scoped>
.search-container {
  display: flex;
  gap: 1rem;
  align-items: baseline;
  max-width: 800px;
}

@media (max-width: 768px) {
  .search-container {
    gap: 0.5rem;
    align-items: start;
  }
  
  .clear-text,
  .search-text {
    display: none;  /* Apenas ícones em mobile */
  }
}
</style>
```

### **Componentes Flexíveis**
```vue
<!-- src/views/AppView.vue -->
<template>
  <div class="search-container">
    <Input v-model="searchTerm" placeholder="Buscar livros..." />
    
    <Button @click="clearSearch" variant="outline" class="clear-button">
      <span class="clear-text">Limpar</span>
      <CleaningIcon class="clear-icon" :size="20" />
    </Button>
  </div>
</template>
```

---

## 🧪 **Estratégia de Testes**

### **Testes de Componentes**
```typescript
// src/tests/components/AppButton.test.ts
import { mount } from '@vue/test-utils'
import AppButton from '@/components/AppButton.vue'

describe('AppButton', () => {
  it('deve emitir evento click quando clicado', async () => {
    const wrapper = mount(AppButton, {
      props: { variant: 'primary' },
      slots: { default: 'Click me' }
    })

    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.text()).toBe('Click me')
  })
})
```

### **Testes de Composables**
```typescript
// src/tests/composables/useAuth.test.ts
describe('useAuth', () => {
  it('deve autenticar usuário com credenciais válidas', async () => {
    const { signin, isAuthenticated } = useAuth()
    
    // Mock da API
    vi.mocked(requestWithoutAuth).mockResolvedValue({
      success: true,
      data: { accessToken: 'token123' }
    })

    const result = await signin({ name: 'user', password: 'pass' })
    
    expect(result).toBe(true)
    expect(isAuthenticated.value).toBe(true)
  })
})
```

---

## 🚀 **Funcionalidades do Sistema**

### **🔐 Autenticação**
- Login com usuário/senha
- Criação de conta de visitante
- Renovação automática de tokens
- Logout seguro

### **📚 Gerenciamento de Livros**
- Listagem com paginação
- Busca por nome, autor, ISBN
- Filtro de favoritos
- Adicionar/editar/remover livros
- Toggle de favoritos

### **🎨 Interface**
- Design responsivo
- Componentes reutilizáveis
- Estados de loading
- Notificações toast
- Navegação intuitiva

---

## 🐳 **Deploy e Execução**

### **Desenvolvimento**
```bash
# 🛠️ Modo desenvolvimento
./start.sh dev

# Serviços:
# Frontend: http://localhost:5173
# Backend:  http://localhost:8080
```

### **Docker Simplificado**
```dockerfile
# Vue-BookStack/Dockerfile
FROM node:20-alpine

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile
COPY . .

EXPOSE 5173

CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "5173"]
```

**Por que desenvolvimento em container?**
- **Consistência**: Mesmo ambiente para toda a equipe
- **Isolamento**: Não conflita com outras versões do Node
- **Produção-like**: Ambiente similar ao deploy final

---

## 🎯 **Principais Tecnologias**

- **🌟 Vue.js 3** - Framework reativo
- **🔷 TypeScript** - Tipagem estática
- **⚡ Vite** - Build tool ultrarrápido
- **🧪 Vitest** - Framework de testes
- **🎨 CSS Custom Properties** - Variáveis CSS nativas
- **📱 Responsive Design** - Mobile-first
- **🔄 Composition API** - Lógica reativa moderna

---

Este frontend demonstra **domínio técnico** em Vue.js moderno, arquitetura de componentes, gestão de estado reativo e experiência do usuário, características essenciais para aplicações frontend robustas. 🌟

