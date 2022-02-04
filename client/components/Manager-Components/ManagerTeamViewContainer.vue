<template>
  <div class="manager-team-view-container">
    <template>
      <span id="teams-i-manage">Teams I manage</span>
      <!-- Declare one row for each team that the user manages -->
      <v-row
        v-for="index in managedTeamCount"
        :key="index"
        cols="12"
        no-gutters
      >
        <div class="teamContainer">
          <v-card
            :key="managedTeams[index - 1]._id"
            class="teamCard"
            link
            nuxt
            :to="`/team/${managedTeams[index - 1]._id}`"
            min-width="10vw"
            min-height="10vh"
            elevation="14"
          >
            <v-card-title primary-title class="teamTitle">
              {{ managedTeams[index - 1].name }}
            </v-card-title>
          </v-card>

          <v-card
            v-for="worker in managedTeams[index - 1].memberId"
            :key="worker"
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            :to="`worker/${worker}`"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
        </div>
      </v-row>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    workerId: { type: String, default: null },
    managerView: { type: Boolean, default: false },
  },
  data() {
    return {
      managedTeams: [],
      managedTeamCount: 0,
    }
  },
  async created() {
    await this.retrieveManagedTeams()
  },
  methods: {
    async retrieveManagedTeams() {
      const response = await this.$axios.get(
        `/team/manager/${this.$auth.user.workerId}`
      )
      this.managedTeams = response.data
      this.managedTeamCount = this.managedTeams.length
    },
  },
}
</script>
<style scoped>
#teams-i-manage {
  text-align: left;
  align-items: flex-start;
}
.manager-team-view-container {
  display: flexbox;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
.teamContainer {
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  overflow-x: auto;
}
.teamCard {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
