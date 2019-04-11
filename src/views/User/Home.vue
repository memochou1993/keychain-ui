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
                  v-if="isExposed(props.item)"
                >
                  <KeyChip
                    :selectedKey="props.item"
                  />
                </div>
                <div
                  v-else
                >
                  {{ bullets }}
                </div>
              </td>
              <td
                class="text-xs-center"
              >
                <v-btn
                  :disabled="!props.item.password"
                  icon
                  class="primary--text text--lighten-2"
                  @click="viewKey(props.item)"
                >
                  <v-icon>
                    {{ `mdi-eye${isExposed(props.item) ? '' : '-off'}` }}
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
                item="keys"
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
            @input="onPageChange"
          />
        </div>
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
import { mapState, mapActions } from 'vuex';
import AppProgressLinear from '@/components/AppProgressLinear.vue';
import AppNoData from '@/components/AppNoData.vue';
import KeyUnlockDialog from '@/components/KeyUnlockDialog.vue';
import KeyViewDialog from '@/components/KeyViewDialog.vue';
import KeyEditDialog from '@/components/KeyEditDialog.vue';
import KeyChip from '@/components/KeyChip.vue';
import KeyMenu from '@/components/KeyMenu.vue';

export default {
  components: {
    AppProgressLinear,
    AppNoData,
    KeyUnlockDialog,
    KeyViewDialog,
    KeyEditDialog,
    KeyChip,
    KeyMenu,
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
      paginate: 10,
      page: 1,
      loading: false,
      noData: false,
      error: null,
      bullets: '••••••••••',
    };
  },
  computed: {
    ...mapState('key', [
      'keys',
      'pages',
      'unlockedKeys',
      'exposedKeys',
      'deprecatedKeys',
      'unlockDialog',
      'viewDialog',
      'editDialog',
    ]),
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
        this.setRefresh(false);
      }
    },
    deprecatedKeys(value) {
      if (value.length > 0) {
        setTimeout(() => {
          this.setDeprecatedKeys([]);
        }, 2500);
      }
    },
  },
  created() {
    this.fetchKeys();
  },
  methods: {
    ...mapActions([
      'setRefresh',
    ]),
    ...mapActions('key', [
      'setAttempt',
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
    fetchKeys() {
      this.beforeProcess();
      this.$store.dispatch('key/fetchKeys', {
        params: {
          with: '',
          page: this.page,
          paginate: this.paginate,
          q: this.query,
        },
      })
        .then(({ data }) => {
          this.setNoData(data.length === 0);
        })
        .catch((error) => {
          this.setNoData(true);
          this.setError(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 1000);
        });
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
    viewKey(key) {
      this.setAttempt('view');
      this.setSelectedKey(key);
      if (!this.isUnlocked(key)) {
        return this.setUnlockDialog(true);
      }
      if (this.exposedKeys.includes(key.id)) {
        return this.setExposedKeys(this.exposedKeys.filter(exposedKey => exposedKey !== key.id));
      }
      return this.setExposedKeys(this.exposedKeys.concat(key.id));
    },
    isUnlocked(key) {
      return this.unlockedKeys.includes(key.id);
    },
    isExposed(key) {
      if (!key.password) {
        return true;
      }
      if (!this.isUnlocked(key)) {
        return false;
      }
      return this.exposedKeys.includes(key.id);
    },
    onPageChange() {
      this.fetchKeys();
    },
  },
};
</script>
