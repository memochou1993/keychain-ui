<template>
  <div>
    <v-text-field
      v-model="query"
      :disabled="!keys.length"
      flat
      hide-details
      solo-inverted
      append-icon="mdi-file-search-outline"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      query: '',
    };
  },
  computed: {
    ...mapState('key', [
      'keys',
    ]),
  },
  watch: {
    query() {
      this.queryKeys();
    },
  },
  methods: {
    ...mapActions([
      'setQuery',
    ]),
    ...mapActions('key', [
      'setKeys',
      'setScroll',
    ]),
    queryKeys: _.debounce(function () {
      this.setQuery(this.query);
      this.setKeys([]);
      this.setScroll(true);
    }, 500),
  },
};
</script>
