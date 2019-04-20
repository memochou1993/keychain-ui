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
          @click="go('user.profile')"
        >
          <v-list-tile-action>
            <v-icon>
              mdi-account-circle-outline
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content
            class="subheading"
          >
            <v-list-tile-title>
              Profile
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-group
          :value="groups.keys"
          prepend-icon="mdi-key-outline"
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>
                Keys
              </v-list-tile-title>
            </v-list-tile>
          </template>
          <v-list-tile
            @click="go('user.keys')"
          >
            <v-list-tile-action>
              <v-icon>
                mdi-table-of-contents
              </v-icon>
            </v-list-tile-action>
            <v-list-tile-content
              class="subheading"
            >
              <v-list-tile-title>
                Overview
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            :disabled="!loaded || $route.name !== 'user.keys'"
            @click="createKey"
          >
            <v-list-tile-action>
              <v-icon>
                mdi-plus
              </v-icon>
            </v-list-tile-action>
            <v-list-tile-content
              class="subheading"
            >
              <v-list-tile-title>
                Create
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            :disabled="!loaded || $route.name !== 'user.keys'"
            @click="refreshKeys"
          >
            <v-list-tile-action>
              <v-icon>
                mdi-refresh
              </v-icon>
            </v-list-tile-action>
            <v-list-tile-content
              class="subheading"
            >
              <v-list-tile-title>
                Refresh
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>
              mdi-settings-outline
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content
            class="subheading"
          >
            <v-list-tile-title>
              Settings
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          @click="go('auth.logout')"
        >
          <v-list-tile-action>
            <v-icon>
              mdi-logout-variant
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content
            class="subheading"
          >
            <v-list-tile-title>
              Logout
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
      <v-spacer />
      <KeySearch
        v-if="$route.name === 'user.keys'"
      />
    </v-toolbar>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import helper from '@/mixins/helper';
import KeySearch from '@/components/KeySearch.vue';

export default {
  components: {
    KeySearch,
  },
  mixins: [
    helper,
  ],
  data() {
    return {
      drawer: true,
      groups: {
        keys: true,
      },
    };
  },
  computed: {
    ...mapState([
      'refresh',
    ]),
    ...mapState('auth', [
      'payload',
    ]),
    ...mapState('key', [
      'loaded',
    ]),
  },
  methods: {
    ...mapMutations([
      'setRefresh',
    ]),
    ...mapMutations('key', [
      'setDialog',
    ]),
    setDrawer(drawer) {
      this.drawer = drawer;
    },
    go(name) {
      this.$router.push({
        name,
      });
    },
    createKey() {
      if (!this.breakpoint.lgAndUp) {
        this.setDrawer(false);
      }
      this.setDialog('create');
    },
    refreshKeys() {
      if (!this.breakpoint.lgAndUp) {
        this.setDrawer(false);
      }
      this.setRefresh(this.refresh + 1);
    },
  },
};
</script>
