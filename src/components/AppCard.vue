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
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
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
