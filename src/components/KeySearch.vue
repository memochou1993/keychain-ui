<template>
  <div>
    <v-text-field
      v-model="query"
      flat
      hide-details
      solo-inverted
    />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      query: '',
    };
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
