<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Add Time Entry</span>
      </v-card-title>
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
            <v-btn text color="primary" @click="menu = false"> OK </v-btn>
          </v-date-picker>
        </v-menu>
        <v-select
          v-model="selectedTimeCode"
          :items="availableTimeCodeIdList"
          name="selectedTimeCode"
          label="Time Code"
          required
        ></v-select>
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
  },
  data() {
    return {
      dates: [],
      menu: false,
      selectedTimeCode: null,
      hours: null,
      comments: null,
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
  },
  watch: {
    show() {
      if (this.show) {
        // Each time you display AddMewTimeEntry, set the selected date and coordinate the model with combobox and datepicker
        this.setSelectedDate()
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
        if (entriesPosted === this.dates.length) {
          this.$emit('updateParent')
        }
      })
      this.show = false
    },
    setSelectedDate() {
      const selectedDate = new Date(this.timeEntryDate)
      this.dates = [
        selectedDate.getFullYear() +
          '-' +
          ('0' + (selectedDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + selectedDate.getDate()).slice(-2),
      ]
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
