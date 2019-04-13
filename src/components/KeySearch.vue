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
import { mapActions } from 'vuex';
import _ from 'lodash';

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
      'setScroll',
    ]),
    queryKeys: _.debounce(function () {
      this.setQuery(this.query);
      this.setScroll(true);
    }, 250),
  },
};
</script>
