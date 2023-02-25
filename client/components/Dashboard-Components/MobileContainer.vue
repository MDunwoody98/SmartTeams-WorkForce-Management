<template>
  <div class="dayview-container">
    <div class="container-top">
      <div class="submit">
        <v-btn
          rounded
          color="var(--color-secondary)"
          dark
          @click="submitTimeEntries()"
        >
          Submit Time Entries
        </v-btn>
      </div>
    </div>
    <div class="calendar-container">
      <template>
        <div
          v-for="index in cardCount"
          :key="calendarItems[index - 1].key"
          class="mobileDay"
        >
          <DayView
            :key="componentKey"
            :data="calendarItems[index - 1]"
            @renderContainer="updateAllDayViewComponents"
          />
        </div>
      </template>
    </div>
    <v-bottom-navigation v-model="value" fixed grow>
      <v-btn value="previous week" @click="goToPreviousWeek()">
        <span>Previous week</span>

        <v-icon>mdi-history</v-icon>
      </v-btn>

      <v-btn value="Select Date" @click="goToSpecifiedWeek()">
        <span>Select Date</span>

        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn value="Next Week" @click="goToNextWeek()">
        <span>Next Week</span>

        <v-icon>mdi-map-marker</v-icon>
      </v-btn>
    </v-bottom-navigation>
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
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      dayNames: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      componentKey: 0,
      value: "previous week"
    };
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    cardCount() {
      if (this.mobile) {
        return 7;
      }
      if (this.$vuetify.breakpoint.xl) {
        return 7;
      }
      if (this.$vuetify.breakpoint.mdAndUp && this.weekendView) {
        return 2;
      }
      if (this.$vuetify.breakpoint.mdAndUp) {
        return 5;
      } else return 0;
    },
    firstDay() {
      return this.selectedDate;
    }
  },
  watch: {
    // Important that we recreate our container by updating the calendar week if the screen is resized, thus changing the number of cards to display
    cardCount() {
      if (this.weekendView && this.cardCount !== 7) {
        this.generateCalendarWeek(
          this.getSaturday(this.selectedDate),
          this.cardCount
        );
      } else {
        this.generateCalendarWeek(
          this.getMonday(this.selectedDate),
          this.cardCount
        );
      }
    }
  },
  created() {
    // On creating the component, fill up the correct amount of cards based on screen size for time entries
    this.generateCalendarWeek(
      this.getMonday(this.selectedDate),
      this.cardCount
    );
  },
  methods: {
    getMonday(inputDate) {
      inputDate = new Date(inputDate);
      inputDate.setHours(0, 0, 0, 0);
      const day = inputDate.getDay();
      const diff = inputDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      return new Date(inputDate.setDate(diff));
    },
    getSaturday(inputDate) {
      inputDate = new Date(inputDate);
      inputDate.setHours(0, 0, 0, 0);
      const day = inputDate.getDay();
      const diff = inputDate.getDate() - day + (day === 0 ? 0 : 6); // adjust when day is sunday
      return new Date(inputDate.setDate(diff));
    },
    generateCalendarWeek(firstDay, noOfCards) {
      this.selectedDate = new Date(firstDay);
      const calendarCardArray = [];
      for (let i = 0; i < noOfCards; i++) {
        const dateToProcess = new Date(
          firstDay.setDate(firstDay.getDate() + i)
        ); // process each day sequentially from firstDay, for a total of noOfCards days
        const calendarCardItem = {
          day: this.dayNames[dateToProcess.getDay()],
          date: dateToProcess.getDate(),
          month: this.monthNames[dateToProcess.getMonth()],
          key: dateToProcess.getTime()
        };
        calendarCardArray.push(calendarCardItem);
        firstDay.setDate(firstDay.getDate() - i); // reset firstDay to be the original day
      }
      this.calendarItems = calendarCardArray;
    },
    goToNextWeek() {
      if (this.cardCount === 5 || this.cardCount === 2) {
        this.weekendView = !this.weekendView;
      }
      this.selectedDate.setDate(this.selectedDate.getDate() + this.cardCount);
      if (this.weekendView) {
        this.generateCalendarWeek(
          this.getSaturday(this.selectedDate),
          this.cardCount
        );
      } else {
        this.generateCalendarWeek(
          this.getMonday(this.selectedDate),
          this.cardCount
        );
      }
    },
    goToPreviousWeek() {
      if (this.cardCount === 5 || this.cardCount === 2) {
        this.weekendView = !this.weekendView;
      }
      this.selectedDate.setDate(this.selectedDate.getDate() - this.cardCount);
      if (this.weekendView) {
        this.generateCalendarWeek(
          this.getSaturday(this.selectedDate),
          this.cardCount
        );
      } else {
        this.generateCalendarWeek(
          this.getMonday(this.selectedDate),
          this.cardCount
        );
      }
    },
    updateAllDayViewComponents() {
      this.componentKey++;
    },
    goToSpecifiedWeek() {},
    async submitTimeEntries() {
      let counter = this.cardCount;
      await this.calendarItems.forEach(calDate => {
        this.$axios.put("/time_entry/submit/day", {
          workerId: this.$auth.user.workerId,
          date: calDate
        });
        counter++;
      });
      // Re-render all DayView components on screen upon submission
      if (counter === this.calendarItems.length) {
        this.$forceUpdate();
      }
    }
  }
};
</script>
<style scoped>
.dayview-container {
  margin-top: 3vh;
  display: flexbox;
  justify-content: center;
  align-items: center;
}

.container-top {
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar-container {
  display: flexbox;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 60px;
}

.mobileDay {
  margin: auto;
}

.v-bottom-navigation {
  margin-left: 56px;
  margin-bottom: 20px;
  flex-grow: 1;
}

.v-bottom-navigation * {
  align-self: center;
}

span.v-btn__content {
  margin-bottom: 20px;
}
</style>
