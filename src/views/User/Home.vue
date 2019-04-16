<template>
  <div>
    <v-layout
      row
      wrap
    >
      <v-flex
        md8
        offset-md2
      >
        <AppProgressLinear
          :color="error ? 'error' : noData ? 'warning' : 'success'"
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
                  {{ isVisible(props.item) ? props.item.content : '••••••••••' }}
                </div>
              </td>
              <td
                class="text-xs-center"
              >
                <v-btn
                  :disabled="!props.item.password"
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
                class="text-xs-center"
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
              v-if="settings.pagination"
            >
              <v-pagination
                v-model="page"
                :length="pages"
                :total-visible="breakpoint.lgAndUp ? 9 : 5"
                @input="getKeys"
              />
            </div>
            <div
              v-else
              ref="ask"
              v-scroll="scrollKeys"
            >
              <AppProgressCircular
                v-show="keys.length"
                :color="isLastPage ? 'warning' : 'primary'"
                :loading="asking"
              />
            </div>
          </div>
        </div>
        <component
          :is="`KeyDialog${capitalize(dialogs[0])}`"
          v-if="dialogs.length"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState, mapActions, mapGetters } from 'vuex';
import helper from '@/helpers/helper';
import AppProgressLinear from '@/components/AppProgressLinear.vue';
import AppProgressCircular from '@/components/AppProgressCircular.vue';
import AppNoData from '@/components/AppNoData.vue';
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
    KeyMenu,
    KeyDialogCreate,
    KeyDialogUnlock,
    KeyDialogView,
    KeyDialogEdit,
  },
  mixins: [
    helper,
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
      asking: false,
      loading: false,
      noData: false,
      error: null,
    };
  },
  computed: {
    ...mapState('key', [
      'keys',
      'pages',
      'scrollable',
      'approved',
      'unlockedKeys',
      'exposedKeys',
      'deprecatedKeys',
      'dialogs',
      'settings',
    ]),
    ...mapState([
      'refresh',
      'query',
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
      this.setPage(1);
      this.getKeys();
    },
    refresh() {
      this.setPage(1);
      this.getKeys();
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
    noData(value) {
      if (value) {
        this.setScrollable(false);
      }
    },
  },
  created() {
    this.getKeys();
  },
  methods: {
    ...mapActions([
      'setRefresh',
    ]),
    ...mapActions('key', [
      'fetchKeys',
      'setApproved',
      'setAttemption',
      'setScrollable',
      'setUnlockedKeys',
      'setExposedKeys',
      'setDeprecatedKeys',
      'setSelectedKey',
      'setDialogs',
    ]),
    beforeProcess() {
      this.setLoading(true);
      this.setNoData(false);
      this.setError(null);
    },
    getKeys() {
      this.beforeProcess();
      this.fetchKeys({
        params: {
          with: '',
          paginate: 15,
          page: this.page,
          q: this.query,
        },
      })
        .then(({ data }) => {
          setTimeout(() => {
            this.process(data);
          }, 1000 * 1);
        })
        .catch((error) => {
          this.setNoData(true);
          this.setError(error);
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
    setLoading(loading) {
      this.loading = loading;
    },
    setNoData(noData) {
      this.noData = noData;
    },
    setError(error) {
      this.error = error;
    },
    setPage(page) {
      this.page = page;
    },
    setAsking(asking) {
      this.asking = asking;
    },
    isVisible(key) {
      return !key.password || this.exposedKeys.includes(key.id);
    },
    isLocked(key) {
      return key.password && !this.isApproved;
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
        return this.setDialogs([...this.dialogs, 'unlock']);
      }
      return this.setExposedKeys(this.isExposed(key)
        ? this.exposedKeys.filter(key => key !== key.id)
        : [...this.exposedKeys, key.id]);
    },
    scrollKeys: _.debounce(function () {
      const { innerHeight } = window;
      const isAsking = this.$refs.ask.getBoundingClientRect().top < innerHeight;
      this.setAsking(true);
      if (isAsking && !this.isLastPage) {
        this.setPage(this.page + 1);
        this.getKeys();
        return false;
      }
      setTimeout(() => {
        this.setAsking(false);
      }, 1000 * 1);
      return false;
    }, 1000 * 0.5),
  },
};
</script>

<style lang="stylus" scoped>
.content
  width: 125px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
</style>
