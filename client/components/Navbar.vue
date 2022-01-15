<template>
  <nav class="navigation">
    <v-app-bar app dense dark class="toolbar" color="#091C58" clipped-left>
      <v-toolbar-title>
        <span> SmartTeams </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text class="signout-nav" @click="logOut()">
        <span v-if="!mobile" class="signout-nav-text">Sign out</span>
        <v-icon right large>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      light
      class="sidenav"
      :mini-variant="mobile"
      permanent
      clipped
      app
      width="210px"
    >
      <v-row no-gutters>
        <v-col cols="12" align="center" class="nav-header">
          <v-avatar v-if="!mobile" size="100">
            <v-img :src="require('~/assets/Mugshot_1.jpg')" />
          </v-avatar>
        </v-col>
        <v-col
          v-if="!mobile"
          cols="12"
          align="center"
          class="nav-header-username"
        >
          <p class="subheading user-name-nav">
            {{ this.$auth.user.worker.name.firstName }}
            {{ this.$auth.user.worker.name.lastName }}
          </p>
        </v-col>
      </v-row>

      <v-list>
        <v-list-item
          v-for="navItem in navItems"
          :key="navItem.text"
          :to="navItem.route"
          nuxt
        >
          <v-list-item-action>
            <v-icon>{{ navItem.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ navItem.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <p>text</p>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      navItems: [
        // Admin will have admin option here
        { icon: 'dashboard', text: 'Dashboard', route: '/dashboard' },
        { icon: 'person', text: 'Profile', route: '/profile' },
      ],
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
  },
  created() {
    this.generateNavItems()
  },
  methods: {
    async logOut() {
      await this.$auth.logout()
    },
    generateNavItems() {
      if (this.$auth.$storage.getUniversal('isManager')) {
        this.navItems.push({
          icon: 'manage_accounts',
          text: 'Manager Zone',
          route: '/manager',
        })
      }
      if (this.$auth.$storage.getUniversal('isAdmin')) {
        this.navItems.push({
          icon: 'settings',
          text: 'Admin',
          route: '/admin',
        })
      }
    },
  },
}
</script>

<style scoped>
.navigation {
  position: relative;
}
.toolbar {
  position: relative;
  color: '#091C58';
  height: 80vh;
}
.sidenav {
  position: fixed;
}
.nav-header-username {
  margin-bottom: 30px;
}
.user-name-nav {
  color: black;
  font-size: larger;
  font-weight: 700;
}
.nav-header {
  margin-top: 100px;
  margin-bottom: 40px;
}
.signout-nav {
  margin-top: 0px;
}
.signout-nav-text {
  font-size: larger;
  padding-right: 20px;
}
</style>
