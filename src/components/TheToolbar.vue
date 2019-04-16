<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :width="250"
      app
      clipped
    >
      <v-list>
        <v-list-tile>
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
          :value="true"
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
            :disabled="!loaded"
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
            :disabled="!loaded"
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
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      dark
      clipped-left
      color="primary"
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
      <KeySearch />
    </v-toolbar>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import helper from '@/helpers/helper';
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
    };
  },
  computed: {
    ...mapState([
      'refresh',
    ]),
    ...mapState('key', [
      'loaded',
    ]),
  },
  methods: {
    ...mapActions([
      'setRefresh',
    ]),
    ...mapActions('key', [
      'setKeys',
      'setDialog',
    ]),
    setDrawer(drawer) {
      this.drawer = drawer;
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
      this.setKeys([]);
    },
  },
};
</script>
