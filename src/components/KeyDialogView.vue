<template>
  <div>
    <v-dialog
      v-model="enabled"
      :max-width="400"
    >
      <v-card>
        <v-card-text>
          <div
            v-if="!loading"
            class="my-3"
          >
            <div
              class="content"
            >
              <span>{{ key.content }}</span>
            </div>
          </div>
          <AppNoData
            v-else
            :noData="noData"
            message="No key found"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppNoData,
  },
  data() {
    return {
      enabled: false,
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
    enabled(value) {
      if (!value) {
        this.processed();
      }
    },
  },
  created() {
    this.getKey();
  },
  mounted() {
    setTimeout(() => {
      this.setEnabled(true);
    }, 0);
  },
  methods: {
    ...mapActions('key', [
      'fetchKey',
      'setKey',
      'setSelectedKey',
      'setDialog',
    ]),
    beforeProcess() {
      this.setLoading(true);
      this.setNoData(false);
      this.setError(null);
    },
    getKey() {
      this.beforeProcess();
      this.fetchKey({
        params: {
          with: '',
        },
      })
        .catch((error) => {
          this.setNoData(true);
          this.setError(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 1000 * 0.25);
        });
    },
    processed() {
      this.setKey(null);
      this.setSelectedKey(null);
      this.setDialog('');
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
    setEnabled(enabled) {
      this.enabled = enabled;
    },
  },
};
</script>

<style lang="stylus" scoped>
.content {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
