<template>
  <div class="container">
    <v-container>
      <!-- 
        For each team I manage, display a horizontal container containing a team card that I can click to expand, and individual worker cards for each team member
        Click on worker card to navigate to page for that worker - dayView & charts. DayView contains all Submitted entries
        Click on team card to navigate to page for that team - tabulated view for analytics
      -->
      <ManagerTeamViewContainer />
      <v-row cols="12">
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
