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
        sm10
        md8
      >
        <v-card>
          <v-card-text>
            <v-form
              v-if="!loading"
            >
              <v-tabs
                v-model="tab"
                fixed-tabs
              >
                <v-tab
                  v-for="(item, index) in tabs"
                  :key="index"
                  :href="`#${item.href}`"
                >
                  {{ item.title }}
                </v-tab>
                <v-tabs-slider
                  color="primary"
                />
                <v-tab-item
                  transition="fade"
                  reverse-transition="fade"
                  value="general"
                >
                  <v-card
                    flat
                  >
                    <v-card-text>
                      <v-subheader
                        class="pa-0"
                      >
                        {{ $t('settings.language') }}
                      </v-subheader>
                      <v-radio-group
                        v-model="language"
                        row
                      >
                        <v-radio
                          :label="$t('settings.en')"
                          color="primary"
                          value="en"
                        />
                        <v-radio
                          :label="$t('settings.zhTW')"
                          color="primary"
                          value="zhTW"
                        />
                        <v-radio
                          :label="$t('settings.ja')"
                          color="primary"
                          value="ja"
                        />
                      </v-radio-group>
                      <v-subheader
                        class="pa-0"
                      >
                        {{ $t('settings.accessControl') }}
                      </v-subheader>
                      <v-switch
                        v-model="strict"
                        :label="$t('settings.alwaysAskPassword')"
                        color="primary"
                      />
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item
                  transition="fade"
                  reverse-transition="fade"
                  value="login"
                >
                  <v-card
                    flat
                  >
                    <v-card-text>
                      <v-subheader
                        class="pa-0"
                      >
                        {{ $t('settings.rememberMeExpiration') }}
                        <v-tooltip
                          right
                          color="secondary"
                        >
                          <template
                            v-slot:activator="{ on }"
                          >
                            <v-icon
                              class="mx-2"
                              v-on="on"
                            >
                              mdi-information-outline
                            </v-icon>
                          </template>
                          {{ hints.keepDays }}
                        </v-tooltip>
                      </v-subheader>
                      <v-slider
                        v-model="keepDays"
                        :min="0"
                        :max="14"
                        :step="7"
                        :tick-labels="[
                          $tc('settings.day', 1),
                          $tc('settings.day', 7),
                          $tc('settings.day', 14),
                        ]"
                      />
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item
                  transition="fade"
                  reverse-transition="fade"
                  value="pagination"
                >
                  <v-card
                    flat
                  >
                    <v-card-text>
                      <v-subheader
                        class="pa-0"
                      >
                        {{ $t('settings.pagingType') }}
                      </v-subheader>
                      <v-radio-group
                        v-model="paging"
                        row
                      >
                        <v-radio
                          :label="$t('settings.loadMoreButton')"
                          color="primary"
                          value="loadMoreButton"
                        />
                        <v-radio
                          :label="$t('settings.pagination')"
                          color="primary"
                          value="pagination"
                        />
                        <v-radio
                          :label="$t('settings.infiniteScroll')"
                          color="primary"
                          value="infiniteScroll"
                        />
                      </v-radio-group>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item
                  transition="fade"
                  reverse-transition="fade"
                  value="theme"
                >
                  <v-card
                    flat
                  >
                    <v-card-text>
                      <v-subheader
                        class="pa-0"
                      >
                        {{ $t('settings.colors') }}
                      </v-subheader>
                      <v-radio-group
                        v-model="theme"
                        row
                      >
                        <v-radio
                          :label="$t('settings.indigo')"
                          :value="colors.indigo"
                          color="primary"
                        />
                        <v-radio
                          :label="$t('settings.blue')"
                          :value="colors.blue"
                          color="primary"
                        />
                        <v-radio
                          :label="$t('settings.cyan')"
                          :value="colors.cyan"
                          color="primary"
                        />
                        <v-radio
                          :label="$t('settings.teal')"
                          :value="colors.teal"
                          color="primary"
                        />
                      </v-radio-group>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs>
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
              {{ $t('actions.reset') }}
            </v-btn>
            <v-spacer />
            <v-btn
              :disabled="loading"
              color="primary"
              class="white--text"
              @click="saveSettings"
            >
              {{ $t('actions.save') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import colors from 'vuetify/lib/util/colors';
import {
  mapState, mapGetters, mapActions,
} from 'vuex';
import api from '@/mixins/api';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppNoData,
  },
  mixins: [
    api,
  ],
  data() {
    return {
      loading: false,
      tab: '',
      language: 'en',
      strict: false,
      keepDays: 7,
      paging: 'loadMoreButton',
      theme: 'indigo',
      colors,
      hints: {
        keepDays: this.$t('settings.hints.keepDays'),
      },
    };
  },
  computed: {
    ...mapState([
      'settings',
    ]),
    ...mapGetters([
      'defaultLanguage',
      'defaultLock',
      'defaultStrict',
      'defaultKeep',
      'defaultKeepDays',
      'defaultPaging',
      'defaultPaginate',
      'defaultTheme',
    ]),
    tabs() {
      return [
        {
          title: this.$t('tabs.general'),
          href: 'general',
        },
        {
          title: this.$t('tabs.login'),
          href: 'login',
        },
        {
          title: this.$t('tabs.pagination'),
          href: 'pagination',
        },
        {
          title: this.$t('tabs.theme'),
          href: 'theme',
        },
      ];
    },
  },
  created() {
    this.fillSettings();
  },
  methods: {
    ...mapActions('user', [
      'updateUser',
    ]),
    async editSettings() {
      await this.beforeProcess();
      await this.updateUser({
        params: {
          settings: JSON.stringify({
            language: this.language,
            lock: this.defaultLock,
            strict: this.strict,
            keep: this.defaultKeep,
            keepDays: this.keepDays || 1,
            paging: this.paging,
            paginate: this.defaultPaginate,
            theme: this.theme,
          }),
        },
      })
        .catch((error) => {
          this.setError(error);
          this.setNoData(true);
        })
        .finally(() => {
          setTimeout(() => {
            this.$i18n.locale = this.language;
            this.$vuetify.theme.primary = this.theme;
            this.setLoading(false);
          }, 1000 * 0.25);
        });
    },
    setLanguage(language) {
      this.language = language;
    },
    setStrict(strict) {
      this.strict = strict;
    },
    setKeepDays(keepDays) {
      this.keepDays = keepDays;
    },
    setPaging(paging) {
      this.paging = paging;
    },
    setTheme(theme) {
      this.theme = theme;
    },
    setHints(hints) {
      this.hints = hints;
    },
    fillSettings() {
      this.setLanguage(this.defaultLanguage);
      this.setStrict(this.defaultStrict);
      this.setKeepDays(this.defaultKeepDays);
      this.setPaging(this.defaultPaging);
      this.setTheme(this.defaultTheme);
    },
    resetSettings() {
      this.fillSettings();
    },
    saveSettings() {
      this.editSettings();
    },
  },
};
</script>
