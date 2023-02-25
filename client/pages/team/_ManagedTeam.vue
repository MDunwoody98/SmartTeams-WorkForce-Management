<template>
  <!--If no worker profile, navigate to a form to complete profile-->
  <div class="container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <!-- date/week selector -->
          <!--View of current week and associated time entries-->
          <!-- When navigating back to dashboard, re-render component -->
          <DayViewContainer :key="$route.fullPath" />
        </v-col>
        <v-col v-if="!mobile" cols="6">
          <!--In here goes the time entry cards-->
          <div class="report-container">
            <v-card elevation="24" class="report-item-card">
              <v-card-title class="report-item-title">{{
                ManagedTeam
              }}</v-card-title>
              <Charts-RemainingLeave
                :data="annualLeaveChartData"
                :options="chartOptions"
                class="pie-chart"
              />
            </v-card>
          </div>
        </v-col>
        <v-col v-if="!mobile" cols="6">
          <!--In here goes the vertical split with the graphs-->
          <div class="report-container">
            <v-card elevation="24" class="report-item-card">
              <v-card-title class="report-item-title">{{
                ManagedTeam
              }}</v-card-title>
              <Charts-CurrentWorkerUtilization
                :data="utilizationChartData"
                :options="chartOptions"
                class="pie-chart"
              />
            </v-card>
          </div>
        </v-col>
        <v-col cols="12"></v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: "background_home",
  asyncData({ params }) {
    const ManagedTeam = params.ManagedTeam; // When calling /abc the slug will be "abc"
    return { ManagedTeam };
  },
  // Is the current user an admin, or a manager of this team?
  validate({ params, store }) {
    // Throws a 500 internal server error with custom message
    throw new Error("Under Construction!");
  },
  data() {
    return {
      utilizationChartData: {
        labels: ["Absence", "Non-utilized", "Utilized"],
        datasets: [
          {
            label: "Annual Leave",
            backgroundColor: ["grey", "#091C58", "#2D9FA0"],
            data: [4, 20, 76]
          }
        ]
      },
      annualLeaveChartData: {
        labels: ["Leave used", "Leave remaining"],
        datasets: [
          {
            label: "Annual Leave",
            backgroundColor: ["#091C58", "#2D9FA0"],
            data: [16.25, 35]
          }
        ]
      },
      chartOptions: {
        legend: {
          position: "right"
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  }
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  max-height: 100vh;
  display: flex;
  justify-content: center;
  text-align: center;
}

@media all and (min-width: 968px) {
  .report-item-card {
    align-items: center;
  }
}

@media all and (min-width: 1904px) {
  .report-item-card {
    width: 43vw;
    height: 44vh;
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
    height: 35vh;
  }

  .pie-chart {
    margin: 0 auto;
    width: 100%;
    height: 66%;
  }
}

.report-item-title {
  justify-content: center;
}
</style>
