<template>
  <div />
</template>
<script>
export default {
  middleware: 'validate-admin',
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
  max-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
