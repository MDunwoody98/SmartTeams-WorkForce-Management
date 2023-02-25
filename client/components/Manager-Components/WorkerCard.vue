<template>
  <div>
    <v-card
      :key="workerId"
      class="workerCard"
      min-width="10vw"
      min-height="15vh"
      link
      nuxt
      :to="`worker/${workerId}`"
    >
      <v-card-subtitle class="workerName">
        {{ linkedWorkerObj ? linkedWorkerObj.name.firstName : "" }}
        {{ linkedWorkerObj ? linkedWorkerObj.name.lastName : "" }}
      </v-card-subtitle>
      <v-avatar size="100">
        <v-img
          :src="
            require(`@/${
              linkedWorkerObj && linkedWorkerObj.photo
                ? linkedWorkerObj.photo
                : 'assets/empty.png'
            }`)
          "
        />
      </v-avatar>
      <v-card-subtitle class="workerJob">
        {{ linkedWorkerObj ? linkedWorkerObj.position.job_title : "" }}
      </v-card-subtitle>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    workerId: { type: Number, default: null }
  },
  data() {
    return {
      linkedWorkerObj: null
    };
  },
  async created() {
    await this.retrieveWorkerInfo();
  },
  methods: {
    async retrieveWorkerInfo() {
      const response = await this.$axios.get(`/worker/${this.workerId}`);
      this.linkedWorkerObj = response.data;
    }
  }
};
</script>
<style scoped>
.workerName {
  font-size: 1.5rem;
}

.workerJob {
  font-size: 1rem;
}
</style>
