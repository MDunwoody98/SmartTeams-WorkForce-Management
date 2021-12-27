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
        <div v-for="index in cardCount" :key="index">
          <v-card class="dayview-card">
            <v-toolbar dense flat>
              <v-toolbar-title class="title-dayName">{{
                calendarItems[index - 1].day
              }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-title class="title-dayInMonthNumber">{{
                calendarItems[index - 1].date
              }}</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <div class="container-entries">
              <v-list dense>
                <template v-for="i in 10">
                  <v-list-item :key="i" class="timeEntry" ripple>
                    <v-list-item-content @click="editTimeEntry = true">
                      <v-list-item-title class="timeEntry"
                        >Project Name Name Name Name Name Name Name Name Name
                        Name Name Name Name Name Name Name Name Name Name
                        Name</v-list-item-title
                      >
                      <v-list-item-subtitle class="timeEntry"
                        >1 hour</v-list-item-subtitle
                      >
                      <div class="timeEntry">{{ i }}</div>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </div>
            <div @click="addNewTimeEntry = true">
              <v-footer class="add-time">
                <v-icon>more_time</v-icon>
                <p>Add Time Entry</p>
              </v-footer>
            </div>
          </v-card>
        </div>
        <div data-app>
          <EditTimeEntry v-model="editTimeEntry" />
          <AddNewTimeEntry v-model="addNewTimeEntry" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      calendarItems: [
        // Make this live by hooking it up to the DB/back end
        { day: 'Monday', date: '15', month: 'November' },
        { day: 'Tuesday', date: '16', month: 'November' },
        { day: 'Wednesday', date: '17', month: 'November' },
        { day: 'Thursday', date: '18', month: 'November' },
        { day: 'Friday', date: '19', month: 'November' },
        { day: 'Saturday', date: '20', month: 'November' },
        { day: 'Sunday', date: '21', month: 'November' },
      ],
      editTimeEntry: false,
      addNewTimeEntry: false,
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
      if (this.$vuetify.breakpoint.mdAndUp) {
        return 5
      } else return 0
    },
  },
  methods: {
    goToNextWeek() {},
    goToPreviousWeek() {},
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

.dayview-card {
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}
@media all and (min-width: 960px) and (max-width: 1903px) {
  .dayview-card {
    max-width: 16vw;
  }
}
@media all and (min-width: 1904px) {
  .dayview-card {
    max-width: 12vw;
  }
  .submit {
    margin-top: -4vh;
  }
}

.title-dayName {
  padding: 0%;
}

.container-entries {
  overflow-x: hidden;
}

.timeEntry {
  max-width: 100%;
  cursor: pointer;
}
.timeEntry:hover {
  background-color: #f3f6fd;
}
.add-time {
  cursor: pointer;
}
.add-time:hover {
  background-color: lightgray;
}
</style>
