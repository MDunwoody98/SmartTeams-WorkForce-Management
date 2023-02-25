<template>
  <div class="container">
    <div class="page">
      <Logo />
      <div class="login">
        <v-btn class="btnLogin" elevation="4" large block outlined to="/login" nuxt color="var(color-primary)">Sign
          In</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // Do not redirect home page to login if user is not logged in
  auth: false,
  layout: 'background_splash',
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated // it check if user isAuthenticated
    },
  },
  beforeMount() {
    this.redirect() // Execute redirect before loading page
  },
  methods: {
    redirect() {
      if (this.isAuthenticated) this.$router.replace('dashboard') // Redirect to user dashboard if user has logged in
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.login {
  padding-top: 15px;
  max-width: 400px;
  margin: 0 auto;
  z-index: 9;
  position: relative;
}
</style>
