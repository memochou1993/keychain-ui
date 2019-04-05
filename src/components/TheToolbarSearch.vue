<template>
  <div>
    <v-autocomplete
      v-model="select"
      :items="items"
      :loading="loading"
      :no-data-text="noDataText"
      :search-input.sync="input"
      flat
      dense
      clearable
      hide-details
      hide-no-data
      solo-inverted
      class="mx-3"
      @keyup.enter="setQuery(input)"
    />
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  data() {
    return {
      keys: [],
      loading: false,
      error: null,
      noDataText: '',
      select: '',
      input: '',
      query: '',
      color: 'orange lighten-2',
    };
  },
  computed: {
    items() {
      if (!this.input) {
        return [];
      }
      return this.keys
        .map((key) => {
          const reg = new RegExp(`\\w*${this.input}\\w*`, 'gi');
          const word = key.title.match(reg);
          return word ? word[0] : '';
        })
        .filter(word => word.length > 0);
    },
  },
  watch: {
    select(value) {
      if (value) {
        this.setQuery(value);
      }
    },
    input(value) {
      if (value) {
        this.search();
      }
    },
    query(value) {
      this.$store.dispatch('setQuery', value);
    },
  },
  methods: {
    search: _.debounce(function anonymous() {
      this.searchKeys();
    }, 500),
    searchKeys() {
      this.setLoading(this.color);
      this.$store.dispatch('key/fetchKeys', {
        params: {
          q: this.query,
          search: 1,
        },
      })
        .then(({ data }) => {
          this.keys = data;
        })
        .catch((error) => {
          this.setError(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 500);
        });
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setError(error) {
      this.error = error;
    },
    setQuery(query) {
      this.query = query;
    },
  },
};
</script>
