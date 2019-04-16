<template>
  <div>
    <v-text-field
      v-model="query"
      flat
      label="Search"
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
      'setScrollable',
    ]),
    queryKeys: _.debounce(function () {
      this.setQuery(this.query);
      this.setScrollable(true);
    }, 1000 * 0.5),
  },
};
</script>
