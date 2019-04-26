<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :width="250"
      app
      clipped
    >
      <v-list>
        <v-list-tile
          v-for="(item, index) in links"
          :key="index"
          :to="item.to"
          :class="[$route.name === item.to.name && 'secondary lighten-4']"
          exact
        >
          <v-list-tile-action>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content
            class="subheading"
          >
            <v-list-tile-title>
              {{ item.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      dark
      color="primary"
      clipped-left
    >
      <v-toolbar-side-icon
        class="hidden-lg-and-up"
        @click.stop="setDrawer(!drawer)"
      />
      <v-toolbar-title
        class="headline"
      >
        Keychain
      </v-toolbar-title>
    </v-toolbar>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      drawer: true,
    };
  },
  computed: {
    ...mapState('auth', [
      'payload',
    ]),
    links() {
      return [
        {
          title: 'Profile',
          to: {
            name: 'user.profile',
          },
          icon: 'mdi-account-circle-outline',
          meta: {
            requiresAuth: true,
          },
        },
        {
          title: 'Keys',
          to: {
            name: 'user.keys',
          },
          icon: 'mdi-key-outline',
          meta: {
            requiresAuth: true,
          },
        },
        {
          title: 'Settings',
          to: {
            name: 'user.settings',
          },
          icon: 'mdi-settings-outline',
          meta: {
            requiresAuth: true,
          },
        },
        {
          title: 'Login',
          to: {
            name: 'auth.login',
          },
          icon: 'mdi-login-variant',
          meta: {
            requiresAuth: false,
          },
        },
        {
          title: 'Logout',
          to: {
            name: 'auth.logout',
          },
          icon: 'mdi-logout-variant',
          meta: {
            requiresAuth: true,
          },
        },
      ].filter(link => link.meta.requiresAuth === !!this.payload);
    },
  },
  methods: {
    setDrawer(drawer) {
      this.drawer = drawer;
    },
  },
};
</script>
