<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Update/Delete User</span>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="selectedUser"
          :disabled="loading"
          :items="availableWorkers"
          filled
          chips
          label="Worker"
          color="blue-grey lighten-2"
          item-text="name"
          item-value="workerId"
        >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click="data.select"
              @click:close="remove()"
            >
              <v-avatar left>
                <v-img :src="data.item.photo"></v-img>
              </v-avatar>
              {{ data.item.firstName }}
              {{ data.item.lastName }}
            </v-chip>
          </template>
          <template v-slot:item="data">
            <!-- Below statement is required for Vue syntax highlighting bug. Equivalent to "if data type is object"-->
            <template v-if="!!(typeof data.item !== 'object')">
              <v-list-item-content v-text="data.item"></v-list-item-content>
            </template>
            <template v-else>
              <v-list-item-avatar>
                <v-img :src="data.item.photo" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ data.item.firstName }}
                  {{ data.item.lastName }}</v-list-item-title
                >
                <v-list-item-subtitle
                  >{{ data.item.position }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
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
        <v-dialog v-model="dialog" max-width="300">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="blue darken-1"
              :disabled="selectedUser === null"
              text
              v-bind="attrs"
              v-on="on"
            >
              Delete
            </v-btn>
          </template>
          <v-card>
            <v-card-title> </v-card-title>
            <v-card-text class="deletion-prompt">
              Are you sure you wish to delete this user?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="deleteUser()">
                Delete
              </v-btn>
              <v-btn color="green darken-1" text @click="dialog = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn color="blue darken-1" text @click="closeWindow()">Close</v-btn>
        <v-btn
          color="blue darken-1"
          text
          :disabled="!selectedUser"
          @click="updateWorker()"
          >Save</v-btn
        >
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
      loading: true,
      selectedUser: null,
      availableWorkers: [{ header: 'Workers' }],
      linkedUserObjects: [],
      dialog: false,
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
        // Each time you display EditUser, retrieve all valid workers
        this.retrieveWorkers()
      } else this.snackbar = false // ensure datepicker is not active if parent componenet not displayed
    },
    selectedUser() {
      this.firstName = this.availableWorkers.find(
        (worker) => worker.workerId === this.selectedUser
      )?.firstName
      this.lastName = this.availableWorkers.find(
        (worker) => worker.workerId === this.selectedUser
      )?.lastName
      this.jobTitle = this.availableWorkers.find(
        (worker) => worker.workerId === this.selectedUser
      )?.position
      this.mobileNo = this.availableWorkers.find(
        (worker) => worker.workerId === this.selectedUser
      )?.mobile
      this.email = this.availableWorkers.find(
        (worker) => worker.workerId === this.selectedUser
      )?.email
      this.password = this.linkedUserObjects.find(
        (user) => user.workerId === this.selectedUser
      )?.password
      this.isAdmin = this.linkedUserObjects.find(
        (user) => user.workerId === this.selectedUser
      )?.isAdmin
    },
  },
  methods: {
    async retrieveWorkers() {
      let response = await this.$axios.get('/worker')
      response = response.data.map((worker) => ({
        workerId: worker.workerId,
        firstName: worker.name.firstName,
        lastName: worker.name.lastName,
        position: worker.position.job_title,
        mobile: worker.contact.phone.phone_personal_mobile,
        email: worker.contact.email.email_personal,
        photo: `_nuxt/${worker.photo ? worker.photo : 'assets/empty.png'}`,
      }))
      this.availableWorkers.push.apply(this.availableWorkers, response)
      response = await this.$axios.get('/user')
      response = response.data.map((user) => ({
        workerId: user.workerId,
        password: null,
        isAdmin: user.isAdmin,
      }))
      this.linkedUserObjects.push.apply(this.linkedUserObjects, response)
      this.loading = false
    },
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
    async updateWorker() {
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
      if (!this.validatePassword(this.password) && this.password) {
        return this.$emit(
          'showSnackbar',
          "Error. Please ensure that, if updating a user's password, the provided password is at least 8 characters long and contains at least 1 upper case letter, lower case letter, number, and symbol"
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
      // PUT user - always include admin flag, only include password field if not null
      let userObj = { isAdmin: this.isAdmin }
      if (this.password) {
        userObj = { ...userObj, password: this.password }
      }
      try {
        await this.$axios.put(`/user/${this.selectedUser}`, userObj)
      } catch (ex) {
        return this.$emit('showSnackbar', 'Error updating user.')
      }
      // Updated user before updating worker
      try {
        this.$axios.put(`/worker/${this.selectedUser}`, {
          workerId: this.selectedUser,
          name: {
            firstName: this.firstName,
            lastName: this.lastName,
          },
          contact: {
            phone: {
              phone_personal_mobile: this.mobileNo,
              phone_work: this.selectedUser, // Temporary - this will be removed when next the schemas are dropped. Issue due to sparse indexes needs recreation to resolve
            },
            email: {
              email_personal: this.email,
              email_work: this.selectedUser, // Temporary - this will be removed when next the schemas are dropped. Issue due to sparse indexes needs recreation to resolve
            },
          },
          position: {
            job_title: this.jobTitle,
          },
        })
        this.$emit(
          'showSnackbar',
          `Successfully updated worker ${this.selectedUser}`
        )
        this.closeWindow()
      } catch (ex) {
        return this.$emit('showSnackbar', 'Error updating worker.')
      }
    },
    async deleteUser() {
      await this.$axios.delete(`/user/${this.selectedUser}`)
      await this.$axios.delete(`/worker/${this.selectedUser}`)
      this.$emit(
        'showSnackbar',
        `Successfully deleted user account and worker profile ${this.selectedUser}`
      )
      this.closeWindow()
    },
    remove() {
      this.selectedUser = null
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
.deletion-prompt {
  font-size: 1.2rem;
}
</style>
