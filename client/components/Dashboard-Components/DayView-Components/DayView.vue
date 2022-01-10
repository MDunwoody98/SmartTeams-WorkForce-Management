<template>
  <!--Card component which you can click on and add time entries to-->
  <div class="containerito">
    <v-card class="dayview-card">
      <v-toolbar dense flat class="card-header">
        <v-toolbar-title class="title-dayName">{{ data.day }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title class="title-dayInMonthNumber">{{
          data.date
        }}</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <div class="container-entries">
        <v-list dense>
          <template v-for="entry in timeEntries">
            <v-list-item :key="entry._id" class="timeEntry" ripple>
              <v-list-item-content @click="editSelectedTimeEntry(entry)">
                <v-list-item-title>
                  <p class="timeCode">
                    {{ timeCodeIdNameMap.get(entry.timeCodeId) }}
                  </p></v-list-item-title
                >
                <v-list-item-subtitle class="timeEntry"
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
      <div @click="addNewTimeEntry = true">
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
        @updateParent="updateDayView"
      />
      <AddNewTimeEntry
        v-model="addNewTimeEntry"
        :time-entry-date="new Date(data.key)"
        :available-time-codes="availableTimeCodes"
        @updateParent="updateDayView"
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
          if (response.data.length > 0) {
            this.timeEntries = response.data
            response.data.forEach((element) => {
              if (!this.timeCodeIds.includes(element.timeCodeId)) {
                this.timeCodeIds.push(element.timeCodeId)
              }
            })
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
    async mapTimeEntryCodeNames(timeCodeIds) {
      console.log(timeCodeIds)
      await timeCodeIds.forEach(async (timeCodeId) => {
        const response = await this.$axios.get(`/time_code/${timeCodeId}`)
        console.log(response.data)
        this.timeCodeIdNameMap.set(timeCodeId, response.data.timeCodeName)
        if (this.timeCodeIdNameMap.keys().length === timeCodeIds.length) {
          console.log('aight')
        }
      })
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
          this.availableTimeCodes = new Map(Object.entries(response.data))
        })
    },
    async renderComponent() {
      await this.retrieveTimeEntryList()
      await this.mapTimeEntryCodeNames(this.timeCodeIds)
      await this.retrieveValidTimeCodes()
      this.$forceUpdate()
    },
    updateDayView() {
      this.renderComponent()
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
    max-width: 16vw;
  }
}
@media all and (min-width: 1904px) {
  .dayview-card {
    max-width: 12vw;
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
.timeEntry:hover {
  background-color: #f3f6fd;
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
