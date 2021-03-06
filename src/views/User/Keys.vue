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
                <div
                  id="title"
                  class="ellipsis"
                >
                  {{ props.item.title }}
                </div>
              </td>
              <td
                class="text-xs-left"
              >
                <div
                  id="content"
                  class="ellipsis"
                >
                  {{ summarizeKey(props.item) }}
                </div>
              </td>
              <td
                class="text-xs-left"
              >
                <div
                  v-if="props.item.tags"
                >
                  <v-chip
                    v-for="(tag, index) in props.item.tags.split(',')"
                    :key="index"
                    small
                    outline
                    color="primary"
                    @click="queryKeys(tag)"
                  >
                    {{ tag }}
                  </v-chip>
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
                :message="$tc('messages.key.noData', 2)"
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
                id="require"
                :disabled="loading"
                color="primary"
                round
                outline
                @click="loadKeys"
              >
                <div
                  v-if="!loading"
                >
                  {{ $t('actions.load') }}
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
import paging from '@/mixins/paging';
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
    paging,
  ],
  data() {
    return {
      headers: [
        {
          text: this.$t('headers.title'), value: 'name', align: 'left', sortable: false,
        },
        {
          text: this.$t('headers.content'), value: 'content', align: 'left', sortable: false,
        },
        {
          text: this.$t('headers.tags'), value: 'tags', align: 'left', sortable: false,
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
      'defaultPaginate',
    ]),
    ...mapGetters('key', [
      'isApproved',
    ]),
    isLastPage() {
      return this.page === this.pages;
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
    window.scrollTo(0, 0);
    this.fillKeys();
  },
  methods: {
    ...mapMutations([
      'setQuery',
    ]),
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
    async getKeys(args = null) {
      await this.beforeProcess();
      await this.fetchKeys({
        params: {
          q: this.query,
          with: '',
          page: this.page,
          paginate: this.defaultPaginate,
        },
        args,
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
    summarizeKey(key) {
      return this.isVisible(key) ? this.replaceTags(key.content.split('\n')[0]) : '••••••••••';
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
    queryKeys(query) {
      this.setQuery(query);
    },
    askKeys() {
      this.setPage(this.page + 1);
      this.getKeys({
        push: true,
      });
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
range = 20px
title = 200px
content = 140px

.ellipsis
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
#require
  width 160px
#title
  width title - range * 0
#content
  width content - range * 0
@media screen and (max-width: 1264px)
  #title
    width title - range * 1
  #content
    width content - range * 1
@media screen and (max-width: 960px)
  #title
    width title - range * 2
  #content
    width content - range * 2
@media screen and (max-width: 600px)
  #title
    width title - range * 3
  #content
    width content - range * 3
</style>
