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
            :worker-id="ManagedWorker"
            :manager-view="true"
          />
        </v-col>
        <v-col v-if="!mobile" cols="6">
          <!--In here goes the time entry cards-->
          <div class="report-container">
            <v-card elevation="24" class="report-item-card">
              <v-card-title class="report-item-title">{{
                ManagedWorker
              }}</v-card-title>
              <Charts-RemainingLeave
                :data="annualLeaveChartData"
                :options="chartOptions"
                :worker-id="ManagedWorker"
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
                ManagedWorker
              }}</v-card-title>
              <Charts-CurrentWorkerUtilization
                :data="utilizationChartData"
                :options="chartOptions"
                :worker-id="ManagedWorker"
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
import jwtDecode from "jwt-decode";
export default {
  layout: "background_home",
  // Is the current user an admin or a manager of this worker?
  async validate({ params, store }) {
    const token = jwtDecode(store.$auth.strategy.token.get());
    const response = await store.$axios.get(
      `/worker/checkManager/${params.ManagedWorker}`
    );
    if (!response.data && !token?.isAdmin) {
      throw new Error("401 Unauthorized");
    } else return true;
  },
  asyncData({ params }) {
    const ManagedWorker = parseInt(params.ManagedWorker); // When calling /abc the ManagedWorker will be "abc"
    return { ManagedWorker };
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
