<script setup lang="ts">
import Header from './AppHeader.vue'
import Footer from './AppFooter.vue'
import { Brand, Heading } from './index'
</script>

<template>
  <div class="app-layout">
    <Header>
      <template #logo>
        <Brand tag="p">Book Stack</Brand>
      </template>
      <template #actions>
        <slot name="actions" />
      </template>
    </Header>

    <main class="main-content">
      <slot />
    </main>

    <Footer>
      <template #left class="footer-left">
        <div class="footer-links">
          <Heading tag="h4" size="md" weight="semibold">BookStack</Heading>
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
          <a
            href="https://www.postman.com/xyokuny/workspace/yokuny/collection/27814387-3af35dd9-0dc9-4a75-9ca3-8d99dba21260?action=share&creator=27814387"
            class="footer-link"
            target="_blank"
            >API Postman</a
          >
          <a href="https://github.com/Yokuny/Vue-BookStack" class="footer-link" target="_blank"
            >GitHub Front-end</a
          >
          <a
            href="https://github.com/Yokuny/Express-BookStack"
            class="footer-link"
            target="_blank"
            >GitHub Back-end</a>
        </div>
      </template>
      <template #right class="footer-right">
        <div class="footer-links">
          <a href="#" class="footer-link">Swagger API</a>
          <a href="#" class="footer-link">Testes Coverage</a>
          <a href="#" class="footer-link">Tecnologias Utilizadas</a>
        </div>
      </template>
      <template #bottom>
        <p>&copy; 2024 BookStack. Todos os direitos reservados.</p>
      </template>
    </Footer>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
}

.footer-links {
  color: var(--vt-c-text-light-1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  text-decoration: none;
  font-size: 0.875rem;
}

.footer-link:hover {
  text-decoration: underline;
}
</style>
