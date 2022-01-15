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
          :return-value.sync="dates"
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
        <v-btn color="blue darken-1" text @click="show = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="addTimeEntry()">Save</v-btn>
      </v-card-actions>
    </v-card>
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
      menu: false,
      selectedTimeCode: null,
      selectedTimeOffCode: null,
      hours: null,
      comments: null,
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
      this.availableTimeCodes.forEach((timeCodeAndName, projectId) => {
        availableTimeCodes.push({ header: projectId })
        timeCodeAndName.forEach((idAndName) => {
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
      }
    },
  },
  methods: {
    async addTimeEntry() {
      let entriesPosted = 0
      await this.dates.forEach((selectedDate) => {
        this.$axios.post('/time_entry', {
          workerId: this.$auth.user.workerId,
          date: selectedDate,
          timeCodeId: this.selectedTimeCode,
          hours: this.hours,
          comments: this.comments,
          approved: false,
        })
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
      this.show = false
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
    saveDates() {
      this.menu.save(this.dates)
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
