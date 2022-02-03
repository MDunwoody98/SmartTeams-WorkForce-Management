<template>
  <div>
    <span>Register User - pwpush API</span>
    <span>Update/Delete User</span>
    <span>Create Team</span>
    <span>Update/Delete Team - assign managers/members/projects</span>
    <span>Create Project</span>
    <span>Update/Delete Project - change manager, maybe linked teams</span>
    <span>Create Time Code</span>
    <span>Update/Delete Time Code</span>
    <span
      >Admin settings - FTE hours, total annual leave (enter in days but calc in
      hours)</span
    >
  </div>
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
