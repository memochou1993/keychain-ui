<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      disable-resize-watcher
    >
      <v-list>
        <v-list-tile
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
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      dark
      clipped-left
      color="primary"
    >
      <v-toolbar-side-icon
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
import KeySearch from '@/components/KeySearch.vue';

export default {
  components: {
    KeySearch,
  },
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    ...mapState([
      'refresh',
    ]),
  },
  methods: {
    ...mapActions([
      'setRefresh',
    ]),
    ...mapActions('key', [
      'setKeys',
      'setCreateDialog',
    ]),
    setDrawer(drawer) {
      this.drawer = drawer;
    },
    createKey() {
      this.setDrawer(false);
      this.setCreateDialog(true);
    },
    refreshKeys() {
      this.setDrawer(false);
      this.setRefresh(this.refresh + 1);
      this.setKeys([]);
    },
  },
};
</script>
