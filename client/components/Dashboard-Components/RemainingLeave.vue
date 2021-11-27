<template>
  <div class="report-container">
    <v-card elevation="24">
      <v-card-title>Annual leave remaining</v-card-title>
    </v-card>
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs'
export default {
  extends: Pie,
  data() {
    return {
      leaveUsed:
        // Make this live by hooking it up to the DB/back end
        16.25,
      leaveBalance: 35,
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
  },
}
</script>
<style scoped>
.calendar-container {
  margin-top: 30px;
  display: flex;
  align-items: stretch;
  justify-content: space-evenly;
}
</style>
