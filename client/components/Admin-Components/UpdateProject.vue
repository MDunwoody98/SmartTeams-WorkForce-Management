<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Update Project</span>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="selectedProject"
          :disabled="loading"
          :items="availableProjects"
          filled
          label="Project"
          color="blue-grey lighten-2"
          item-text="name"
          item-value="id"
        >
          <template v-slot:item="data">
            {{ data.item.name }}
          </template>
        </v-autocomplete>
        <v-text-field
          v-model="selectedProjectName"
          label="Updated Name"
        ></v-text-field>
        <v-autocomplete
          v-model="selectedWorkers"
          :disabled="loading"
          :items="availableWorkers"
          filled
          chips
          label="Project Manager"
          color="blue-grey lighten-2"
          item-text="name"
          item-value="workerId"
          multiple
        >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click="data.select"
              @click:close="remove(data.item.workerId)"
            >
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
                <v-list-item-subtitle
                  >{{ data.item.position }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="300">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="blue darken-1"
              :disabled="selectedProject === null"
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
              Are you sure you wish to delete this project?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="deleteProject()">
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
          :disabled="!selectedProject || selectedWorkers.length === 0"
          @click="updateProject()"
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
    // Load projects and then set loading to false
    // Select project
    // Once selected, selectedProject is now set
    // If selectedProject is set, populate selectedWorkers with current managers of org
    // If selectedProject is set, enable the 'delete' button to delete the project
    // Also enable the save button. Save should be disabled if selected workers array is empty
    return {
      loading: true,
      selectedProject: null,
      selectedProjectName: null,
      selectedWorkers: [],
      availableProjects: [{ header: 'Available Projects' }],
      availableWorkers: [{ header: 'Available Workers' }],
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
        // Each time you display UpdateProject, retrieve all valid projects
        this.retrieveProjects()
        this.retrieveWorkers()
      }
    },
    selectedProject() {
      this.selectedWorkers = this.availableProjects.find(
        (project) => project.id === this.selectedProject
      )?.managers
      this.selectedProjectName = this.availableProjects.find(
        (project) => project.id === this.selectedProject
      )?.name
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
      this.loading = false // Allow deletion and manager selection to be performed on load
    },
    async retrieveWorkers() {
      let response = await this.$axios.get('/worker')
      response = response.data.map((worker) => ({
        workerId: worker.workerId,
        name: `${worker.name.firstName} ${worker.name.lastName}`,
        position: worker.position.job_title,
        photo: `_nuxt/${worker.photo ? worker.photo : 'assets/empty.png'}`,
      }))
      this.availableWorkers.push.apply(this.availableWorkers, response)
    },
    async updateProject() {
      if (!this.selectedProject || this.selectedWorkers.length === 0) {
        return this.$emit(
          'showSnackbar',
          'Error. Please enter a project name and select at least one project manager'
        )
      }
      try {
        await this.$axios.put(`/project/${this.selectedProject}`, {
          name: this.selectedProjectName,
          managerId: this.selectedWorkers,
        })
        this.$emit('showSnackbar', 'Successfully updated project')
        this.closeWindow()
      } catch (ex) {
        return this.$emit(
          'showSnackbar',
          'Error updating project. Please ensure the values provided are valid'
        )
      }
    },
    async deleteProject() {
      await this.$axios.delete(`/project/${this.selectedProject}`)
      this.$emit('showSnackbar', 'Successfully deleted project')
      this.closeWindow()
    },
    closeWindow() {
      Object.assign(this.$data, this.$options.data())
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
.deletion-prompt {
  font-size: 1.2rem;
}
</style>
