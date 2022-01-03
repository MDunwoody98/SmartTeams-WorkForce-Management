<template>
  <!--Card component which you can click on and add time entries to-->
  <div class="containerito">
    <v-card class="dayview-card">
      <v-toolbar dense flat>
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
                <v-list-item-title class="timeEntry">
                  {{ timeCodeIdNameMap[entry.timeCodeId] }}</v-list-item-title
                >
                <v-list-item-subtitle class="timeEntry"
                  >{{ entry.hours }} hours</v-list-item-subtitle
                >
                <div class="timeEntry">{{ entry.comments }}</div>
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
    <div data-app>
      <EditTimeEntry
        v-model="editTimeEntry"
        :time-entry="selectedTimeEntry"
        :selected-time-code-name="selectedTimeCodeName"
      />
      <AddNewTimeEntry
        v-model="addNewTimeEntry"
        :time-entry-date="new Date(data.key)"
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
      selectedTimeCodeName: null,
    }
  },
  async created() {
    await this.retrieveTimeEntryList()
    await this.mapTimeEntryCodeNames(this.timeCodeIds)
    this.$forceUpdate()
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
      this.selectedTimeCodeName = this.timeCodeIdNameMap[entry.timeCodeId]
      this.editTimeEntry = true
    },
    async mapTimeEntryCodeNames(timeCodeIds) {
      for (const timeCodeId of timeCodeIds) {
        await this.$axios.get(`/time_code/${timeCodeId}`).then((response) => {
          this.timeCodeIdNameMap[timeCodeId] = response.data.projectId
        })
      }
    },
    isJSONString(str) {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
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

.container-entries {
  overflow-x: hidden;
}

.timeEntry {
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
