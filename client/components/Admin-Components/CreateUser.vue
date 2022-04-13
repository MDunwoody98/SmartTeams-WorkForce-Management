<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Register New User</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="firstName" label="First Name"></v-text-field>
        <v-text-field v-model="lastName" label="Last Name"></v-text-field>
        <v-text-field
          v-model="password"
          type="password"
          label="Password"
        ></v-text-field>
        <v-text-field v-model="jobTitle" label="Job Title"></v-text-field>
        <v-text-field v-model="mobileNo" label="Mobile Number"></v-text-field>
        <v-text-field v-model="email" label="Email Address"></v-text-field>
        <v-card-title class="label-title">
          <span class="label-field">Is Admin?</span>
          <v-checkbox v-model="isAdmin"></v-checkbox>
        </v-card-title>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeWindow()">Close</v-btn>
        <v-btn color="blue darken-1" text @click="createWorker()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      firstName: null,
      lastName: null,
      jobTitle: null,
      password: null,
      mobileNo: null,
      email: null,
      isAdmin: false,
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  watch: {
    show() {
      if (this.show) {
        // Each time you display CreateProject, retrieve all valid workers
      } else this.snackbar = false // ensure datepicker is not active if parent componenet not displayed
    },
  },
  methods: {
    validatePassword(password) {
      const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
      // Regex for passwords to contain at least 8 chars, 1 lower case letter, 1 upper case letter, 1 number, and 1 symbol
      return re.test(password)
    },
    validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      // Regex for strings that match the format of an email address
      return re.test(String(email).toLowerCase())
    },
    async createWorker() {
      let createdUser = -1
      // Validate name
      if (!this.firstName || !this.lastName) {
        return this.$emit(
          'showSnackbar',
          'Error. Please enter a first and last name for the worker'
        )
      }
      // Validate job title and mobile number
      if (!this.jobTitle || !this.mobileNo) {
        return this.$emit(
          'showSnackbar',
          'Error. Please enter a job title and mobile number for the worker'
        )
      }
      // Validate Password
      if (!this.validatePassword(this.password)) {
        return this.$emit(
          'showSnackbar',
          'Error. Please ensure that the provided password is at least 8 characters long and contains at least 1 upper case letter, lower case letter, number, and symbol'
        )
      }
      // Validate email
      if (!this.validateEmail(this.email)) {
        return this.$emit(
          'showSnackbar',
          'Error. Please ensure that the provided email address is valid'
        )
      }
      // No separate validations for phone number field currently exists due to the different possible formats across various localities
      try {
        await this.$axios
          .post('/user', {
            password: this.password,
            isAdmin: this.isAdmin,
          })
          .then((response) => {
            if (response.data) {
              if (response.data !== '[]') {
                createdUser = response.data.user.workerId
              }
            }
          })
      } catch (ex) {
        return this.$emit('showSnackbar', 'Error creating user.')
      }
      // New user created, now create associated worker profile
      try {
        await this.$axios.post('/worker', {
          workerId: createdUser,
          name: {
            firstName: this.firstName,
            lastName: this.lastName,
          },
          contact: {
            phone: {
              phone_personal_mobile: this.mobileNo,
              phone_work: createdUser, // Temporary - this will be removed when next the schemas are dropped. Issue due to sparse indexes needs recreation to resolve
            },
            email: {
              email_personal: this.email,
              email_work: createdUser, // Temporary - this will be removed when next the schemas are dropped. Issue due to sparse indexes needs recreation to resolve
            },
          },
          position: {
            job_title: this.jobTitle,
          },
        })
        this.$emit('showSnackbar', `Successfully created worker ${createdUser}`)
        this.closeWindow()
      } catch (ex) {
        // User object created successfully but worker object not - should never happen
        return this.$emit('showSnackbar', 'Error creating worker.')
      }
    },
    closeWindow() {
      this.show = false
    },
  },
}
</script>
<style scoped>
template {
  position: absolute;
}
.label-title {
  padding: 0;
  font-size: 1.1rem;
}
</style>
