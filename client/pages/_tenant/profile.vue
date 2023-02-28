<template>
  <div class="container">
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-card @click="changeMyPassword = true">
            <v-card-subtitle>Change My Password</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card @click="updateMyDetails = true">
            <v-card-subtitle>Update My Details</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card @click="changeMyPhoto = true">
            <v-card-subtitle>Change My Photo</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar
        v-model="snackbar"
        :timeout="4000"
        color="var(--color-secondary)"
        rounded="pill"
        >{{ snackbarText }}</v-snackbar
      >
    </v-container>
    <div data-app>
      <ChangeMyPassword
        v-model="changeMyPassword"
        @showSnackbar="showSnackbar"
      />
      <UpdateMyDetails v-model="updateMyDetails" @showSnackbar="showSnackbar" />
      <ChangeMyPhoto v-model="changeMyPhoto" @showSnackbar="showSnackbar" />
    </div>
  </div>
</template>
<script>
import BasePage from "~/pages/_tenant/BasePage";
export default {
  extends: BasePage,
  layout: "background_home",
  data() {
    return {
      changeMyPassword: false,
      updateMyDetails: false,
      changeMyPhoto: false,
      snackbar: false,
      snackbarText: null
    };
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  methods: {
    showSnackbar(text) {
      this.snackbarText = text;
      this.snackbar = !this.snackbar;
    }
  }
};
</script>
<style scoped>
.container {
  margin: 0 auto;
  margin-top: 30px;
  max-height: 100vh;
  min-height: 0;
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
