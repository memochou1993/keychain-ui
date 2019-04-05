<template>
  <div>
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
      >
        <AppProgressLinear
          :loading="loading"
          :error="error"
        />
        <v-card>
          <v-data-table
            :items="keys"
            :headers="headers"
            hide-actions
          >
            <template
              v-slot:items="props"
            >
              <td
                class="text-xs-left"
              >
                {{ props.item.title }}
              </td>
              <td
                class="text-xs-left"
              >
                ••••••••••••
              </td>
              <td
                class="text-xs-center"
              >
                <v-icon>
                  mdi-eye-off
                </v-icon>
              </td>
              <td
                class="text-xs-center"
              >
                <v-icon>
                  mdi-dots-horizontal
                </v-icon>
              </td>
            </template>
            <template
              v-slot:no-data
            >
              <AppNoData
                :noData="noData"
              />
            </template>
          </v-data-table>
        </v-card>
        <div
          class="text-xs-center my-3"
        >
          <v-pagination
            v-if="pages > 1"
            v-model="page"
            :length="pages"
            @input="onPageChange()"
          />
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppProgressLinear from '@/components/AppProgressLinear.vue';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppProgressLinear,
    AppNoData,
  },
  data() {
    return {
      headers: [
        {
          text: 'Key', value: 'name', align: 'left', sortable: false,
        },
        {
          text: 'Value', value: 'content', align: 'left', sortable: false,
        },
        {
          text: '', value: '', align: 'center', sortable: false,
        },
        {
          text: '', value: '', align: 'center', sortable: false,
        },
      ],
      keys: [],
      loading: false,
      noData: false,
      error: null,
      pages: 1,
      paginate: 10,
      page: 1,
      show: false,
    };
  },
  computed: {
    ...mapState([
      'refresh',
      'query',
    ]),
  },
  watch: {
    query() {
      this.fetchKeys();
    },
    refresh(value) {
      if (value) {
        this.fetchKeys();
      }
    },
  },
  created() {
    this.fetchKeys();
  },
  methods: {
    initializeData() {
      this.setLoading(false);
      this.setNoData(false);
      this.setError(null);
    },
    fetchKeys() {
      this.initializeData();
      this.$store.dispatch('key/fetchKeys', {
        params: {
          q: this.query,
          page: this.page,
          with: 'user',
          paginate: this.paginate,
        },
      })
        .then(({ data, meta }) => {
          setTimeout(() => {
            this.setKeys(data);
            this.setPages(meta.last_page);
            this.setNoData(data.length === 0);
          }, 250);
        })
        .catch((error) => {
          this.setNoData(true);
          this.setError(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 500);
        });
    },
    setKeys(keys) {
      this.keys = keys;
    },
    setPages(pages) {
      this.pages = pages;
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setNoData(noData) {
      this.noData = noData;
    },
    setError(error) {
      this.error = error;
    },
    onPageChange() {
      this.fetchKeys();
    },
  },
};
</script>
