<template>
  <div class="manager-container">
    <template>
      <div v-for="index in 1" :key="index">
        <div class="managed-teams-container">
          <div class="managed-teams-header">
            <span>Team Name</span>
          </div>
          <v-data-table
            :headers="headers"
            :items="workers"
            :items-per-page="5"
            loading
            loading-text="Loading... Please wait"
            class="elevation-1"
          ></v-data-table>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    teamID: { type: String, default: null }
  },
  data() {
    return {
      headers: [
        {
          text: "Worker",
          align: "start",
          value: "name"
        },
        { text: "Total time entered", value: "totalTime" },
        { text: "Total time entered", value: "utilizedTime" },
        { text: "Total time entered", value: "nonUtilizedTime" },
        { text: "Utilization", value: "utilization" },
        { text: "AL used", value: "takenAL" },
        { text: "AL Remaining", value: "remainingAL" },
        { text: "Other absence", value: "otherLeave" }
      ],
      workers: [
        {
          id: "12342",
          name: "Frozen Yogurt",
          totalTime: 37.5,
          utilizedTime: 27.5,
          nonUtilizedTime: 2.5,
          utilization: "91.66%", // Calc this
          takenAL: 0,
          remainingAL: 30,
          otherLeave: 7.5
        },
        {
          name: "Ice Cream",
          totalTime: 35.5,
          utilizedTime: 21.5,
          nonUtilizedTime: 14,
          utilization: "57.33%", // Calc this
          takenAL: 0,
          remainingAL: 30,
          otherLeave: 0
        },
        {
          name: "Chocolte Cake",
          totalTime: 41.25,
          utilizedTime: 35.5,
          nonUtilizedTime: 2,
          utilization: "105.18%", // Calc this
          takenAL: 3.75,
          remainingAL: 26.5,
          otherLeave: 0
        }
      ]
    };
  },
  computed: {},
  created() {},
  methods: {}
};
</script>
<style scoped>
.manager-container {
  display: flexbox;
  margin-top: 8vh;
}

.container-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.managed-teams-container {
  display: flexbox;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 60px;
}

@media all and (min-width: 1904px) {
  .submit {
    margin-top: -4vh;
  }
}
</style>
