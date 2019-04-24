<template>
  <div>
    <v-text-field
      v-model="query"
      solo
      clearable
      placeholder="Search"
      hide-details
    />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapMutations } from 'vuex';

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
    ...mapMutations([
      'setQuery',
    ]),
    queryKeys: _.debounce(function () {
      this.setQuery(this.query);
    }, 1000 * 0.75),
  },
};
</script>
