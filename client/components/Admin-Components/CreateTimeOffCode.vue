<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Create Time Code</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="timeOffCodeName"
          label="Time Off Code Name"
        ></v-text-field>
        <v-card-title class="label-title">
          <span class="label-field">Auto-approve?</span>
          <v-checkbox v-model="autoApprove"></v-checkbox>
        </v-card-title>
        <v-card-title class="label-title">
          <span class="label-field">Paid?</span>
          <v-checkbox v-model="paid"></v-checkbox>
        </v-card-title>
        <v-card-title class="label-title">
          <!--Future feature - approval from at least 1 lead of all teams in which worker is a member-->
          <span class="label-field">Requires Multiple Approvals?</span>
          <v-checkbox v-model="multiApprove"></v-checkbox>
        </v-card-title>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeWindow()">Close</v-btn>
        <v-btn color="blue darken-1" text @click="createTimeOffCode()"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: Boolean
  },
  data() {
    return {
      timeOffCodeName: null,
      paid: true,
      autoApprove: false,
      multiApprove: false
    };
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    async createTimeOffCode() {
      if (!this.timeOffCodeName) {
        return this.$emit(
          "showSnackbar",
          "Error. Please enter a time off code name"
        );
      }
      try {
        await this.$axios.post("/time_off_code", {
          timeOffCodeName: this.timeOffCodeName,
          paid: this.paid,
          autoApprove: this.autoApprove,
          requiresMultipleApprovals: this.multiApprove
        });
        this.$emit("showSnackbar", "Successfully created time off code");
        this.closeWindow();
      } catch (ex) {
        return this.$emit(
          "showSnackbar",
          "Error creating time off code. Please ensure the time off code name is unique"
        );
      }
    },
    closeWindow() {
      this.show = false;
    }
  }
};
</script>
<style scoped>
template {
  position: absolute;
}

.comments-box {
  width: 91%;
  margin: 0 auto;
}

.label-title {
  padding: 0;
  font-size: 1.1rem;
}

.label-field {
  width: 160px;
  text-align: left;
}
</style>
