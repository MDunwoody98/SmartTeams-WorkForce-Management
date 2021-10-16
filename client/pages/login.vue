<template>
  <div class="container">
    <div>
      <div class="form-container">
        <v-card class="elevation-12 login-card">
          <v-card-title color="#091C58" class="subtitle">Sign in</v-card-title>
          <v-form @submit.prevent="logIn()">
             <v-card-text>
              <v-card-actions class="form-group">
                <v-text-field v-model.number="login.workerId" prepend-icon="person" type="text" class="form-element" placeholder="Worker ID" color="#091C58"></v-text-field>
              </v-card-actions>
              <v-card-actions class="form-group">
                <v-text-field v-model="login.password" prepend-icon="lock" type="password" class="form-element" placeholder="Password" color="#091C58"></v-text-field>
              </v-card-actions>
              <v-card-actions class="form-group">
                <v-checkbox v-model="remember" label="Remember me" color="#091C58"></v-checkbox>
              </v-card-actions>
              <div class="forgot-password-container">
                <div class="forgot-password"  @click="toggleAlert()">Forgot your password?</div>
              </div>
                
              <v-btn type="submit" class="btnLogin" elevation="4" large block outlined nuxt color="#091C58">Sign In</v-btn><!--to="/dashboard ??-->
             </v-card-text>
          </v-form>
        </v-card>
        <v-snackbar  v-model="snackbar" :timeout="4000" color="#2D9FA0" rounded="pill">Please contact your administrator to perform a password reset</v-snackbar>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  layout: 'background_splash',
  data() {
    return {
      snackbar: false,
      remember: false,
      login: {
        workerId: "",
        password:""
      }
    }
  },
  methods: {
    async logIn() {
      try {
        const response = await this.$auth.loginWith('local', { data: this.login })
        console.log(response)
        this.$router.replace ("/"); // Redirect to dashboard if logged in
      } catch (err) {
        console.log(err)
        console.log(this.login)
      }
    },
    toggleAlert() {
      this.snackbar = !this.snackbar
    }
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

.subtitle {
  justify-content: center;
  padding: 20px;
  font-size: 2rem;
  color: #091C58;
}

.form-control:focus {
  border-color: #091C58;
  box-shadow: none;
}

.links {
  padding-top: 15px;
}

.login-card {
  padding: 25px;
}

.form-group {
  color: "#091C58";
}
.v-text-field {
  color: "#091C58";
}

.v-btn {
  padding: 250px
}

.forgot-password {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 1rem;
  color: #091C58;
  cursor: pointer;
}

.forgot-password-container {
  padding-bottom: 15px;
}
</style>
