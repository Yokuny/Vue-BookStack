<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <slot name="logo" />
        <slot name="title" />
      </div>

      <div class="header-center">
        <slot name="navigation" />
      </div>

      <div class="header-right">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--base);
  border-radius: 2rem;
  padding: 1rem 3rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px var(--shadow-md);
  border: 1px solid var(--color-border);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  flex: 1;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
