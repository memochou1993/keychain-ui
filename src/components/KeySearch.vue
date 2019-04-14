<template>
  <div>
    <v-text-field
      v-model="query"
      hide-details
      solo-inverted
      class="mx-3"
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
