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
              v-if="pagination"
            >
              <v-pagination
                v-model="page"
                :length="pages"
                @input="getKeys"
              />
            </div>
            <div
              v-else
              ref="more"
              v-scroll="scrollKeys"
            >
              <AppProgressCircular
                v-show="!noData && keys.length"
                :loading="loading"
              />
            </div>
          </div>
        </div>
        <KeyCreateDialog
          v-if="createDialog"
        />
        <KeyUnlockDialog
          v-if="unlockDialog"
        />
        <KeyViewDialog
          v-if="viewDialog"
        />
        <KeyEditDialog
          v-if="editDialog"
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
import KeyCreateDialog from '@/components/KeyCreateDialog.vue';
import KeyUnlockDialog from '@/components/KeyUnlockDialog.vue';
import KeyViewDialog from '@/components/KeyViewDialog.vue';
import KeyEditDialog from '@/components/KeyEditDialog.vue';

export default {
  components: {
    AppProgressLinear,
    AppProgressCircular,
    AppNoData,
    KeyMenu,
    KeyCreateDialog,
    KeyUnlockDialog,
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
      'pagination',
      'scroll',
      'pages',
      'approval',
      'unlockedKeys',
      'exposedKeys',
      'deprecatedKeys',
      'createDialog',
      'unlockDialog',
      'viewDialog',
      'editDialog',
    ]),
    ...mapState([
      'refresh',
      'query',
    ]),
    ...mapGetters('key', [
      'isApproved',
    ]),
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
    approval(value) {
      if (value) {
        setTimeout(() => {
          this.setApproval(false);
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
        this.setScroll(false);
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
      'setScroll',
      'setApproval',
      'setAction',
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
    attempt(action, key) {
      this.setAction(action);
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
      if (!this.noData && this.$refs.more.getBoundingClientRect().top < innerHeight) {
        this.setPage(this.page + 1);
        this.getKeys();
      }
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
