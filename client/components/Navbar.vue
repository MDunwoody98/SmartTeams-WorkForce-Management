<template>
  <nav class="navigation">
    <v-app-bar app dark class="toolbar" color="#091C58" clipped-left>      
      <v-toolbar-title class="text-uppercase">
        <span>
          SmartTeams
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="logOut()">
        <span>Sign out</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer light class="sidenav" :mini-variant="mini" permanent clipped app mobile-breakpoint="md">
      <v-row no-gutters>
        <v-col cols="12" align="center" class="nav-header">
          <v-avatar size="100">
              <v-img :src="require('~/assets/SmartTeams Logo.png')"/>
          </v-avatar>
        </v-col>
        <v-col cols="12" align="center" class="nav-header-username">
            <p class="subheading user-name-nav">{{this.$auth.user.worker.name.firstName}} {{this.$auth.user.worker.name.lastName}}</p>
        </v-col>
      </v-row>
      
      <v-list>
        <v-list-item v-for="navItem in navItems" :key="navItem.text" :to="navItem.route" nuxt>
          <v-list-item-action>
            <v-icon class="">{{ navItem.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{navItem.text}}</v-list-item-title>
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
        {"icon":"dashboard","text":"Dashboard","route":"/"},
        {"icon":"person","text":"Profile","route":"/"},
      ],
    }    
  },
  computed: {
    mini() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  methods: {
    async logOut() {
      await this.$auth.logout()
    }
  }  
}

</script>

<style>
.navigation{
    position: relative;        
}
.toolbar{
    position: relative;
    color: "#091C58";        
}
.sidenav{
  position: fixed;
}
.nav-header-username {
  margin-bottom: 40px;
}
.user-name-nav {
  color: black;
  font-size: larger;
  font-weight: 700;
}
.nav-header{
  margin-top: 100px;
  margin-bottom: 40px;
}


</style>