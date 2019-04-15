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
                  {{ isToggled(props.item) ? props.item.content : bullets }}
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
                    {{ `mdi-eye${isToggled(props.item) ? '' : '-off'}` }}
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
              ref="load"
              v-scroll="scrollKeys"
            >
              <AppProgressCircular
                v-show="keys.length"
                :color="isLastPage ? 'warning' : 'primary'"
                :loading="loading"
              />
            </div>
          </div>
        </div>
        <KeyUnlockDialog
          v-if="dialog.unlock"
        />
        <KeyCreateDialog
          v-if="dialog.create"
        />
        <KeyViewDialog
          v-if="dialog.view"
        />
        <KeyEditDialog
          v-if="dialog.edit"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState, mapActions, mapGetters } from 'vuex';
import AppProgressLinear from '@/components/AppProgressLinear.vue';
import AppProgressCircular from '@/components/AppProgressCircular.vue';
import AppNoData from '@/components/AppNoData.vue';
import KeyMenu from '@/components/KeyMenu.vue';
import KeyUnlockDialog from '@/components/KeyUnlockDialog.vue';
import KeyCreateDialog from '@/components/KeyCreateDialog.vue';
import KeyViewDialog from '@/components/KeyViewDialog.vue';
import KeyEditDialog from '@/components/KeyEditDialog.vue';

export default {
  components: {
    AppProgressLinear,
    AppProgressCircular,
    AppNoData,
    KeyMenu,
    KeyUnlockDialog,
    KeyCreateDialog,
    KeyViewDialog,
    KeyEditDialog,
  },
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
      paginate: 15,
      page: 1,
      bullets: '••••••••••',
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
      'dialog',
      'settings',
    ]),
    ...mapState([
      'refresh',
      'query',
    ]),
    ...mapGetters('key', [
      'isApproved',
    ]),
    breakpoint() {
      return this.$vuetify.breakpoint;
    },
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
    deprecatedKeys(value) {
      if (value.length) {
        setTimeout(() => {
          this.setDeprecatedKeys([]);
        }, 1000 * 2.5);
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
      'setScrollable',
      'setApproved',
      'setAttemption',
      'setUnlockedKeys',
      'setExposedKeys',
      'setDeprecatedKeys',
      'setSelectedKey',
      'setUnlockDialog',
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
          paginate: this.paginate,
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
    isUnlocked(key) {
      if (this.isApproved) {
        return true;
      }
      return this.unlockedKeys.includes(key.id);
    },
    isExposed(key) {
      return this.exposedKeys.includes(key.id);
    },
    isToggled(key) {
      if (!key.password) {
        return true;
      }
      if (!this.isUnlocked(key)) {
        return false;
      }
      return this.exposedKeys.includes(key.id);
    },
    attempt(attemption, key) {
      this.setAttemption(attemption);
      this.setSelectedKey(key);
    },
    toggleKey(key) {
      this.attempt('toggle', key);
      if (!this.isUnlocked(key)) {
        return this.setUnlockDialog(true);
      }
      if (this.isExposed(key)) {
        return this.setExposedKeys(this.exposedKeys.filter(exposedKey => exposedKey !== key.id));
      }
      return this.setExposedKeys([...this.exposedKeys, key.id]);
    },
    scrollKeys: _.debounce(function () {
      const { innerHeight } = window;
      const isAsking = this.$refs.load.getBoundingClientRect().top < innerHeight;
      if (!isAsking) {
        return false;
      }
      if (!this.isLastPage) {
        this.setPage(this.page + 1);
        this.getKeys();
        return false;
      }
      this.setLoading(true);
      setTimeout(() => {
        this.setLoading(false);
      }, 1000);
      return false;
    }, 500),
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
