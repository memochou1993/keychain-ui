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
              <div>
                <v-subheader>
                  Color Theme
                </v-subheader>
                <v-card-text
                  class="py-0"
                >
                  <v-radio-group
                    v-model="theme"
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
              </div>
              <div>
                <v-subheader>
                  Remember Me Expiration
                </v-subheader>
                <v-card-text
                  class="py-0"
                >
                  <span
                    v-show="hints.keepDays"
                    class="warning--text"
                  >
                    This setting will take effect on next login.
                  </span>
                  <v-slider
                    v-model="keepDays"
                    :min="0"
                    :max="14"
                    :step="7"
                    :tick-labels="['1 day', '7 days', '14 days']"
                  />
                </v-card-text>
              </div>
              <div>
                <v-subheader>
                  Access Control
                </v-subheader>
                <v-card-text
                  class="py-0"
                >
                  <v-switch
                    v-model="strict"
                    color="primary"
                    label="Always ask password"
                  />
                </v-card-text>
              </div>
              <div>
                <v-subheader>
                  Pagination
                </v-subheader>
                <v-card-text
                  class="py-0"
                >
                  <v-radio-group
                    v-model="paging"
                  >
                    <v-radio
                      color="primary"
                      label="Load More Button"
                      value="loadMoreButton"
                    />
                    <v-radio
                      color="primary"
                      label="Pagination"
                      value="pagination"
                    />
                    <v-radio
                      color="primary"
                      label="Infinite Scroll"
                      value="infiniteScroll"
                    />
                  </v-radio-group>
                </v-card-text>
              </div>
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
import { mapState, mapGetters, mapMutations } from 'vuex';
import AppNoData from '@/components/AppNoData.vue';

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
      paging: 'loadMoreButton',
      hints: {
        keepDays: false,
      },
    };
  },
  computed: {
    ...mapState([
      'settings',
    ]),
    ...mapGetters([
      'defaultTheme',
      'defaultAuthKeep',
      'defaultAuthKeepDays',
      'defaultKeyLock',
      'defaultKeyStrict',
      'defaultPaging',
      'defaultPaginate',
    ]),
  },
  watch: {
    keepDays() {
      let hints = {
        keepDays: false,
      };
      if (!this.settings || this.keepDays !== this.defaultAuthKeepDays) {
        hints = {
          keepDays: true,
        };
      }
      this.setHints({ ...this.hints, ...hints });
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
    setpaging(paging) {
      this.paging = paging;
    },
    setHints(hints) {
      this.hints = hints;
    },
    changeTheme() {
      if (this.settings && this.theme !== this.defaultTheme) {
        setTimeout(() => {
          this.$router.go(0);
        }, 1000 * 0.75);
      }
    },
    fillSettings() {
      if (this.settings) {
        this.setTheme(this.defaultTheme);
        this.setKeepDays(this.defaultAuthKeepDays);
        this.setStrict(this.defaultKeyStrict);
        this.setpaging(this.defaultPaging);
        return true;
      }
      return false;
    },
    resetSettings() {
      if (!this.fillSettings()) {
        this.setTheme('indigo');
        this.setKeepDays(7);
        this.setStrict(false);
        this.setpaging('loadMoreButton');
      }
    },
    saveSettings() {
      this.setLoading(true);
      this.changeTheme();
      const settings = {
        theme: this.theme,
        auth: {
          keep: this.defaultAuthKeep,
          keepDays: this.keepDays || 1,
        },
        key: {
          lock: this.defaultKeyLock,
          strict: this.strict,
        },
        pagination: {
          paging: this.paging,
          paginate: this.defaultPaginate,
        },
      };
      cache.set('settings', settings);
      this.setSettings(cache.get('settings'));
      setTimeout(() => {
        this.setLoading(false);
      }, 1000 * 0.25);
    },
  },
};
</script>
