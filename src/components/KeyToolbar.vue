<template>
  <div>
    <v-toolbar
      :height="70"
      color="elevation-1 secondary lighten-4"
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          xs6
          md4
        >
          <div
            class="hidden-sm-and-up"
          >
            <v-btn
              :disabled="!loaded"
              color="primary"
              fab
              small
              outline
              class="pa-0"
              @click="createKey"
            >
              <v-icon>
                mdi-plus
              </v-icon>
            </v-btn>
            <v-btn
              :disabled="!loaded"
              color="primary"
              fab
              small
              outline
              @click="refreshKeys"
            >
              <v-icon>
                mdi-refresh
              </v-icon>
            </v-btn>
          </div>
          <div
            class="hidden-xs-only"
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
          </div>
        </v-flex>
        <v-flex
          xs6
          offset-xs0
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
      'loaded',
      'refresh',
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
