<template>
  <!--If no worker profile, navigate to a form to complete profile-->
  <div class="container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <!-- date/week selector -->
          <!--View of current week and associated time entries-->
          <!-- When navigating back to dashboard, re-render component -->
          <DayViewContainer
            :key="$route.fullPath"
            :worker-id="$auth.user.workerId"
            :manager-view="false"
          />
        </v-col>
        <v-col v-if="!mobile" cols="6">
          <!--In here goes the time entry cards-->
          <div class="report-container">
            <v-card elevation="24" class="report-item-card">
              <v-card-title class="report-item-title"
                >My Annual Leave</v-card-title
              >
              <Charts-RemainingLeave
                :worker-id="$auth.user.workerId"
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
              <v-card-title class="report-item-title"
                >My Utilization</v-card-title
              >
              <Charts-CurrentWorkerUtilization
                :worker-id="$auth.user.workerId"
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
  data() {
    return {
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
  min-height: 0;
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
