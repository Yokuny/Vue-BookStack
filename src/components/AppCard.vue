<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>

    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--base);
  border-radius: 2rem;
  padding: 3rem;
  padding-top: 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .card {
    padding: 2rem 1rem;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.card-content {
  flex: 1;
}
</style>
