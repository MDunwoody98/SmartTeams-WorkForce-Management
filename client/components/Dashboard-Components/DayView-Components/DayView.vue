<template>
  <!--Card component which you can click on and add time entries to-->
  <div class="container">
    <v-card class="dayview-card">
      <v-toolbar dense flat class="card-header">
        <v-toolbar-title class="title-dayName"
          >{{ data.day.substr(0, 3) }} {{ data.date }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title>{{ totalHours }}h</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <div class="container-entries">
        <v-list dense>
          <template v-for="entry in timeEntries">
            <v-list-item :key="entry._id" ripple :class="cardClass(entry)">
              <v-list-item-content
                @click.passive="editSelectedTimeEntry(entry)"
              >
                <v-list-item-title>
                  <p class="timeCode">
                    {{ entry.timeCodeName }}
                  </p></v-list-item-title
                >
                <v-list-item-subtitle
                  ><p class="hours">
                    {{ entry.hours }} {{ entry.hours != 1 ? 'hours' : 'hour' }}
                  </p></v-list-item-subtitle
                >
                <div class="timeEntry-comment">{{ entry.comments }}</div>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </div>
      <v-spacer> </v-spacer>
      <div @click.passive="addNewTimeEntry = true">
        <v-footer class="add-time">
          <v-icon>more_time</v-icon>
          <p>Add Time Entry</p>
        </v-footer>
      </div>
    </v-card>
    <div data-app>
      <EditTimeEntry
        v-model="editTimeEntry"
        :time-entry="selectedTimeEntry"
        :selected-time-code="selectedTimeCode"
        :available-time-codes="availableTimeCodes"
        :available-time-off-codes="availableTimeOffCodes"
        @updateParent.passive="updateDayView"
      />
      <AddNewTimeEntry
        v-model="addNewTimeEntry"
        :time-entry-date="new Date(data.key)"
        :available-time-codes="availableTimeCodes"
        :available-time-off-codes="availableTimeOffCodes"
        @updateParent="updateDayView"
        @updateContainer.passive="updateDayViewContainer"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      editTimeEntry: false,
      addNewTimeEntry: false,
      timeEntries: [],
      selectedTimeEntry: null,
      timeCodeIds: [],
      timeCodeIdNameMap: new Map(),
      timeCodeName: null,
      selectedTimeCode: null,
      availableTimeCodes: new Map(),
      availableTimeOffCodes: null,
      totalHours: 0,
    }
  },
  async created() {
    await this.renderComponent()
  },
  methods: {
    async retrieveTimeEntryList() {
      await this.$axios
        .post('/time_entry/full_day', {
          workerId: this.$auth.user.workerId,
          date: new Date(this.data.key),
        })
        .then((response) => {
          if (response.data) {
            if (response.data !== '[]') {
              this.timeEntries = JSON.parse(response.data)
              this.timeEntries.forEach((element) => {
                this.totalHours += element.hours
                if (!this.timeCodeIds.includes(element.timeCodeId)) {
                  this.timeCodeIds.push(element.timeCodeId)
                }
              })
            }
          }
        })
    },
    editSelectedTimeEntry(entry) {
      this.selectedTimeEntry = entry
      this.selectedTimeCode = {
        value: entry.timeCodeId,
        text: this.timeCodeIdNameMap[entry.timeCodeId],
      }
      this.editTimeEntry = true
    },
    isJSONString(str) {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    },
    async retrieveValidTimeCodes() {
      await this.$axios
        .get(`/time_code/worker/${this.$auth.user.workerId}`)
        .then((response) => {
          this.availableTimeCodes =
            response.data !== '[]'
              ? new Map(Object.entries(response.data))
              : null
        })
        .catch((err) => console.log(err))
    },
    async retrieveValidTimeOffCodes() {
      await this.$axios
        .get(`/time_off_code/worker/${this.$auth.user.workerId}`)
        .then((response) => {
          if (response.data !== '[]') {
            response.data.forEach((timeOffCode) => {
              this.availableTimeOffCodes.push(timeOffCode)
            })
          }
        })
    },
    cardClass(entry) {
      let classes = 'timeEntry'
      if (entry.rejected) {
        classes += ' rejected'
        return
      }
      if (entry.isTimeOff) {
        classes += ' timeOff'
      }
      if (entry.approved) {
        classes += ' approved'
        return
      }
      if (entry.submitted) {
        classes += ' submitted'
      }
      return classes
    },
    renderComponent() {
      this.totalHours = 0
      Promise.all([
        this.retrieveValidTimeCodes(),
        this.retrieveValidTimeOffCodes(),
        this.retrieveTimeEntryList(),
      ])
    },
    updateDayView() {
      setTimeout(() => this.renderComponent(), 100) // Small delay of 100ms to ensure render captures data changes
    },
    updateDayViewContainer() {
      this.$emit('renderContainer')
    },
  },
}
</script>
<style scoped>
.dayview-card {
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

@media all and (min-width: 960px) and (max-width: 1903px) {
  .dayview-card {
    width: 14.5vw;
  }
}
@media all and (min-width: 1904px) {
  .dayview-card {
    width: 11vw;
  }
}
.title-dayName {
  padding: 0%;
}

.title-dayName {
  padding: 0%;
}

.card-header {
  flex-grow: 0;
}

.container-entries {
  overflow-x: hidden;
}

.timeEntry {
  cursor: pointer;
}

.submitted {
  background-color: #dcdcdc;
}
.approved {
  background-color: #acffab;
}
.rejected {
  background-color: #ffcccb;
}

.timeEntry:hover {
  background-color: #f3f6fd;
}

.submitted:hover {
  background-color: #b5b5b5;
}
.approved:hover {
  background-color: lightgreen;
}
.rejected:hover {
  background-color: #ff817e;
}

.timeCode {
  font-size: 1rem;
}
.hours {
  font-size: 0.85rem;
}
.add-time {
  cursor: pointer;
}
.add-time:hover {
  background-color: lightgray;
}

.timeEntry-comment {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  white-space: normal;
  font-size: 0.8rem;
}
</style>
