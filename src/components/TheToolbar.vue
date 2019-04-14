<template>
  <div>
    <v-toolbar
      app
      dark
      clipped-right
      color="primary"
    >
      <v-toolbar-title
        class="headline"
      >
        Keychain
      </v-toolbar-title>
      <v-spacer />
      <KeySearch />
      <v-toolbar-items>
        <v-btn
          icon
          @click="createKey"
        >
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
        <v-btn
          icon
          @click="refreshKeys"
        >
          <v-icon>
            mdi-refresh
          </v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import KeySearch from '@/components/KeySearch.vue';
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    KeySearch,
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
    createKey() {
      this.setCreateDialog(true);
    },
    refreshKeys() {
      this.setRefresh(this.refresh + 1);
      this.setKeys([]);
    }
  },
};
</script>
