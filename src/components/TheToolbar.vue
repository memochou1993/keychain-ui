<template>
  <div>
    <v-navigation-drawer
      v-if="payload"
      v-model="drawer"
      :width="250"
      app
      clipped
    >
      <v-list>
        <v-list-tile
          v-for="(link, index) in links"
          :key="index"
          :to="link.to"
          exact
        >
          <v-list-tile-action>
            <v-icon>
              {{ link.icon }}
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content
            class="subheading"
          >
            <v-list-tile-title>
              {{ link.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      dark
      clipped-left
      color="primary"
    >
      <v-toolbar-side-icon
        v-if="payload"
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
      links: [
        {
          title: 'Profile',
          to: {
            name: 'user.profile',
          },
          icon: 'mdi-account-circle-outline',
        },
        {
          title: 'Keys',
          to: {
            name: 'user.keys',
          },
          icon: 'mdi-key-outline',
        },
        // {
        //   title: 'Settings',
        //   to: {
        //     name: 'user.settings',
        //   },
        //   icon: 'mdi-settings-outline',
        // },
        {
          title: 'Logout',
          to: {
            name: 'auth.logout',
          },
          icon: 'mdi-logout-variant',
        },
      ],
    };
  },
  computed: {
    ...mapState('auth', [
      'payload',
    ]),
  },
  methods: {
    setDrawer(drawer) {
      this.drawer = drawer;
    },
    goTo(name) {
      this.$router.push({
        name,
      });
    },
  },
};
</script>
