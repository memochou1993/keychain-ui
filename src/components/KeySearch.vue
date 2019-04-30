<template>
  <div>
    <v-text-field
      v-model="input"
      solo
      clearable
      placeholder="Search"
      hide-details
    />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      input: '',
    };
  },
  computed: {
    ...mapState([
      'query',
    ]),
  },
  watch: {
    query(value) {
      this.setInput(value);
    },
    input() {
      this.queryKeys();
    },
  },
  created() {
    this.setInput(this.query);
  },
  methods: {
    ...mapMutations([
      'setQuery',
    ]),
    setInput(input) {
      this.input = input;
    },
    queryKeys: _.debounce(function () {
      this.setQuery(this.input);
    }, 1000 * 0.5),
  },
};
</script>
