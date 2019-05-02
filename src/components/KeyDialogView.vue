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
              id="content"
            >
              <span>{{ replaceTags(key.content) }}</span>
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
import {
  mapState, mapMutations, mapActions,
} from 'vuex';
import api from '@/mixins/api';
import dialog from '@/mixins/dialog';
import common from '@/mixins/common';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppNoData,
  },
  mixins: [
    api,
    dialog,
    common,
  ],
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
    ...mapMutations('key', [
      'setKey',
      'setDialog',
      'setSelectedKey',
    ]),
    ...mapActions('key', [
      'fetchKey',
    ]),
    async getKey() {
      await this.beforeProcess();
      await this.fetchKey({
        params: {
          with: '',
        },
      })
        .catch((error) => {
          this.setError(error);
          this.setNoData(true);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 1000 * 0.25);
        });
    },
    processed() {
      this.setKey(null);
      this.setDialog('');
      this.setSelectedKey(null);
    },
  },
};
</script>

<style lang="stylus" scoped>
#content
  white-space pre-wrap
  word-break break-all
</style>
