<template>
  <div class="container">
    <div class="page">
      <Logo/>
      <div class="login">
        <v-btn class="btnLogin" elevation="4" large block outlined to="/login" nuxt color="#091C58">Log In</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // Do not redirect home page to login if user is not logged in
  auth: false,
  layout: 'background_splash',
  transition: {
    name: 'home',
    mode: 'out-in'
  }

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
}


.home-enter-active, .home-leave-active { 
  transition: opacity .25s; 
}
.home-enter, .home-leave-active { 
  opacity: 0; 
}
</style>
