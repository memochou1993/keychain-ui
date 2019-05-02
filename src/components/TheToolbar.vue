<template>
  <div>
    <v-navigation-drawer
      v-if="!!payload"
      v-model="drawer"
      :width="250"
      app
      clipped
    >
      <v-list>
        <v-list-tile
          v-for="(item, index) in drawerLinks"
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
      <v-spacer />
      <v-btn
        v-for="(item, index) in toolbarLinks"
        :key="index"
        :to="item.to"
        outline
      >
        {{ item.title }}
      </v-btn>
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
    toolbarLinks() {
      return [
        {
          title: this.$t('links.login'),
          to: {
            name: 'auth.login',
          },
          meta: {
            requiresAuth: false,
          },
        },
        {
          title: this.$t('links.register'),
          to: {
            name: 'auth.register',
          },
          meta: {
            requiresAuth: false,
          },
        },
        {
          title: this.$t('links.logout'),
          to: {
            name: 'auth.logout',
          },
          meta: {
            requiresAuth: true,
          },
        },
      ].filter(link => link.meta.requiresAuth === !!this.payload);
    },
    drawerLinks() {
      return [
        {
          title: this.$t('links.account'),
          to: {
            name: 'user.account',
          },
          icon: 'mdi-account-circle-outline',
          meta: {
            requiresAuth: true,
          },
        },
        {
          title: this.$t('links.keys'),
          to: {
            name: 'user.keys',
          },
          icon: 'mdi-key-outline',
          meta: {
            requiresAuth: true,
          },
        },
        {
          title: this.$t('links.settings'),
          to: {
            name: 'user.settings',
          },
          icon: 'mdi-settings-outline',
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
