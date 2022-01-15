<template>
  <div>
    <v-card class="elevation-12 login-card">
      <v-card-title color="#091C58" class="subtitle">Sign in</v-card-title>
      <v-form @submit.prevent="logIn()">
        <v-card-text>
          <v-card-actions class="form-group">
            <v-text-field
              v-model.number="login.workerId"
              prepend-icon="person"
              type="text"
              class="form-element"
              placeholder="Worker ID"
              color="#091C58"
            ></v-text-field>
          </v-card-actions>
          <v-card-actions class="form-group">
            <v-text-field
              v-model="login.password"
              prepend-icon="lock"
              type="password"
              class="form-element"
              placeholder="Password"
              color="#091C58"
            ></v-text-field>
          </v-card-actions>
          <v-card-actions class="form-group">
            <v-checkbox
              v-model="remember"
              label="Remember me"
              color="#091C58"
            ></v-checkbox>
          </v-card-actions>
          <div class="forgot-password-container">
            <div class="forgot-password" @click="forgotPassword()">
              Forgot your password?
            </div>
          </div>

          <v-btn
            type="submit"
            class="btnLogin"
            elevation="4"
            large
            block
            outlined
            nuxt
            color="#091C58"
            >Sign In</v-btn
          ><!--to="/dashboard ??-->
        </v-card-text>
      </v-form>
    </v-card>
    <v-snackbar
      v-model="snackbar"
      :timeout="4000"
      color="#2D9FA0"
      rounded="pill"
      >{{ text }}</v-snackbar
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      snackbar: false,
      remember: false,
      login: {
        workerId: '',
        password: '',
      },
    }
  },
  methods: {
    async logIn() {
      try {
        await this.$auth
          .loginWith('local', { data: this.login })
          .then((res) => {
            console.log(res)
            /* let user = res.data.worker // getting worker linked to user account
          this.$auth.$storage.setUniversal('user', user, true) // setting user in Vuex, cookies and localstorage
          user = this.$auth.$storage.getUniversal('user') // getting user (you can use it anywhere in your app)
          // this.$auth.setUser(user) */
            this.$auth.setUserToken(res.data.token, res.data.refresh_token)
            this.$auth.$storage.setUniversal(
              'isManager',
              this.parseJWT(res.data.token).isManager
            )
            this.$auth.$storage.setUniversal(
              'isAdmin',
              this.parseJWT(res.data.token).isAdmin
            )
          })
      } catch (err) {
        this.text = 'Error. Please try again or contact your administrator.'
        this.toggleAlert()
      }
    },
    forgotPassword() {
      this.text =
        'Please contact your administrator to perform a password reset'
      this.toggleAlert()
    },
    toggleAlert() {
      this.snackbar = !this.snackbar
    },
    parseJWT(token) {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join('')
      )
      return JSON.parse(jsonPayload)
    },
  },
}
</script>

<style>
.subtitle {
  justify-content: center;
  padding: 20px;
  font-size: 2rem;
  color: #091c58;
}

.form-control:focus {
  border-color: #091c58;
  box-shadow: none;
}

.login-card {
  padding: 25px;
  z-index: 800;
}

.form-group {
  color: '#091C58';
}
.v-text-field {
  color: '#091C58';
}

.forgot-password {
  font-size: 1rem;
  color: #091c58;
  cursor: pointer;
}

.forgot-password-container {
  padding-bottom: 15px;
}

.v-btn {
  margin-top: 2rem;
}

@media all and (min-width: 961px) and (min-height: 961px) {
  .login-card {
    min-width: 400px;
    min-height: 600px;
  }
  .subtitle {
    font-size: 2.2rem;
    margin-top: 15px;
  }
  .form-group {
    padding-top: 30px;
  }
  .form-element {
    font-size: 1.2rem;
  }
  .forgot-password {
    font-size: 1.5rem;
  }
}
@media all and (max-height: 730px) {
  .subtitle {
    font-size: 1.5rem;
    padding: 0px;
  }
  .form-group {
    padding-top: 0px;
  }
  .form-element {
    font-size: 0.8rem;
  }
  .login-card {
    padding: 5px;
  }
  .forgot-password-container {
    padding-bottom: 2px;
  }
  .v-btn {
    margin-top: 0rem;
  }
}
</style>
