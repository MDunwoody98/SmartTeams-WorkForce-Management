<template>
  <div>
    <v-card
      :key="worker"
      class="workerCard"
      min-width="10vw"
      min-height="20vh"
      link
      nuxt
      :to="`worker/${worker}`"
    >
      <v-card-title class="workerName">
        {{ linkedWorkerObj.name }}
      </v-card-title>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    workerId: { type: String, default: null },
  },
  data() {
    return {
      linkedWorkerObj: null,
    }
  },
  async created() {
    await this.retrieveWorkerInfo()
  },
  methods: {
    async retrieveWorkerInfo() {
      const response = await this.$axios.get(`/worker/${this.workerId}`)
      this.linkedWorkerObj = response.data
    },
  },
}
</script>
