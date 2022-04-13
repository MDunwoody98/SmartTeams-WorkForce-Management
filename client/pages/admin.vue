<template>
  <div class="container">
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-card @click="createUser = true">
            <v-card-subtitle>Register New User</v-card-subtitle>
          </v-card>
          <v-card @click="updateUser = true">
            <v-card-subtitle>Update/Delete User</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card @click="updateFTE = true">
            <v-card-subtitle>Update Company FTE</v-card-subtitle>
          </v-card>
          <v-card @click="updateAnnualLeave = true">
            <v-card-subtitle>Update Organization Annual Leave</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card @click="createTeam = true">
            <v-card-subtitle>Create Team</v-card-subtitle>
          </v-card>
          <v-card @click="updateTeam = true">
            <v-card-subtitle>Update/Delete Team</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card @click="createProject = true">
            <v-card-subtitle>Create Project</v-card-subtitle>
          </v-card>
          <v-card @click="updateProject = true">
            <v-card-subtitle>Update/Delete Project</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card @click="createTimeCode = true">
            <v-card-subtitle>Create Time Code</v-card-subtitle>
          </v-card>
          <v-card @click="updateTimeCode = true">
            <v-card-subtitle>Update/Delete Time Code</v-card-subtitle>
          </v-card>
          <v-card @click="createTimeOffCode = true">
            <v-card-subtitle>Create Time Off Code</v-card-subtitle>
          </v-card>
          <v-card @click="updateTimeOffCode = true">
            <v-card-subtitle>Update/Delete Time Off Code</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar
        v-model="snackbar"
        :timeout="4000"
        color="var(--color-secondary)"
        rounded="pill"
        >{{ snackbarText }}</v-snackbar
      >
    </v-container>
    <div data-app>
      <CreateProject v-model="createProject" @showSnackbar="showSnackbar" />
      <UpdateProject v-model="updateProject" @showSnackbar="showSnackbar" />
      <CreateTeam v-model="createTeam" @showSnackbar="showSnackbar" />
      <UpdateTeam v-model="updateTeam" @showSnackbar="showSnackbar" />
      <CreateTimeCode v-model="createTimeCode" @showSnackbar="showSnackbar" />
      <CreateTimeOffCode
        v-model="createTimeOffCode"
        @showSnackbar="showSnackbar"
      />
      <UpdateTimeCode v-model="updateTimeCode" @showSnackbar="showSnackbar" />
      <UpdateTimeOffCode
        v-model="updateTimeOffCode"
        @showSnackbar="showSnackbar"
      />
      <UpdateFTE v-model="updateFTE" @showSnackbar="showSnackbar" />
      <UpdateAnnualLeavePolicy
        v-model="updateAnnualLeave"
        @showSnackbar="showSnackbar"
      />
      <CreateUser v-model="createUser" @showSnackbar="showSnackbar" />
      <EditUser v-model="updateUser" @showSnackbar="showSnackbar" />
    </div>
  </div>
</template>
<script>
export default {
  middleware: 'validate-admin',
  layout: 'background_home',
  data() {
    return {
      createUser: false,
      updateUser: false,
      updateFTE: false,
      updateAnnualLeave: false,
      createTeam: false,
      updateTeam: false,
      createProject: false,
      updateProject: false,
      createTimeCode: false,
      updateTimeCode: false,
      createTimeOffCode: false,
      updateTimeOffCode: false,
      snackbar: false,
      snackbarText: null,
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
  },
  methods: {
    showSnackbar(text) {
      this.snackbarText = text
      this.snackbar = !this.snackbar
    },
  },
}
</script>
<style scoped>
.container {
  margin: 0 auto;
  margin-top: 30px;
  max-height: 100vh;
  min-height: 0;
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
