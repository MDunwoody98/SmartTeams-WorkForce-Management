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
          <template v-for="i in 10">
            <v-list-item :key="i" class="timeEntry" ripple>
              <v-list-item-content @click="editTimeEntry = true">
                <v-list-item-title class="timeEntry"
                  >Project Name Name Name Name Name Name Name Name Name Name
                  Name Name Name Name Name Name Name Name Name
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
    <div data-app>
      <EditTimeEntry v-model="editTimeEntry" />
      <AddNewTimeEntry v-model="addNewTimeEntry" />
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
    }
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
