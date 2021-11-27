<template>
  <!--If no worker profile, navigate to a form to complete profile-->
  <div class="container">
    <v-container v-if="!mobile" class="d-flex justify-center">
      <v-row>
        <!--Here is where the date/week selector would go-->
        <v-col cols="12">
          <!--View of current week and associated time entries-->
          <DayViewContainer />
        </v-col>
        <v-col cols="6">
          <!--In here goes the time entry cards-->
          <RemainingLeave />
        </v-col>
        <v-col cols="6">
          <!--In here goes the vertical split with the graphs-->
          <div>
            <Logo />
            <p>
              {{ this.$auth.user }}
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: 'background_home',
  computed: {
    mobile() {
      this.$auth.refreshTokens()
      return this.$vuetify.breakpoint.smAndDown
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
