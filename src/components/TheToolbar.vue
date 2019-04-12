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
          @click="setRefresh"
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
import { mapActions } from 'vuex';

export default {
  components: {
    KeySearch,
  },
  methods: {
    ...mapActions('key', [
      'setCreateDialog',
    ]),
    createKey() {
      this.setCreateDialog(true);
    },
    setRefresh() {
      this.$store.dispatch('setRefresh', true);
    },
  },
};
</script>
