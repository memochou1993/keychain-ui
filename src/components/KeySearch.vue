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
    queryKeys: _.debounce(function () {
      this.setQuery(this.query);
    }, 250),
  },
};
</script>
