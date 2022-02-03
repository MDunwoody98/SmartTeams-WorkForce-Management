<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <!-- If the time entry is approved or submitted, do not permit it to be edited by the worker-->
      <v-card-title>
        <span class="headline">{{ title }} </span>
      </v-card-title>
      <v-tabs v-if="!disableEditing && !managerView" v-model="tab" fixed-tabs>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="item in items" :key="item"> {{ item }}</v-tab>
      </v-tabs>
      <!-- Date picker for particular date of time entry -->
      <v-card-text>
        <v-combobox
          v-model="date"
          disabled
          label="Date"
          prepend-icon="calendar_today"
        ></v-combobox>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-select
              v-model="timeCode"
              :items="availableTimeCodeIdList"
              name="selectedTimeCode"
              label="Time Code"
              required
              :disabled="disableEditing || managerView"
            ></v-select>
          </v-tab-item>
          <v-tab-item>
            <v-select
              v-model="timeCode"
              :items="availableTimeOffCodeIdList"
              name="selectedTimeOffCode"
              label="Time Off Code"
              required
              :disabled="disableEditing || managerView"
            ></v-select>
          </v-tab-item>
        </v-tabs-items>
        <!-- Manager view - display the time code or time off code for the entry -->
        <v-select
          v-if="disableEditing || managerView"
          v-model="timeCode"
          :items="availableTimeCodeIdList"
          label="Time Code"
          disabled
        ></v-select>
        <v-text-field
          v-model="hours"
          label="Hours"
          hint="Must be an increment of 0.25"
          :disabled="disableEditing || managerView"
        ></v-text-field>
      </v-card-text>
      <v-textarea
        v-model="comments"
        outlined
        shaped
        label="Comments"
        class="comments-box"
        :disabled="disableEditing || managerView"
      ></v-textarea>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="300">
          <template
            v-if="!disableEditing && !managerView"
            v-slot:activator="{ on, attrs }"
          >
            <v-btn color="blue darken-1" text v-bind="attrs" v-on="on">
              Delete
            </v-btn>
          </template>
          <v-card>
            <v-card-title> </v-card-title>
            <v-card-text class="deletion-prompt">
              Are you sure you wish to delete this time entry?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="deleteTimeEntry()">
                Delete
              </v-btn>
              <v-btn color="green darken-1" text @click="closeWindows()">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn color="blue darken-1" text @click="closeWindows()">Close</v-btn>
        <v-btn
          v-if="!disableEditing && !managerView"
          color="blue darken-1"
          text
          :disabled="disableEditing || managerView"
          @click="editTimeEntry()"
          >Save</v-btn
        >
        <v-btn
          v-if="managerCanActionEntry"
          color="blue darken-1"
          text
          @click="approveTimeEntry()"
          >Approve</v-btn
        >
        <v-btn
          v-if="managerCanActionEntry"
          color="blue darken-1"
          text
          @click="rejectTimeEntry()"
          >Reject</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: Boolean,
    timeEntry: { type: Object, default: null },
    selectedTimeCode: { type: Object, default: null },
    selectedTimeOffCode: { type: Object, default: null },
    availableTimeCodes: { type: Map, default: null },
    availableTimeOffCodes: { type: Array, default: null },
    managerView: { type: Boolean, deafult: false },
  },
  data() {
    return {
      date: null,
      menu: false,
      dialog: false,
      tab: null,
      items: ['Enter Time', 'Enter Time Off'],
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    availableTimeCodeIdList() {
      const availableTimeCodes = []
      if (
        this.availableTimeCodes.size === 0 ||
        Object.fromEntries(this.availableTimeCodes)[0] === '{'
      )
        return availableTimeCodes

      this.availableTimeCodes?.forEach((timeCodeAndName, projectId) => {
        availableTimeCodes.push({ header: projectId })
        timeCodeAndName?.forEach((idAndName) => {
          availableTimeCodes.push({ value: idAndName[0], text: idAndName[1] })
        })
        availableTimeCodes.push({ divider: true })
      })

      return availableTimeCodes
    },
    availableTimeOffCodeIdList() {
      const timeOffCodes = []
      this.availableTimeOffCodes?.forEach((timeOffCode) => {
        timeOffCodes.push({ value: timeOffCode._id, text: timeOffCode.name })
      })
      return timeOffCodes
    },
    title() {
      if (this.timeEntry?.submitted) return 'View Submitted Time Entry'
      if (this.timeEntry?.approved) return 'View Approved Time Entry'
      if (this.managerView) return 'View Time Entry in Draft'
      return 'Edit Time Entry'
    },
    disableEditing() {
      // Workers cannot edit their time entries if they are submitted or approved
      if (this.timeEntry?.submitted || this.timeEntry?.approved) return true
      return false
    },
    managerCanActionEntry() {
      // Managers can only action submitted entries that have not been approved or rejected
      if (
        this.timeEntry?.submitted &&
        !this.timeEntry?.approved &&
        !this.timeEntry?.rejected &&
        this.managerView
      )
        return true
      return false
    },
    hours: {
      get() {
        return this.timeEntry?.hours
      },
      set(value) {
        this.timeEntry.hours = value
      },
    },
    comments: {
      get() {
        return this.timeEntry?.comments
      },
      set(value) {
        this.timeEntry.comments = value
      },
    },
    timeCode: {
      get() {
        return this.timeEntry?.timeCodeId
      },
      set(value) {
        this.timeEntry.timeCodeId = value
      },
    },
  },
  watch: {
    show() {
      if (this.show) {
        // Each time you display EditTimeEntry, set the selected date and coordinate the model with combobox and datepicker
        this.setSelectedDate()
      }
    },
  },
  methods: {
    setSelectedDate() {
      const selectedDate = new Date(this.timeEntry.date)
      this.date =
        selectedDate.getFullYear() +
        '-' +
        ('0' + (selectedDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + selectedDate.getDate()).slice(-2)
    },
    closeWindows() {
      this.dialog = false
      this.show = false
    },
    async editTimeEntry() {
      await this.$axios.put(`/time_entry/${this.timeEntry._id}`, {
        workerId: this.$auth.user.workerId,
        date: this.date,
        timeCodeId: this.timeCode,
        hours: this.hours,
        comments: this.comments,
        approved: false,
        rejected: false,
        rejectionMessage: null,
      })
      this.show = false
      this.$emit('updateParent')
    },
    async deleteTimeEntry() {
      await this.$axios.delete(`/time_entry/${this.timeEntry._id}`)
      this.dialog = false
      this.show = false
      this.$emit('updateParent')
    },
    // TODO - Manager functions when actioning a single time entry
    async rejectTimeEntry() {
      await this.$axios.put(`/time_entry/reject/${this.timeEntry._id}`, {
        workerId: this.workerId,
        rejectionMessage: null,
      })
      this.dialog = false
      this.show = false
      this.$emit('updateParent')
    },
    async approveTimeEntry() {
      await this.$axios.put(`/time_entry/approve/${this.timeEntry._id}`, {
        workerId: this.workerId,
      })
      this.dialog = false
      this.show = false
      this.$emit('updateParent')
    },
  },
}
</script>
<style scoped>
template {
  position: absolute;
}
.comments-box {
  width: 91%;
  margin: 0 auto;
}
.deletion-prompt {
  font-size: 1.2rem;
}
</style>
