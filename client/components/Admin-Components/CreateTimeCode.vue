<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Create Time Code</span>
      </v-card-title>
      <v-card-text>
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
        <v-btn color="blue darken-1" text @click="closeWindow()">Close</v-btn>
        <v-btn color="blue darken-1" text @click="createTimeCode()">Save</v-btn>
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
      selectedProject: null,
      availableProjects: [{ header: 'Available Projects' }],
      timeCodeName: null,
      approver: null,
      billed: false,
      utilised: false,
      autoApprove: false,
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
        this.retrieveProjects()
      }
    },
  },
  methods: {
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

    async createTimeCode() {
      if (!this.timeCodeName || !this.selectedProject) {
        return this.$emit(
          'showSnackbar',
          'Error. Please enter a time code name and select a project'
        )
      }
      try {
        await this.$axios.post('/time_code', {
          timeCodeName: this.timeCodeName,
          projectId: this.selectedProject,
          autoApprove: this.autoApprove,
          approvalByTeamManager: this.approver === 'teamManager',
          approvalByProjectManager: this.approver === 'projectManager',
          utilised: this.utilised,
          billed: this.billed,
        })
        this.$emit('showSnackbar', 'Successfully created time code')
        this.closeWindow()
      } catch (ex) {
        return this.$emit(
          'showSnackbar',
          'Error creating time code. Please ensure the time code name is unique and a project is selected'
        )
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
