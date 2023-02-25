<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Create Team</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="teamName" label="Team Name"></v-text-field>
        <v-autocomplete
          v-model="selectedManagers"
          :disabled="loadingWorkers"
          :items="availableManagers"
          filled
          chips
          label="Team Leader(s)"
          color="blue-grey lighten-2"
          item-text="name"
          item-value="workerId"
          multiple
        >
          <template #selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click="data.select"
              @click:close="removeManager(data.item.workerId)"
            >
              <v-avatar left>
                <v-img :src="data.item.photo"></v-img>
              </v-avatar>
              {{ data.item.name }}
            </v-chip>
          </template>
          <template #item="data">
            <!-- Below statement is required for Vue syntax highlighting bug. Equivalent to "if data type if object"-->
            <template v-if="!!(typeof data.item !== 'object')">
              <v-list-item-content> {{ data.item }}</v-list-item-content>
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
        <v-autocomplete
          v-model="selectedMembers"
          :disabled="loadingWorkers"
          :items="availableMembers"
          filled
          chips
          label="Team Members"
          color="blue-grey lighten-2"
          item-text="name"
          item-value="workerId"
          multiple
        >
          <template #selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click="data.select"
              @click:close="removeMember(data.item.workerId)"
            >
              <v-avatar left>
                <v-img :src="data.item.photo"></v-img>
              </v-avatar>
              {{ data.item.name }}
            </v-chip>
          </template>
          <template #item="data">
            <!-- Below statement is required for Vue syntax highlighting bug. Equivalent to "if data type if object"-->
            <template v-if="!!(typeof data.item !== 'object')">
              <v-list-item-content> {{ data.item }}</v-list-item-content>
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
        <v-autocomplete
          v-model="selectedProjects"
          :disabled="loadingProjects"
          :items="availableProjects"
          filled
          label="Assigned Projects"
          color="blue-grey lighten-2"
          item-text="name"
          item-value="id"
          multiple
          chips
          deletable-chips
        >
          <template #item="data">
            {{ data.item.name }}
          </template>
        </v-autocomplete>
        <v-autocomplete
          v-model="selectedTimeOffCodes"
          :disabled="loadingTimeOffCodes"
          :items="availableTimeOffCodes"
          filled
          label="Time Off Codes"
          color="blue-grey lighten-2"
          item-text="name"
          item-value="id"
          multiple
        >
          <template #item="data">
            {{ data.item.name }}
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeWindow()">Close</v-btn>
        <v-btn color="blue darken-1" text @click="createTeam()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: Boolean
  },
  data() {
    return {
      loadingWorkers: true,
      loadingProjects: true,
      loadingTimeOffCodes: true,
      selectedMembers: [],
      selectedManagers: [],
      selectedProjects: [],
      selectedTimeOffCodes: [],
      availableMembers: [{ header: "Available Workers" }],
      availableManagers: [{ header: "Available Workers" }],
      availableProjects: [{ header: "Available Projects" }],
      availableTimeOffCodes: [{ header: "Available Time Off Codes" }],
      teamName: null
    };
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  watch: {
    show() {
      if (this.show) {
        // Each time you display CreateTeam,
        // retrieve all workers and projects
        this.retrieveWorkers();
        this.retrieveProjects();
        this.retrieveTimeOffCodes();
      }
    }
  },
  methods: {
    async retrieveProjects() {
      let response = await this.$axios.get("/project");
      response = response.data.map(project => ({
        id: project._id,
        name: project.name,
        managers: project.managerId
      }));
      this.availableProjects.push.apply(this.availableProjects, response);
      this.loadingProjects = false; // Projects loaded
    },
    async retrieveWorkers() {
      let response = await this.$axios.get("/worker");
      response = response.data.map(worker => ({
        workerId: worker.workerId,
        name: `${worker.name.firstName} ${worker.name.lastName}`,
        position: worker.position.job_title,
        photo: `_nuxt/${worker.photo ? worker.photo : "assets/empty.png"}`
      }));
      this.availableManagers.push.apply(this.availableManagers, response);
      this.availableMembers.push.apply(this.availableMembers, response);
      this.loadingWorkers = false; // Allow team members and managers to be selected on load
    },
    async retrieveTimeOffCodes() {
      this.loadingTimeOffCodes = false;
      return await true;
    },
    async createTeam() {
      if (
        !this.teamName ||
        this.selectedManagers.length === 0 ||
        this.selectedMembers.length === 0 ||
        this.selectedProjects.length === 0
      ) {
        return this.$emit(
          "showSnackbar",
          "Error. Please enter a team name and select at least one team manager and member"
        );
      }
      try {
        await this.$axios.post("/team", {
          name: this.teamName,
          managerId: this.selectedManagers,
          memberId: this.selectedMembers,
          projectId: this.selectedProjects,
          timeOffCodeId: this.selectedTimeOffCodes
        });
        this.$emit("showSnackbar", "Successfully created team");
        this.closeWindow();
      } catch (ex) {
        return this.$emit(
          "showSnackbar",
          "Error creating team. Please ensure the team name is unique and all values are valid"
        );
      }
    },
    closeWindow() {
      this.show = false;
    },
    // Need to use v-chip for workers as their chips contain avatars, projects can be handled on the directive
    removeManager(item) {
      const index = this.selectedManagers.indexOf(item);
      if (index >= 0) this.selectedManagers.splice(index, 1);
    },
    removeMember(item) {
      const index = this.selectedMembers.indexOf(item);
      if (index >= 0) this.selectedMembers.splice(index, 1);
    }
  }
};
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
