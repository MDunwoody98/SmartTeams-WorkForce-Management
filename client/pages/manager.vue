<template>
  <div class="container">
    <v-container>
      <span>Teams I manage</span>
      <!-- 
            For each team I manage, display a horizontal container containing a team card that I can click to expand, and individual worker cards for each team member
            Click on worker card to navigate to page for that worker - dayView & charts. DayView contains all Submitted entries
            Click on team card to navigate to page for that team - tabulated view for analytics
          -->
      <v-row cols="12" no-gutters>
        <div class="teamContainer">
          <v-card
            class="teamCard"
            link
            nuxt
            to="/team/1248035081"
            min-width="10vw"
            min-height="10vh"
            elevation="14"
          >
            <v-card-title primary-title class="teamTitle">
              Team Name
            </v-card-title>
          </v-card>

          <v-card
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            to="worker/12343"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
          <v-card
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            to="worker/12342"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
          <v-card
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            to="worker/12342"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
          <v-card
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            to="worker/12342"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
          <v-card
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            to="worker/12342"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
          <v-card
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            to="worker/12342"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
          <v-card
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            to="worker/12342"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
          <v-card
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            to="worker/12342"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
          <v-card
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            to="worker/12342"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
          <v-card
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            to="worker/12342"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
          <v-card
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            to="worker/12342"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
          <v-card
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            to="worker/12342"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
          <v-card
            class="workerCard"
            min-width="10vw"
            min-height="20vh"
            link
            nuxt
            to="worker/12342"
          >
            <v-card-title class="workerName"> Worker Name </v-card-title>
          </v-card>
        </div>
      </v-row>
      <v-row cols="12">
        <!-- For each team I manage, return a list of workers that I can then click into -->
        <ManagedTeams />
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  middleware: 'validate-manager',
  layout: 'background_home',
  data() {
    return {}
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
  },
}
</script>
<style scoped>
.container {
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
