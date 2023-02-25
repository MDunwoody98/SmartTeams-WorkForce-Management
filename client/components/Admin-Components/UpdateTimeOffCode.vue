<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Update/Delete Time Off Code</span>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="selectedTimeOffCode"
          :disabled="loadingTimeOffCodes"
          :items="availableTimeOffCodes"
          filled
          label="Time Code"
          color="blue-grey lighten-2"
          item-text="name"
          item-value="id"
        >
          <template v-slot:item="data">
            {{ data.item.name }}
          </template>
        </v-autocomplete>
        <v-text-field
          v-model="timeOffCodeName"
          label="Time Off Code Name"
        ></v-text-field>
        <v-card-title class="label-title">
          <span class="label-field">Paid?</span>
          <v-checkbox v-model="paid"></v-checkbox>
        </v-card-title>
        <v-card-title class="label-title">
          <span class="label-field">Auto-approve?</span>
          <v-checkbox v-model="autoApprove"></v-checkbox>
        </v-card-title>
        <v-card-title class="label-title">
          <span class="label-field">Requires Multiple Approvals?</span>
          <v-checkbox v-model="multiApprove"></v-checkbox>
        </v-card-title>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="300">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="blue darken-1"
              :disabled="selectedTimeOffCode === null"
              text
              v-bind="attrs"
              v-on="on"
            >
              Delete
            </v-btn>
          </template>
          <v-card>
            <v-card-title> </v-card-title>
            <v-card-text class="deletion-prompt">
              Are you sure you wish to delete this time off code?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="deleteTimeOffCode()">
                Delete
              </v-btn>
              <v-btn color="green darken-1" text @click="dialog = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn color="blue darken-1" text @click="closeWindow()">Close</v-btn>
        <v-btn color="blue darken-1" text @click="updateTimeOffCode()"
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
      selectedTimeOffCode: null,
      availableTimeOffCodes: [{ header: "Available Time Off Codes" }],
      timeOffCodeName: null,
      autoApprove: false,
      paid: false,
      multiApprove: false,
      loadingTimeOffCodes: true,
      dialog: false
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
  watch: {
    show() {
      if (this.show) {
        this.retrieveTimeOffCodes();
      }
    },
    selectedTimeOffCode() {
      this.timeOffCodeName = this.availableTimeOffCodes.find(
        timeOffCode => timeOffCode.id === this.selectedTimeOffCode
      )?.name;
      this.paid = this.availableTimeOffCodes.find(
        timeOffCode => timeOffCode.id === this.selectedTimeOffCode
      )?.paid;
      this.autoApprove = this.availableTimeOffCodes.find(
        timeOffCode => timeOffCode.id === this.selectedTimeOffCode
      )?.autoApprove;
      this.multiApprove = this.availableTimeOffCodes.find(
        timeOffCode => timeOffCode.id === this.selectedTimeOffCode
      )?.multiApprove;
    }
  },
  methods: {
    async retrieveTimeOffCodes() {
      let response = await this.$axios.get("/time_off_code");
      response = response.data.map(timeOffCode => ({
        id: timeOffCode._id,
        name: timeOffCode.timeOffCodeName,
        paid: timeOffCode.paid,
        autoApprove: timeOffCode.autoApprove,
        multiApprove: timeOffCode.requiresMultipleApproval
      }));
      this.availableTimeOffCodes.push.apply(
        this.availableTimeOffCodes,
        response
      );
      this.loadingTimeOffCodes = false; // Time Codes loaded
    },

    async updateTimeCode() {
      if (!this.selectedTimeOffCode) {
        return this.$emit(
          "showSnackbar",
          "Error. Please select a time off code to update"
        );
      }
      try {
        await this.$axios.put(`/time_off_code/${this.selectedTimeOffCode}`, {
          timeOffCodeName: this.timeOffCodeName,
          paid: this.paid,
          autoApprove: this.autoApprove,
          requiresMultipleApproval: this.multiApprove
        });
        this.$emit("showSnackbar", "Successfully updated time off code");
        this.closeWindow();
      } catch (ex) {
        return this.$emit(
          "showSnackbar",
          "Error updating time off code. Please ensure the time off code name is unique"
        );
      }
    },
    async deleteTimeOffCode() {
      // TODO - Try catch so code is not currently assigned to any teams! Do same with project! And just mark time codes as inactive, don't actually delete those
      await this.$axios.delete(`/time_off_code/${this.selectedTimeOffCode}`);
      this.$emit("showSnackbar", "Successfully deleted time code");
      this.closeWindow();
    },
    closeWindow() {
      Object.assign(this.$data, this.$options.data());
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
