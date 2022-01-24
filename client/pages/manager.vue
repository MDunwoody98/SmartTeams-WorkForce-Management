<template>
  <div class="container">
    <v-container>
      <v-row cols="12">
        <ManagedTeams />
        <!-- For each team I manage, return a list of workers that I can then click into -->
        <ManagedTeams />
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
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
