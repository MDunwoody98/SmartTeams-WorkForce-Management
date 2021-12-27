<template>
  <div class="week-selector-container">
    <v-icon x-large>chevron_left</v-icon>
    <v-icon x-large>calendar_month</v-icon>
    <v-icon x-large>chevron_right</v-icon>
  </div>
</template>
<script>
export default {
  methods: {
    goToNextWeek() {},
    goToPreviousWeek() {},
    goToSpecifiedWeek() {},
  },
}
</script>
<style scoped>
.week-selector-container {
  margin-top: 10vh;
  margin-left: 2vh;
  display: flex;
  align-content: space-around;
}
</style>
