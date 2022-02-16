<template>
  <div class="home-page">
    <section class="home-header">
      <Navbar />
    </section>
    <div class="main">
      <Nuxt />
    </div>
    <section class="home-footer" />
  </div>
</template>

<style scoped>
.home-header,
.home-footer {
  width: 100%;
  position: fixed;
  color: #ffff;
  z-index: 80;
}
.home-header {
  top: 0;
}
.home-footer {
  bottom: 0;
  background: var(--color-secondary);
  position: fixed;
  padding: 10px 0;
}
@media all and (min-width: 961px) {
  .main {
    margin-left: 210px;
  }
}
@media all and (max-width: 960px) {
  .main {
    margin-left: 56px;
  }
}
</style>
