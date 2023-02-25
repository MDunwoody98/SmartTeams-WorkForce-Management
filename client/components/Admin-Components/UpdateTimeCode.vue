<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Update/Delete Time Code</span>
      </v-card-title>
      <v-card-text>
        <v-autocomplete v-model="selectedTimeCode" :disabled="loadingTimeCodes" :items="availableTimeCodes" filled
          label="Time Code" color="blue-grey lighten-2" item-text="name" item-value="id">
          <template v-slot:item="data">
            {{ data.item.name }}
          </template>
        </v-autocomplete>
        <v-text-field v-model="timeCodeName" label="Time Code Name"></v-text-field>
        <v-autocomplete v-model="selectedProject" :disabled="loadingProjects" :items="availableProjects" filled
          label="Project" color="blue-grey lighten-2" item-text="name" item-value="id">
          <template v-slot:item="data">
            {{ data.item.name }}
          </template>
        </v-autocomplete>
        <v-card-title class="label-title">
          <span class="label-field">Billed?</span>
          <v-checkbox v-model="billed"></v-checkbox>
        </v-card-title>
        <v-card-title class="label-title">
          <span class="label-field">Utilised?</span>
          <v-checkbox v-model="utilised"></v-checkbox>
        </v-card-title>
        <v-card-title class="label-title">
          <span class="label-field">Auto-approve?</span>
          <v-checkbox v-model="autoApprove"></v-checkbox>
        </v-card-title>
        <v-card-title class="label-title">
          <span>Approver</span>
        </v-card-title>
        <v-radio-group v-model="approver" :disabled="autoApprove" row mandatory>
          <v-radio label="Team Lead" value="teamManager"></v-radio>
          <v-radio label="Project Manager" value="projectManager"></v-radio>
        </v-radio-group>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="300">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="blue darken-1" :disabled="selectedTimeCode === null" text v-bind="attrs" v-on="on">
              Delete
            </v-btn>
          </template>
          <v-card>
            <v-card-title> </v-card-title>
            <v-card-text class="deletion-prompt">
              Are you sure you wish to delete this time code?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="deleteTimeCode()">
                Delete
              </v-btn>
              <v-btn color="green darken-1" text @click="dialog = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn color="blue darken-1" text @click="closeWindow()">Close</v-btn>
        <v-btn color="blue darken-1" text @click="updateTimeCode()">Save</v-btn>
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
      loadingProjects: true,
      selectedTimeCode: null,
      selectedProject: null,
      availableTimeCodes: [{ header: 'Available Time Codes' }],
      availableProjects: [{ header: 'Available Projects' }],
      timeCodeName: null,
      approver: null,
      billed: false,
      utilised: false,
      autoApprove: false,
      loadingTimeCodes: true,
      dialog: false,
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
        this.retrieveTimeCodes()
        this.retrieveProjects()
      }
    },
    selectedTimeCode() {
      this.timeCodeName = this.availableTimeCodes.find(
        (timeCode) => timeCode.id === this.selectedTimeCode
      )?.name
      this.selectedProject = this.availableTimeCodes.find(
        (timeCode) => timeCode.id === this.selectedTimeCode
      )?.projectId
      this.autoApprove = this.availableTimeCodes.find(
        (timeCode) => timeCode.id === this.selectedTimeCode
      )?.autoApprove
      this.utilised = this.availableTimeCodes.find(
        (timeCode) => timeCode.id === this.selectedTimeCode
      )?.utilised
      this.billed = this.availableTimeCodes.find(
        (timeCode) => timeCode.id === this.selectedTimeCode
      )?.billed
      this.approvalByTeamManager = this.availableTimeCodes.find(
        (timeCode) => timeCode.id === this.selectedTimeCode
      )?.approvalByTeamManager
      this.approvalByProjectManager = this.availableTimeCodes.find(
        (timeCode) => timeCode.id === this.selectedTimeCode
      )?.approvalByProjectManager
      this.approver = this.approvalByTeamManager
        ? 'teamManager'
        : 'projectManager'
    },
  },
  methods: {
    async retrieveTimeCodes() {
      let response = await this.$axios.get('/time_code')
      response = response.data.map((timeCode) => ({
        id: timeCode._id,
        name: timeCode.timeCodeName,
        projectId: timeCode.projectId,
        autoApprove: timeCode.autoApprove,
        approvalByTeamManager: timeCode.approvalByTeamManager,
        approvalByProjectManager: timeCode.approvalByProjectManager,
        utilised: timeCode.utilised,
        billed: timeCode.billed,
      }))
      this.availableTimeCodes.push.apply(this.availableTimeCodes, response)
      this.loadingTimeCodes = false // Time Codes loaded
    },
    async retrieveProjects() {
      let response = await this.$axios.get('/project')
      response = response.data.map((project) => ({
        id: project._id,
        name: project.name,
        managers: project.managerId,
      }))
      this.availableProjects.push.apply(this.availableProjects, response)
      this.loadingProjects = false // Projects loaded
    },

    async updateTimeCode() {
      if (!this.selectedTimeCode || !this.selectedProject) {
        return this.$emit(
          'showSnackbar',
          'Error. Please select a time code and project'
        )
      }
      try {
        await this.$axios.put(`/time_code/${this.selectedTimeCode}`, {
          timeCodeName: this.timeCodeName,
          projectId: this.selectedProject,
          autoApprove: this.autoApprove,
          approvalByTeamManager: this.approver === 'teamManager',
          approvalByProjectManager: this.approver === 'projectManager',
          utilised: this.utilised,
          billed: this.billed,
        })
        this.$emit('showSnackbar', 'Successfully updated time code')
        this.closeWindow()
      } catch (ex) {
        return this.$emit(
          'showSnackbar',
          'Error updating time code. Please ensure the time code name is unique and a project is selected'
        )
      }
    },
    async deleteTimeCode() {
      await this.$axios.delete(`/time_code/${this.selectedTimeCode}`)
      this.$emit('showSnackbar', 'Successfully deleted time code')
      this.closeWindow()
    },
    closeWindow() {
      Object.assign(this.$data, this.$options.data())
      this.show = false
    },
  },
}
</script>
<style scoped>
template {
  position: absolute;
}

.comments-box {
  width: 91%;
  margin: 0 auto;
}

.label-title {
  padding: 0;
  font-size: 1.1rem;
}

.label-field {
  width: 160px;
  text-align: left;
}
</style>
