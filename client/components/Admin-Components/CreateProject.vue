<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Create Project</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="projectName" label="Project Name"></v-text-field>
        <v-autocomplete v-model="selectedWorkers" :disabled="loading" :items="availableWorkers" filled chips
          label="Project Manager" color="blue-grey lighten-2" item-text="name" item-value="workerId" multiple>
          <template v-slot:selection="data">
            <v-chip v-bind="data.attrs" :input-value="data.selected" close @click="data.select"
              @click:close="remove(data.item.workerId)">
              <v-avatar left>
                <v-img :src="data.item.photo"></v-img>
              </v-avatar>
              {{ data.item.name }}
            </v-chip>
          </template>
          <template v-slot:item="data">
            <!-- Below statement is required for Vue syntax highlighting bug. Equivalent to "if data type if object"-->
            <template v-if="!!(typeof data.item !== 'object')">
              <v-list-item-content v-text="data.item"></v-list-item-content>
            </template>
            <template v-else>
              <v-list-item-avatar>
                <v-img :src="data.item.photo" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title> {{ data.item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ data.item.position }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeWindow()">Close</v-btn>
        <v-btn color="blue darken-1" text @click="createProject()">Save</v-btn>
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
      selectedWorkers: [],
      availableWorkers: [{ header: 'Available Workers' }],
      projectName: null,
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
        this.retrieveWorkers()
      } else this.snackbar = false // ensure datepicker is not active if parent componenet not displayed
    },
  },
  methods: {
    async retrieveWorkers() {
      let response = await this.$axios.get('/worker')
      response = response.data.map((worker) => ({
        workerId: worker.workerId,
        name: `${worker.name.firstName} ${worker.name.lastName}`,
        position: worker.position.job_title,
        photo: `_nuxt/${worker.photo ? worker.photo : 'assets/empty.png'}`,
      }))
      this.availableWorkers.push.apply(this.availableWorkers, response)
      this.loading = false // Allow manager to be selected on load
    },
    async createProject() {
      if (!this.projectName || this.selectedWorkers.length === 0) {
        return this.$emit(
          'showSnackbar',
          'Error. Please enter a project name and select at least one project manager'
        )
      }
      try {
        await this.$axios.post('/project', {
          name: this.projectName,
          managerId: this.selectedWorkers,
        })
        this.$emit('showSnackbar', 'Successfully created project')
        this.closeWindow()
      } catch (ex) {
        return this.$emit(
          'showSnackbar',
          'Error creating project. Please ensure the project name is unique'
        )
      }
    },
    closeWindow() {
      this.show = false
    },
    remove(item) {
      const index = this.selectedWorkers.indexOf(item)
      if (index >= 0) this.selectedWorkers.splice(index, 1)
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
</style>
