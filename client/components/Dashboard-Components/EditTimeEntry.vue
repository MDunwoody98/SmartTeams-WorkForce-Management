<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Edit Time Entry</span>
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
              prepend-icon="calendar"
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
            <v-btn text color="primary" @click="$refs.menu.save(dates)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <!-- Implement multi-select dropdown here so that it looks like a Workday search box. Select from all time codes or filter by proejct -->
        <v-select
          :items="['Code 1', 'Code 2', 'Code 3', 'Code 4']"
          label="Time Code"
          required
        ></v-select>
        <v-text-field
          label="Hours"
          hint="Must be an increment of 0.25"
        ></v-text-field>
      </v-card-text>
      <v-textarea
        outlined
        shaped
        label="Comments"
        class="comments-box"
      ></v-textarea>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="show = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="show = false">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: Boolean,
  },
  data: () => ({
    dates: [],
    menu: false,
  }),
  computed: {
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
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
