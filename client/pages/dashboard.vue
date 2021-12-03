<template>
  <!--If no worker profile, navigate to a form to complete profile-->
  <div class="container">
    <v-container v-if="!mobile">
      <v-row>
        <!--Here is where the date/week selector would go-->
        <v-col cols="12">
          <!--View of current week and associated time entries-->
          <DayViewContainer />
        </v-col>
        <v-col cols="6">
          <!--In here goes the time entry cards-->
          <div class="report-container">
            <v-card elevation="24" width="97%" class="report-item-card">
              <v-card-title class="report-item-title"
                >My Annual Leave</v-card-title
              >
              <Charts-RemainingLeave
                :data="annualLeaveChartData"
                :options="annualLeaveOptions"
                class="pie-chart"
              />
            </v-card>
          </div>
        </v-col>
        <v-col cols="6">
          <!--In here goes the vertical split with the graphs-->
          <div class="report-container">
            <v-card elevation="24" width="97%" class="report-item-card">
              <v-card-title class="report-item-title"
                >My Utilization</v-card-title
              >
              <Charts-CurrentWorkerUtilization
                :data="utilizationChartData"
                :options="utilizationOptions"
                class="pie-chart"
              />
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: 'background_home',
  data() {
    return {
      utilizationChartData: null,
      utilizationOptions: {},
      annualLeaveChartData: null,
      annualLeaveOptions: {},
    }
  },
  computed: {
    mobile() {
      this.$auth.refreshTokens()
      return this.$vuetify.breakpoint.smAndDown
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.report-container {
  display: flex;
  align-items: stretch;
  justify-content: space-evenly;
}
.report-item-title {
  justify-content: center;
}
.pie-chart {
  width: 50%;
  margin: 0 auto;
}
</style>
