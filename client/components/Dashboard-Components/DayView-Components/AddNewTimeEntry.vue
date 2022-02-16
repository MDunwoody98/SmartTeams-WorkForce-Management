<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Add Time Entry</span>
      </v-card-title>
      <v-tabs v-model="tab" fixed-tabs>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="item in items" :key="item"> {{ item }}</v-tab>
      </v-tabs>
      <!-- Date picker for particular date of time entry -->
      <v-card-text>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-combobox
              v-model="dates"
              multiple
              chips
              deletable-chips
              clearable
              label="Date"
              prepend-icon="edit_calendar"
              v-bind="attrs"
              v-on="on"
            ></v-combobox>
          </template>
          <v-date-picker
            v-model="dates"
            multiple
            no-title
            scrollable
            event-color="black"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <!-- <v-btn text color="primary" @click="$refs.menu.save(dates)">-->
            <v-btn text color="primary" @click="$refs.menu.save(dates)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-select
              v-model="selectedTimeCode"
              :items="availableTimeCodeIdList"
              name="selectedTimeCode"
              label="Time Code"
              required
            ></v-select>
          </v-tab-item>
          <v-tab-item>
            <v-select
              v-model="selectedTimeOffCode"
              :items="availableTimeOffCodeIdList"
              name="selectedTimeOffCode"
              label="Time Off Code"
              required
            ></v-select>
          </v-tab-item>
        </v-tabs-items>
        <v-text-field
          v-model="hours"
          label="Hours"
          hint="Must be an increment of 0.25"
        ></v-text-field>
      </v-card-text>
      <v-textarea
        v-model="comments"
        outlined
        shaped
        label="Comments"
        class="comments-box"
      ></v-textarea>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeWindow()">Close</v-btn>
        <v-btn color="blue darken-1" text @click="addTimeEntry()">Save</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="snackbar"
      :timeout="4000"
      color="var(--color-secondary)"
      rounded="pill"
      >{{ errorMessage }}</v-snackbar
    >
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: Boolean,
    timeEntryDate: Date,
    availableTimeCodes: { type: Map, default: null },
    availableTimeOffCodes: { type: Array, default: null },
  },
  data() {
    return {
      dates: [],
      menu: true,
      selectedTimeCode: null,
      selectedTimeOffCode: null,
      hours: null,
      comments: null,
      tab: null,
      snackbar: false,
      items: ['Enter Time', 'Enter Time Off'],
      errorMessage: null,
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

      this.availableTimeCodes.forEach((timeCodeAndName, projectId) => {
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
  },
  watch: {
    show() {
      if (this.show) {
        // Each time you display AddMewTimeEntry, set the selected date and coordinate the model with combobox and datepicker
        this.dates = this.formatSelectedDate(this.timeEntryDate)
      } else this.menu = false // ensure datepicker is not active if parent componenet not displayed
    },
  },
  methods: {
    async addTimeEntry() {
      if (this.validateNewEntry()) {
        let entriesPosted = 0
        await this.dates.forEach((selectedDate) => {
          let timeEntry = {
            workerId: this.$auth.user.workerId,
            date: selectedDate,
            timeCodeId: this.selectedTimeCode,
            hours: this.hours,
            comments: this.comments,
            approved: false,
          }

          if (this.tabs === 0)
            timeEntry = { ...timeEntry, timeCodeId: this.selectedTimeCode }
          else
            timeEntry = {
              ...timeEntry,
              timeOffCodeId: this.selectedTimeOffCode,
            }

          this.$axios.post('/time_entry', timeEntry)
          entriesPosted++
          // Re-render DayView component if you add a time entry for the same date that you initially clicked
          if (
            this.dates[0] === this.formatSelectedDate(this.timeEntryDate)[0] &&
            this.dates.length === 1
          ) {
            this.$emit('updateParent')
            return
          }
          // Re-render all DayView components on screen if you entered multiple time entries, or if your single entry was not for the initial date selected
          if (entriesPosted === this.dates.length) {
            this.$emit('updateContainer')
          }
        })
        this.closeWindow()
      }
    },
    validateNewEntry() {
      let errorMessage = ''
      if (this.hours % 0.25 !== 0)
        errorMessage = 'Please enter hours in increments of 0.25'
      if (this.hours < 0 || this.hours > 24)
        errorMessage =
          'Please enter a valid number of hours for this time entry'
      if (!this.hours)
        errorMessage = 'Please enter the number of hours for this time entry'
      if (this.dates.length === 0)
        errorMessage = 'Please enter a date for your time entry'
      if (!this.selectedTimeOffCode && this.tab === 1)
        errorMessage = 'Please enter a valid time off code for this time entry'
      if (!this.selectedTimeCode && this.tab === 0)
        errorMessage = 'Please enter a valid time code for this time entry'
      if (errorMessage !== '') {
        this.errorMessage = errorMessage
        this.toggleAlert()
        return false
      }
      return true
    },
    toggleAlert() {
      this.snackbar = !this.snackbar
    },
    formatSelectedDate(inputDate) {
      const selectedDate = new Date(inputDate)
      return [
        selectedDate.getFullYear() +
          '-' +
          ('0' + (selectedDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + selectedDate.getDate()).slice(-2),
      ]
    },
    closeWindow() {
      this.show = false
      Object.assign(this.$data, this.$options.data())
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
</style>
