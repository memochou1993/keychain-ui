<template>
  <div>
    <v-toolbar
      color="elevation-1 secondary lighten-4"
    >
    <v-layout
        row
      >
        <v-flex
          md4
        >
          <v-btn
            :disabled="!loaded"
            color="primary"
            outline
            @click="createKey"
          >
            Create
          </v-btn>
          <v-btn
            :disabled="!loaded"
            color="primary"
            outline
            @click="refreshKeys"
          >
            Refresh
          </v-btn>
        </v-flex>
        <v-flex
          md4
          offset-md4
        >
          <KeySearch />
        </v-flex>
      </v-layout>
    </v-toolbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import KeySearch from '@/components/KeySearch.vue';

export default {
  components: {
    KeySearch,
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
    ...mapMutations([
      'setRefresh',
    ]),
    ...mapMutations('key', [
      'setDialog',
    ]),
    createKey() {
      this.setDialog('create');
    },
    refreshKeys() {
      this.setRefresh(this.refresh + 1);
    },
  },
};
</script>
