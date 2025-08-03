<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section footer-left">
        <slot name="left" />
      </div>

      <div class="footer-section footer-center">
        <slot name="center" />
      </div>

      <div class="footer-section footer-right">
        <slot name="right" />
      </div>
    </div>

    <div v-if="$slots.bottom" class="footer-bottom">
      <slot name="bottom" />
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--base);
  border-radius: 2rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 1rem 3rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-left {
  flex: 2;
  text-align: justify;
}

.footer-center {
  text-align: center;
  display: flex;
  align-items: end;
  flex: 1;
}

.footer-right {
  text-align: center;
  flex: 1;
}

.footer-bottom {
  border-top: 1px solid var(--color-border);
  padding: 1rem 2rem;
  text-align: center;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .footer-center {
    order: -1;
  }
}
</style>
