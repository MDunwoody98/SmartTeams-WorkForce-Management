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
            <v-card elevation="24" class="report-item-card">
              <v-card-title class="report-item-title"
                >My Annual Leave</v-card-title
              >
              <Charts-RemainingLeave
                :data="annualLeaveChartData"
                :options="chartOptions"
                class="pie-chart"
              />
            </v-card>
          </div>
        </v-col>
        <v-col cols="6">
          <!--In here goes the vertical split with the graphs-->
          <div class="report-container">
            <v-card elevation="24" class="report-item-card">
              <v-card-title class="report-item-title"
                >My Utilization</v-card-title
              >
              <Charts-CurrentWorkerUtilization
                :data="utilizationChartData"
                :options="chartOptions"
                class="pie-chart"
              />
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="mobile">
      <v-row class="text-center">
        <v-col col="12">
          <v-bottom-navigation absolute shift grow>
            <v-btn value="recent">
              <span>Recent</span>
              <v-icon>history</v-icon>
            </v-btn>

            <v-btn value="favorites" absolute>
              <span>Favorites</span>
              <v-icon>heart</v-icon>
            </v-btn>

            <v-btn value="nearby">
              <span>Nearby</span>
              <v-icon>map-marker</v-icon>
            </v-btn>
          </v-bottom-navigation>
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
      utilizationChartData: {
        labels: ['Absence', 'Non-utilized', 'Utilized'],
        datasets: [
          {
            label: 'Annual Leave',
            backgroundColor: ['grey', '#091C58', '#2D9FA0'],
            data: [4, 20, 76],
          },
        ],
      },
      annualLeaveChartData: {
        labels: ['Leave used', 'Leave remaining'],
        datasets: [
          {
            label: 'Annual Leave',
            backgroundColor: ['#091C58', '#2D9FA0'],
            data: [16.25, 35],
          },
        ],
      },
      chartOptions: {
        legend: {
          position: 'right',
        },
        responsive: true,
        maintainAspectRatio: false,
      },
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
  max-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
@media all and (min-width: 1904px) {
  .report-item-card {
    width: 43vw;
    height: 48vh;
  }
  .pie-chart {
    margin: 0 auto;
    width: 100%;
    height: 80%;
  }
}
@media all and (max-width: 1903px) {
  .report-item-card {
    width: 40vw;
    height: 42vh;
  }
  .pie-chart {
    margin: 0 auto;
    width: 100%;
    height: 75%;
  }
}

.report-item-title {
  justify-content: center;
}
</style>
