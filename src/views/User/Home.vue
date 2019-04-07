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
                <div
                  v-if="isVisible(props.item)"
                >
                  {{ props.item.content }}
                </div>
                <div
                  v-else
                >
                  ••••••••••••
                </div>
              </td>
              <td
                class="text-xs-center"
              >
                <v-btn
                  :disabled="!props.item.password"
                  icon
                  class="primary--text text--lighten-2"
                  @click="toggleVisibility(props.item)"
                >
                  <v-icon
                    v-if="isVisible(props.item)"
                  >
                    mdi-eye
                  </v-icon>
                  <v-icon
                    v-else
                  >
                    mdi-eye-off
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
          :selectedKey="selectedKey"
          @setSelectedKey="setSelectedKey"
          @setUnlockDialog="setUnlockDialog"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppProgressLinear from '@/components/AppProgressLinear.vue';
import AppNoData from '@/components/AppNoData.vue';
import KeyUnlockDialog from '@/components/KeyUnlockDialog.vue';
import KeyMenu from '@/components/KeyMenu.vue';

export default {
  components: {
    AppProgressLinear,
    AppNoData,
    KeyUnlockDialog,
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
      selectedKey: null,
      unlockDialog: false,
    };
  },
  computed: {
    ...mapState('key', [
      'keys',
      'pages',
    ]),
    ...mapState([
      'refresh',
      'query',
      'unlockedKeys',
      'visibleKeys',
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
  },
  created() {
    this.fetchKeys();
  },
  methods: {
    fetchKeys() {
      this.setLoading(true);
      this.setNoData(false);
      this.setError(null);
      this.$store.dispatch('key/fetchKeys', {
        params: {
          page: this.page,
          with: 'user',
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
    setRefresh(refresh) {
      this.$store.dispatch('setRefresh', refresh);
    },
    setSelectedKey(key) {
      this.selectedKey = key;
    },
    setUnlockDialog(unlockDialog) {
      this.unlockDialog = unlockDialog;
    },
    setVisibleKeys(visibleKeys) {
      this.$store.dispatch('setVisibleKeys', visibleKeys);
    },
    toggleVisibility(key) {
      if (!this.unlockedKeys.includes(key.id)) {
        this.setSelectedKey(key);
        this.setUnlockDialog(true);
        return true;
      }
      if (this.visibleKeys.includes(key.id)) {
        return this.setVisibleKeys(this.visibleKeys.filter(visibleKey => visibleKey !== key.id));
      }
      return this.setVisibleKeys(this.visibleKeys.concat(key.id));
    },
    isVisible(key) {
      if (!key.password) {
        return true;
      }
      if (!this.unlockedKeys.includes(key.id)) {
        return false;
      }
      return this.visibleKeys.includes(key.id);
    },
    onPageChange() {
      this.fetchKeys();
    },
  },
};
</script>
