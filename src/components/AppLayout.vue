<script setup lang="ts">
import Header from './AppHeader.vue'
import Footer from './AppFooter.vue'
</script>

<template>
  <div class="app-layout">
    <Header>
      <template #logo>
        <p class="logo">Book Stack</p>
      </template>
      <template #navigation>
        <slot name="navigation" />
      </template>
      <template #actions>
        <slot name="actions" />
      </template>
    </Header>

    <main>
      <slot />
    </main>

    <Footer>
      <template #left class="footer-left">
        <div class="footer-links">
          <h4>BookStack</h4>
          <p>
            Transforme a gestão de livros com BookStack, o aplicativo que encanta leitores e
            organiza coleções com magia! Catalogação intuitiva, busca instantânea e resumos
            personalizados trazem ordem ao caos. Perfeito para leitores, livrarias ou colecionadores
            apaixonados.
          </p>
        </div>
      </template>
      <template #center class="footer-center">
        <div class="footer-links">
          <a href="#" class="footer-link">API Postman</a>
          <a href="#" class="footer-link">API Swagger</a>
          <a href="#" class="footer-link">Repositório GitHub</a>
        </div>
      </template>
      <template #right class="footer-right">
        <div class="footer-links">
          <a href="#" class="footer-link">Testes Coverage</a>
          <a href="#" class="footer-link">Testes Unitários</a>
          <a href="#" class="footer-link">Testes E2E</a>
        </div>
      </template>
      <template #bottom>
        <p>&copy; 2024 BookStack. Todos os direitos reservados.</p>
      </template>
    </Footer>
  </div>
</template>

<style scoped>
.logo {
  color: var(--vt-c-text-light-2);
  font-family: 'Luckiest Guy', cursive;
  font-weight: 400;
  font-style: normal;
  font-size: 2rem;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.footer-links {
  color: var(--vt-c-text-light-1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-links h4 {
  font-weight: 600;
}

.footer-link {
  text-decoration: none;
  font-size: 0.875rem;
}

.footer-link:hover {
  text-decoration: underline;
}
</style>
