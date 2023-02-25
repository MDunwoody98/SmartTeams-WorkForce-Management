<template>
  <div class="dayview-container">
    <div v-if="!mobile" class="container-top">
      <div class="week-selector-container">
        <v-icon x-large @click="goToPreviousWeek()">chevron_left</v-icon>
        <v-menu ref="menu" :key="menuKey" v-model="menu" :close-on-content-click="false" :return-value.sync="pickedDate"
          offset-y min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-model="pickedDate" x-large v-bind="attrs" v-on="on">calendar_month</v-icon>
          </template>
          <v-date-picker v-model="pickedDate" no-title scrollable reactive event-color="black">
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <!-- <v-btn text color="primary" @click="$refs.menu.save(dapickedDatetes)">-->
            <v-btn text color="primary" @click="goToSpecifiedWeek(pickedDate)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-icon x-large @click="goToNextWeek()">chevron_right</v-icon>
        <span class="dateInfo">W/C {{ dateText }}</span>
      </div>
      <div class="submit">
        <v-btn rounded color="var(--color-secondary)" dark
          @click="!managerView ? submitTimeEntries() : approveTimeEntries()">
          {{ actionButtonText }}
        </v-btn>
      </div>
    </div>
    <div v-if="mobile" class="container-top">
      <div class="submit">
        <v-btn rounded color="var(--color-secondary)" dark
          @click="!managerView ? submitTimeEntries() : approveTimeEntries()">
          {{ actionButtonText }}
        </v-btn>
      </div>
    </div>
    <div class="calendar-container">
      <template>
        <div v-for="index in cardCount" :key="calendarItems[index - 1].key" class="dayview-item">
          <DayView :key="componentKey" :data="calendarItems[index - 1]" :worker-id="workerId" :manager-view="managerView"
            @renderContainer="updateAllDayViewComponents" />
        </div>
      </template>
    </div>
    <v-bottom-navigation v-if="mobile" v-model="mobileNavValue" fixed grow>
      <v-btn value="previous week" @click="goToPreviousWeek()">
        <span>Previous week</span>
      </v-btn>

      <v-menu ref="menu" :key="menuKey" v-model="menu" nudge-left="120vw" :close-on-content-click="false"
        :return-value.sync="pickedDate" offset-y min-width="auto">
        <template v-slot:activator="{ on, attrs }">
          <v-icon large v-bind="attrs" v-on="on">calendar_month</v-icon>
        </template>
        <v-date-picker v-model="pickedDate" no-title scrollable reactive event-color="black">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
          <!-- <v-btn text color="primary" @click="$refs.menu.save(dapickedDatetes)">-->
          <v-btn text color="primary" @click="goToSpecifiedWeek(pickedDate)">
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>

      <v-btn value="Next Week" @click="goToNextWeek()">
        <span>Next Week</span>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
  props: {
    workerId: { type: Number, default: null },
    managerView: { type: Boolean, default: false },
  },
  data() {
    return {
      calendarItems: [],
      weekendView: false,
      selectedDate: new Date(),
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      dayNames: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      componentKey: 0,
      menu: false,
      mobileNavValue: 'previous week',
      pickedDate: null,
      menuKey: 0,
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    cardCount() {
      if (this.mobile) {
        return 7
      }
      if (this.$vuetify.breakpoint.xl) {
        return 7
      }
      if (this.$vuetify.breakpoint.mdAndUp && this.weekendView) {
        return 2
      }
      if (this.$vuetify.breakpoint.mdAndUp) {
        return 5
      } else return 0
    },
    dateText() {
      const month = this.monthNames[this.selectedDate.getMonth()]
      const day = this.dayNames[this.selectedDate.getDay()]
      return `${day} ${this.selectedDate.getDate()} ${month} ${this.selectedDate.getFullYear()}`
    },
    actionButtonText() {
      if (!this.managerView) return 'Submit Time Entries'
      return 'Approve Time Entries'
    },
  },
  watch: {
    // Important that we recreate our container by updating the calendar week if the screen is resized, thus changing the number of cards to display
    cardCount() {
      if (this.weekendView && this.cardCount !== 7) {
        this.generateCalendarWeek(
          this.getSaturday(this.selectedDate),
          this.cardCount
        )
      } else {
        this.generateCalendarWeek(
          this.getMonday(this.selectedDate),
          this.cardCount
        )
      }
    },
  },
  created() {
    // On creating the component, fill up the correct amount of cards based on date and screen size
    const dayOfWeek = new Date(this.selectedDate).getDay()
    if ((dayOfWeek === 0 || dayOfWeek === 6) && this.cardCount !== 7) {
      this.weekendView = true
      this.generateCalendarWeek(
        this.getSaturday(this.selectedDate),
        this.cardCount
      )
    } else
      this.generateCalendarWeek(
        this.getMonday(this.selectedDate),
        this.cardCount
      )
  },
  methods: {
    getMonday(inputDate) {
      inputDate = new Date(inputDate)
      inputDate.setUTCHours(0, 0, 0, 0)
      const day = inputDate.getDay()
      const diff = inputDate.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
      return new Date(inputDate.setDate(diff))
    },
    getSaturday(inputDate) {
      inputDate = new Date(inputDate)
      inputDate.setUTCHours(0, 0, 0, 0)
      const day = inputDate.getDay()
      const diff = inputDate.getDate() - day + (day === 0 ? 0 : 6) // adjust when day is sunday
      return new Date(inputDate.setDate(diff))
    },
    generateCalendarWeek(firstDay, noOfCards) {
      this.selectedDate = new Date(firstDay)
      this.pickedDate = this.selectedDate.toISOString().substr(0, 10)
      const calendarCardArray = []
      for (let i = 0; i < noOfCards; i++) {
        const dateToProcess = new Date(firstDay.setDate(firstDay.getDate() + i)) // process each day sequentially from firstDay, for a total of noOfCards days
        const calendarCardItem = {
          day: this.dayNames[dateToProcess.getDay()],
          date: dateToProcess.getDate(),
          month: this.monthNames[dateToProcess.getMonth()],
          key: dateToProcess.getTime(),
        }
        calendarCardArray.push(calendarCardItem)
        firstDay.setDate(firstDay.getDate() - i) // reset firstDay to be the original day
      }
      this.calendarItems = calendarCardArray
      this.menuKey++ // Re-render v-dialog menu as the template is bound to the existing card components
    },
    goToNextWeek() {
      if (this.cardCount === 5 || this.cardCount === 2) {
        this.weekendView = !this.weekendView
      }
      this.selectedDate.setDate(this.selectedDate.getDate() + this.cardCount)
      if (this.weekendView) {
        this.generateCalendarWeek(
          this.getSaturday(this.selectedDate),
          this.cardCount
        )
      } else {
        this.generateCalendarWeek(
          this.getMonday(this.selectedDate),
          this.cardCount
        )
      }
    },
    goToPreviousWeek() {
      if (this.cardCount === 5 || this.cardCount === 2) {
        this.weekendView = !this.weekendView
      }
      this.selectedDate.setDate(this.selectedDate.getDate() - this.cardCount)
      if (this.weekendView) {
        this.generateCalendarWeek(
          this.getSaturday(this.selectedDate),
          this.cardCount
        )
      } else {
        this.generateCalendarWeek(
          this.getMonday(this.selectedDate),
          this.cardCount
        )
      }
    },
    goToSpecifiedWeek(providedDateString) {
      // if cardCount is not 7 and selected date is Sat or Sun, weekend view is true and getSaturday
      const providedDate = new Date(providedDateString)
      providedDate.setUTCHours(0, 0, 0, 0)
      const day = providedDate.getDay()
      this.menu = false
      if (this.cardCount !== 7 && (day === 6 || day === 0)) {
        this.weekendView = true
        this.generateCalendarWeek(
          this.getSaturday(providedDate),
          this.cardCount
        )
      } else {
        this.weekendView = false
        this.generateCalendarWeek(this.getMonday(providedDate), this.cardCount)
      }
    },
    updateAllDayViewComponents() {
      setTimeout(() => this.componentKey++, 100) // Small delay of 100ms to ensure render captures data changes
    },
    async submitTimeEntries() {
      let counter = 0
      await this.calendarItems.forEach((calDate) => {
        this.$axios.put('/time_entry/submit/day', {
          workerId: this.$auth.user.workerId,
          date: calDate,
        })
        counter++
      })
      // Re-render all DayView components on screen upon submission
      if (counter === this.calendarItems.length) {
        setTimeout(() => this.componentKey++, 100)
      }
    },
    // Approve all time entries in the visible containers that are submitted
    async approveTimeEntries() {
      let counter = 0
      await this.calendarItems.forEach((calDate) => {
        this.$axios.put('/time_entry/approveDay', {
          workerId: this.workerId,
          date: calDate,
        })
        counter++
      })
      // Re-render all DayView components on screen upon submission
      if (counter === this.calendarItems.length) {
        setTimeout(() => this.componentKey++, 100)
      }
    },
    // Reject all time entries in the visible containers that are submitted
    async rejectTimeEntries() {
      let counter = 0
      await this.calendarItems.forEach((calDate) => {
        this.$axios.put('/time_entry/rejectDay', {
          workerId: this.workerId,
          date: calDate,
        })
        counter++
      })
      // Re-render all DayView components on screen upon submission
      if (counter === this.calendarItems.length) {
        setTimeout(() => this.componentKey++, 100)
      }
    },
    // Reject single time entry
    async rejectTimeEntry() {
      let counter = 0
      await this.calendarItems.forEach((calDate) => {
        this.$axios.put('/time_entry/approve/day', {
          workerId: this.workerId,
          date: calDate,
          approverId: this.$auth.user.workerId,
        })
        counter++
      })
      // Re-render all DayView components on screen upon submission
      if (counter === this.calendarItems.length) {
        setTimeout(() => this.componentKey++, 100)
      }
    },
  },
}
</script>
<style scoped>
.dayview-container {
  display: flexbox;
  flex-shrink: 1;
}

.container-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-container {
  display: flex;
  align-items: space-evenly;
  justify-content: space-evenly;
}

.dateInfo {
  font-size: 1.5rem;
  align-items: flex-end;
}

.dayview-item {
  margin: auto;
}

@media all and (min-width: 960px) and (max-width: 1903px) {
  .dayview-container {
    margin-top: 7vh;
  }
}

@media all and (min-width: 1904px) {
  .dayview-container {
    margin-top: 5vh;
  }

  .submit {
    margin-top: -4vh;
  }
}

@media all and (max-width: 959px) {
  .dayview-container {
    margin-top: 3vh;
    justify-content: center;
    align-items: center;
  }

  .container-top {
    justify-content: center;
  }

  .calendar-container {
    display: flexbox;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 60px;
  }

  .v-bottom-navigation {
    margin-left: 56px;
    margin-bottom: 20px;
    flex-grow: 1;
    /*Width is full width of screen minus 56px*/
    width: -webkit-calc(100% - 56px);
    width: -moz-calc(100% - 56px);
    width: calc(100% - 56px);
  }

  .v-bottom-navigation * {
    align-self: center;
  }
}
</style>
