<template>
  <div>
    <v-dialog
      v-model="dialog"
      :max-width="400"
    >
      <v-card>
        <v-card-text>
          <v-form
            v-if="!loading"
            @submit.prevent="update"
          >
            {{ key.title }}
          </v-form>
          <AppNoData
            v-else
            :noData="noData"
            item="key"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppNoData,
  },
  data() {
    return {
      dialog: true,
      loading: false,
      noData: false,
      error: null,
    };
  },
  computed: {
    ...mapState('key', [
      'key',
    ]),
  },
  watch: {
    dialog(value) {
      if (!value) {
        this.fetched();
      }
    },
  },
  created() {
    this.fetchKey();
  },
  methods: {
    beforeFetch() {
      this.setLoading(true);
      this.setNoData(false);
      this.setError(null);
    },
    fetchKey() {
      this.beforeFetch();
      this.$store.dispatch('key/fetchKey', {
        params: {
          with: 'user',
        },
      })
        .catch((error) => {
          this.setNoData(true);
          this.setError(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 250);
        });
    },
    fetched() {
      this.setKey(null);
      this.setEditKey(false);
      this.setSelectedKey(null);
      this.setEditDialog(false);
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
    setKey(key) {
      this.$store.dispatch('key/setKey', key);
    },
    setEditKey(editKey) {
      this.$store.dispatch('key/setEditKey', editKey);
    },
    setSelectedKey(selectedKey) {
      this.$store.dispatch('key/setSelectedKey', selectedKey);
    },
    setEditDialog(editDialog) {
      this.$store.dispatch('key/setEditDialog', editDialog);
    },
  },
};
</script>
