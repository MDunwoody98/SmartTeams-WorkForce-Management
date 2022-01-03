<template>
  <div class="dayview-container">
    <div class="container-top">
      <div class="week-selector-container">
        <v-icon x-large @click="goToPreviousWeek()">chevron_left</v-icon>
        <v-icon x-large @click="goToSpecifiedWeek()">calendar_month</v-icon>
        <v-icon x-large @click="goToNextWeek()">chevron_right</v-icon>
      </div>
      <div class="submit">
        <v-btn rounded color="#2D9FA0" dark @click="submitTimeEntries()">
          Submit Time Entries
        </v-btn>
      </div>
    </div>
    <div class="calendar-container">
      <template>
        <div v-for="index in cardCount" :key="calendarItems[index - 1].key">
          <DayView :data="calendarItems[index - 1]" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
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
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    cardCount() {
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
    firstDay() {
      return this.selectedDate
    },
  },
  created() {
    this.generateCalendarWeek(this.getMonday(this.selectedDate), this.cardCount) // On creating the component, fill up the correct amount of cards based on screen size for time entries
  },
  methods: {
    getMonday(inputDate) {
      inputDate = new Date(inputDate)
      inputDate.setHours(0, 0, 0, 0)
      const day = inputDate.getDay()
      const diff = inputDate.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
      return new Date(inputDate.setDate(diff))
    },
    getSaturday(inputDate) {
      inputDate = new Date(inputDate)
      inputDate.setHours(0, 0, 0, 0)
      const day = inputDate.getDay()
      const diff = inputDate.getDate() - day + (day === 0 ? 0 : 6) // adjust when day is sunday
      return new Date(inputDate.setDate(diff))
    },
    generateCalendarWeek(firstDay, noOfCards) {
      this.selectedDate = new Date(firstDay)
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
    },
    goToNextWeek() {
      if (this.cardCount === 5 || this.cardCount === 2) {
        this.weekendView = !this.weekendView
      }
      this.selectedDate.setDate(this.selectedDate.getDate() + this.cardCount)
      console.log(this.selectedDate)
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
      console.log(this.selectedDate)
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
    goToSpecifiedWeek() {},
    submitTimeEntries() {},
  },
}
</script>
<style scoped>
.dayview-container {
  display: flexbox;
  margin-top: 3vh;
}

.container-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-container {
  display: flex;
  align-items: stretch;
  justify-content: space-evenly;
}

@media all and (min-width: 1904px) {
  .submit {
    margin-top: -4vh;
  }
}
</style>
