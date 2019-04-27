<template>
  <v-container
    class="py-0"
  >
    <v-layout
      row
      wrap
      justify-center
    >
      <v-flex
        md10
      >
        <KeyToolbar
          class="my-3"
        />
        <AppProgressLinear
          :color="error ? 'error' : 'success'"
          :error="!!error"
          :loading="loading"
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
                <div
                  class="content"
                >
                  {{ isVisible(props.item) ? props.item.content.split('\n')[0] : '••••••••••' }}
                </div>
              </td>
              <td
                class="text-xs-center px-0"
              >
                <v-btn
                  :disabled="!props.item.lock"
                  icon
                  class="primary--text text--lighten-2"
                  @click="toggleKey(props.item)"
                >
                  <v-icon>
                    {{ `mdi-eye${isVisible(props.item) ? '' : '-off'}` }}
                  </v-icon>
                </v-btn>
              </td>
              <td
                class="text-xs-center px-0"
              >
                <KeyMenu
                  :selectedKey="props.item"
                />
              </td>
            </template>
            <template
              v-slot:no-data
            >
              <AppNoData
                :noData="noData"
                message="No keys found"
              />
            </template>
          </v-data-table>
        </v-card>
        <div
          class="text-xs-center my-4"
        >
          <div
            v-show="pages > 1"
          >
            <div
              v-if="isLoadMoreButton"
            >
              <v-btn
                v-show="!!keys.length && askable"
                :disabled="loading"
                color="primary"
                round
                outline
                class="require"
                @click="loadKeys"
              >
                <div
                  v-if="!loading"
                >
                  Load More
                </div>
                <AppProgressCircular
                  v-else
                  :size="20"
                />
              </v-btn>
            </div>
            <div
              v-if="isPagination"
            >
              <v-pagination
                v-model="page"
                :length="pages"
                :total-visible="breakpoint.lgAndUp ? 9 : 5"
                @input="getKeys"
              />
            </div>
            <div
              v-if="isInfiniteScroll"
              ref="ask"
              v-scroll="scrollKeys"
            >
              <AppProgressCircular
                v-show="!!keys.length"
                :color="isLastPage ? 'warning' : 'primary'"
                :loading="askable"
              />
            </div>
          </div>
        </div>
        <component
          :is="`KeyDialog${capitalize(dialog)}`"
          v-if="dialog"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from 'lodash';
import {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';
import api from '@/mixins/api';
import common from '@/mixins/common';
import AppProgressLinear from '@/components/AppProgressLinear.vue';
import AppProgressCircular from '@/components/AppProgressCircular.vue';
import AppNoData from '@/components/AppNoData.vue';
import KeyToolbar from '@/components/KeyToolbar.vue';
import KeyMenu from '@/components/KeyMenu.vue';
import KeyDialogCreate from '@/components/KeyDialogCreate.vue';
import KeyDialogUnlock from '@/components/KeyDialogUnlock.vue';
import KeyDialogView from '@/components/KeyDialogView.vue';
import KeyDialogEdit from '@/components/KeyDialogEdit.vue';

export default {
  components: {
    AppProgressLinear,
    AppProgressCircular,
    AppNoData,
    KeyToolbar,
    KeyMenu,
    KeyDialogCreate,
    KeyDialogUnlock,
    KeyDialogView,
    KeyDialogEdit,
  },
  mixins: [
    api,
    common,
  ],
  data() {
    return {
      headers: [
        {
          text: 'Title', value: 'name', align: 'left', sortable: false,
        },
        {
          text: 'Content', value: 'content', align: 'left', sortable: false,
        },
        {
          text: '', value: '', align: 'center', sortable: false,
        },
        {
          text: '', value: '', align: 'center', sortable: false,
        },
      ],
      page: 1,
      askable: true,
    };
  },
  computed: {
    ...mapState([
      'query',
      'refresh',
    ]),
    ...mapState('key', [
      'keys',
      'pages',
      'dialog',
      'approved',
      'unlockedKeys',
      'exposedKeys',
    ]),
    ...mapGetters([
      'defaultPaging',
      'defaultPaginate',
    ]),
    ...mapGetters('key', [
      'isApproved',
    ]),
    isLastPage() {
      return this.page === this.pages;
    },
    isLoadMoreButton() {
      return this.defaultPaging === 'loadMoreButton';
    },
    isPagination() {
      return this.defaultPaging === 'pagination';
    },
    isInfiniteScroll() {
      return this.defaultPaging === 'infiniteScroll';
    },
  },
  watch: {
    query() {
      this.fillKeys();
    },
    refresh() {
      this.fillKeys();
    },
    approved(value) {
      if (value) {
        setTimeout(() => {
          this.setApproved(false);
          this.setUnlockedKeys([]);
          this.setExposedKeys([]);
        }, 1000 * 300);
      }
    },
  },
  created() {
    this.fillKeys();
  },
  methods: {
    ...mapMutations('key', [
      'setKeys',
      'setDialog',
      'setApproved',
      'setAttemption',
      'setUnlockedKeys',
      'setExposedKeys',
      'pushExposedKeys',
      'filterExposedKeys',
      'setSelectedKey',
    ]),
    ...mapActions('key', [
      'fetchKeys',
    ]),
    async getKeys() {
      await this.beforeProcess();
      await this.fetchKeys({
        params: {
          q: this.query,
          with: '',
          page: this.page,
          paginate: this.defaultPaginate,
        },
      })
        .then(({ data }) => {
          setTimeout(() => {
            this.process(data);
          }, 1000 * 1);
        })
        .catch((error) => {
          this.setError(error);
          this.setNoData(true);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 1000 * 1);
        });
    },
    process(key) {
      this.setNoData(!key.length);
    },
    setPage(page) {
      this.page = page;
    },
    setAskable(askable) {
      this.askable = askable;
    },
    isVisible(key) {
      return !key.lock || this.exposedKeys.includes(key.id);
    },
    isLocked(key) {
      return key.lock && !this.isApproved;
    },
    isUnlocked(key) {
      return !this.isLocked(key) || this.unlockedKeys.includes(key.id);
    },
    isExposed(key) {
      return this.exposedKeys.includes(key.id);
    },
    attempt(attemption, key) {
      this.setAttemption(attemption);
      this.setSelectedKey(key);
    },
    toggleKey(key) {
      this.attempt('toggle', key);
      if (!this.isUnlocked(key)) {
        return this.setDialog('unlock');
      }
      return this.isExposed(key) ? this.filterExposedKeys(key.id) : this.pushExposedKeys(key.id);
    },
    fillKeys() {
      this.setKeys([]);
      this.setPage(1);
      this.setAskable(true);
      this.getKeys();
    },
    askKeys() {
      this.setPage(this.page + 1);
      this.getKeys();
    },
    loadKeys() {
      this.askKeys();
      if (this.isLastPage) {
        setTimeout(() => {
          this.setAskable(false);
        }, 1000 * 1);
      }
    },
    scrollKeys: _.throttle(function () {
      if (!this.$refs.ask) {
        return false;
      }
      const { innerHeight } = window;
      const asking = this.$refs.ask.getBoundingClientRect().top * 2 / 3 < innerHeight;
      if (asking && !this.isLastPage) {
        this.askKeys();
      }
      this.setAskable(true);
      if (this.isLastPage) {
        setTimeout(() => {
          this.setAskable(false);
        }, 1000 * 1);
      }
      return false;
    }, 1000 * 1),
  },
};
</script>

<style lang="stylus" scoped>
.require
  width 160px
.content
  width 280px
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
@media screen and (max-width: 1264px)
  .content
    width 220px
@media screen and (max-width: 960px)
  .content
    width 160px
@media screen and (max-width: 600px)
  .content
    width 100px
</style>
