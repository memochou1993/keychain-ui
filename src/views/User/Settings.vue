<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout
      row
      wrap
      align-center
      justify-center
    >
      <v-flex
        md6
      >
        <v-card>
          <v-card-text>
            <v-form
              v-if="!loading"
              ref="form"
              v-model="valid"
            >
              <v-subheader>
                Theme
              </v-subheader>
              <v-card-text
                class="py-0"
              >
                <v-radio-group
                  v-model="theme"
                  row
                >
                  <v-radio
                    color="primary"
                    label="Indigo"
                    value="indigo"
                  />
                  <v-radio
                    color="primary"
                    label="Blue"
                    value="blue"
                  />
                  <v-radio
                    color="primary"
                    label="Cyan"
                    value="cyan"
                  />
                  <v-radio
                    color="primary"
                    label="Teal"
                    value="teal"
                  />
                </v-radio-group>
              </v-card-text>
              <v-subheader>
                Remember Me Expiration
              </v-subheader>
              <v-card-text
                class="py-0"
              >
                <span
                  class="secondary--text"
                >
                  This setting will take effect on next login.
                </span>
                <v-slider
                  v-model="keepDays"
                  :min="0"
                  :max="14"
                  :step="7"
                  :tick-labels="[1, 7, 14]"
                />
              </v-card-text>
              <v-subheader>
                Strict Mode
              </v-subheader>
              <v-card-text
                class="py-0"
              >
                <v-switch
                  v-model="strict"
                  color="primary"
                />
              </v-card-text>
              <v-subheader>
                Pagination
              </v-subheader>
              <v-card-text
                class="py-0"
              >
                <v-switch
                  v-model="pagination"
                  color="primary"
                />
              </v-card-text>
              <v-subheader>
                Items per Page
              </v-subheader>
              <v-card-text
                class="py-0"
              >
                <v-slider
                  v-model="paginate"
                  :min="10"
                  :max="20"
                  :step="5"
                  :tick-labels="[10, 15, 20]"
                />
              </v-card-text>
            </v-form>
            <AppNoData
              v-else
            />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn
              :disabled="loading"
              flat
              color="primary"
              @click="resetSettings"
            >
              Reset
            </v-btn>
            <v-spacer />
            <v-btn
              :disabled="!valid || loading"
              color="primary"
              class="white--text"
              @click="saveSettings"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import cache from '@/helpers/cache';
import AppNoData from '@/components/AppNoData.vue';
import { mapMutations } from 'vuex';

export default {
  components: {
    AppNoData,
  },
  data() {
    return {
      loading: false,
      valid: false,
      theme: 'indigo',
      keepDays: 7,
      strict: false,
      pagination: false,
      paginate: 15,
    };
  },
  computed: {
    settings() {
      return {
        theme: this.theme,
        auth: {
          keepDays: this.keepDays || 1,
        },
        key: {
          strict: this.strict,
          pagination: this.pagination,
          paginate: this.paginate,
        },
      };
    },
  },
  created() {
    this.fillSettings();
  },
  methods: {
    ...mapMutations([
      'setSettings',
    ]),
    setLoading(loading) {
      this.loading = loading;
    },
    setTheme(theme) {
      this.theme = theme;
    },
    setKeepDays(keepDays) {
      this.keepDays = keepDays;
    },
    setStrict(strict) {
      this.strict = strict;
    },
    setPagination(pagination) {
      this.pagination = pagination;
    },
    setPaginate(paginate) {
      this.paginate = paginate;
    },
    changeTheme() {
      const settings = cache.get('settings');
      if (settings && this.theme !== settings.data.theme) {
        setTimeout(() => {
          this.$router.go(0);
        }, 1000 * 0.75);
      }
    },
    fillSettings() {
      const settings = cache.get('settings');
      if (settings) {
        this.setTheme(settings.data.theme);
        this.setKeepDays(settings.data.auth.keepDays);
        this.setStrict(settings.data.key.strict);
        this.setPagination(settings.data.key.pagination);
        this.setPaginate(settings.data.key.paginate);
        return true;
      }
      return false;
    },
    resetSettings() {
      if (!this.fillSettings()) {
        this.setTheme('indigo');
        this.setKeepDays(7);
        this.setStrict(false);
        this.setPagination(false);
        this.setPaginate(15);
      }
    },
    saveSettings() {
      this.setLoading(true);
      this.changeTheme();
      cache.set('settings', this.settings);
      this.setSettings(cache.get('settings'));
      setTimeout(() => {
        this.setLoading(false);
      }, 1000 * 0.5);
    },
  },
};
</script>
