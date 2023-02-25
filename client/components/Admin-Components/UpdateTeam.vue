<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Update/Delete Team</span>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="selectedTeam"
          :disabled="loadingTeams"
          :items="availableTeams"
          filled
          label="Select Team"
          color="blue-grey lighten-2"
          item-text="name"
          item-value="id"
        >
          <template v-slot:item="data">
            {{ data.item.name }}
          </template>
        </v-autocomplete>
        <v-text-field v-model="teamName" label="New Name"></v-text-field>
        <v-autocomplete
          v-model="selectedManagers"
          :disabled="!selectedTeam || loadingWorkers"
          :items="availableManagers"
          filled
          chips
          label="Team Leader(s)"
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
              @click:close="removeManager(data.item.workerId)"
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
              <v-list-item-content>{{ data.item }}</v-list-item-content>
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
          :disabled="!selectedTeam || loadingWorkers"
          :items="availableMembers"
          filled
          chips
          label="Team Members"
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
              @click:close="removeMember(data.item.workerId)"
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
          :disabled="!selectedTeam || loadingProjects"
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
          <template v-slot:item="data">
            {{ data.item.name }}
          </template>
        </v-autocomplete>
        <v-autocomplete
          v-model="selectedTimeOffCodes"
          :disabled="!selectedTeam || loadingTimeOffCodes"
          :items="availableTimeOffCodes"
          filled
          label="Time Off Codes"
          color="blue-grey lighten-2"
          item-text="name"
          item-value="id"
          multiple
          chips
          deletable-chips
        >
          <template v-slot:item="data">
            {{ data.item.name }}
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="300">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="blue darken-1"
              :disabled="selectedTeam === null"
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
              Are you sure you wish to delete this team?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="deleteTeam()">
                Delete
              </v-btn>
              <v-btn color="green darken-1" text @click="dialog = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn color="blue darken-1" text @click="closeWindow()">Close</v-btn>
        <v-btn color="blue darken-1" text @click="updateTeam()">Save</v-btn>
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
      loadingTeams: true,
      selectedTeam: null,
      selectedMembers: [],
      selectedManagers: [],
      selectedProjects: [],
      selectedTimeOffCodes: [],
      availableTeams: [],
      availableMembers: [{ header: "Available Workers" }],
      availableManagers: [{ header: "Available Workers" }],
      availableProjects: [{ header: "Available Projects" }],
      availableTimeOffCodes: [{ header: "Available Time Off Codes" }],
      teamName: null,
      dialog: false
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
        // Each time you display UpdateTeam,
        // retrieve all teams,
        // time off codes, workers and projects
        this.retrieveTeams();
        this.retrieveWorkers();
        this.retrieveProjects();
        this.retrieveTimeOffCodes();
      }
    },
    selectedTeam() {
      this.teamName = this.availableTeams.find(
        team => team.id === this.selectedTeam
      )?.name;
      this.selectedMembers = this.availableTeams.find(
        team => team.id === this.selectedTeam
      )?.members;
      this.selectedManagers = this.availableTeams.find(
        team => team.id === this.selectedTeam
      )?.managers;
      this.selectedProjects = this.availableTeams.find(
        team => team.id === this.selectedTeam
      )?.projects;
      this.selectedTimeOffCodes = this.availableTeams.find(
        team => team.id === this.selectedTeam
      )?.timeOffCodes;
    }
  },
  methods: {
    async retrieveTeams() {
      let response = await this.$axios.get("/team");
      response = response.data.map(team => ({
        id: team._id,
        name: team.name,
        managers: team.managerId,
        members: team.memberId,
        projects: team.projectId,
        timeOffCodes: team.timeOffCodeId
      }));
      this.availableTeams.push.apply(this.availableTeams, response);
      this.loadingTeams = false;
    },
    async retrieveProjects() {
      let response = await this.$axios.get("/project");
      response = response.data.map(project => ({
        id: project._id,
        name: project.name,
        managers: project.managerId
      }));
      this.availableProjects.push.apply(this.availableProjects, response);
      this.loadingProjects = false;
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
      let response = await this.$axios.get("/time_off_code");
      response = response.data.map(timeOffCode => ({
        id: timeOffCode._id,
        name: timeOffCode.timeOffCodeName
      }));
      this.availableTimeOffCodes.push.apply(
        this.availableTimeOffCodes,
        response
      );
      this.loadingTimeOffCodes = false;
    },
    async updateTeam() {
      if (
        !this.selectedTeam ||
        this.selectedManagers.length === 0 ||
        this.selectedMembers.length === 0 ||
        this.selectedProjects.length === 0
      ) {
        return this.$emit(
          "showSnackbar",
          "Error. Please select a team and at least one team manager, member and project"
        );
      }
      try {
        await this.$axios.put(`/team/${this.selectedTeam}`, {
          name: this.teamName,
          managerId: this.selectedManagers,
          memberId: this.selectedMembers,
          projectId: this.selectedProjects,
          timeOffCodeId: this.selectedTimeOffCodes
        });
        this.$emit("showSnackbar", "Successfully updated team");
        this.closeWindow();
      } catch (ex) {
        return this.$emit(
          "showSnackbar",
          "Error updating team. Please ensure the team name is unique and all values are valid"
        );
      }
    },
    async deleteTeam() {
      await this.$axios.delete(`/team/${this.selectedTeam}`);
      this.$emit("showSnackbar", "Successfully deleted team");
      this.closeWindow();
    },
    closeWindow() {
      Object.assign(this.$data, this.$options.data());
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
