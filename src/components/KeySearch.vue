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

export default {
  data() {
    return {
      query: '',
    };
  },
  watch: {
    query() {
      this.search();
    },
  },
  methods: {
    search: _.debounce(function anonymous() {
      this.setQuery(this.query);
    }, 250),
    setQuery(query) {
      this.$store.dispatch('setQuery', query);
    },
  },
};
</script>
