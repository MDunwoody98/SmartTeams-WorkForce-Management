<template>
  <div class="container">
    <v-container v-if = "!mobile" class="d-flex justify-center">
      <v-row>
        <v-col cols="12">
          <!--In here goes the time entry cards-->
          <div class="calendar-container">
            <div v-for="index in cardCount" :key="index">
              <v-card class="dayview-card">
                <v-toolbar dense flat>
                  <v-toolbar-title class="title-dayName">Monday</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar-title class="title-dayInMonthNumber">{{index}}</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                  <v-list>
                    <template v-for="i in 40">
                      <v-list-tile v-bind:key="i">
                        <v-list-tile-content>
                          <div>{{ i }}</div>
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>
                  </v-list>
                </v-card-text>
                <v-footer class="pa-2">Footer</v-footer>
              </v-card>
            </div>
          </div>
        </v-col>
        <v-col>
          <!--In here goes the time entry cards-->
          <div>
            <Logo />
            <p>
              {{this.$auth.user}}
            </p>
          </div>
        </v-col>
        <v-col>
        <!--In here goes the vertical split with the graphs-->
          <div>
            <Logo />
            <p>
              {{this.$auth.user}}
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: 'background_home',
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    cardCount() {
      if (this.$vuetify.breakpoint.xl) {
        return 7
      }
      if (this.$vuetify.breakpoint.mdAndUp) {
        return 5
      }
      else
       return 0
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
.calendar-container {
  margin-top: 30px;
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
}




.dayview-card {
  width: 200px;
  height: 40vh;
}
.v-card {
  display: flex;
  flex-direction: column;
}

.v-card__text {
  flex-grow: 1;
  overflow: auto;
}

.title-dayName {
  padding: 0%;
}

</style>
