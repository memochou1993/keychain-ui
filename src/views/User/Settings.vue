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
                        Access Control
                      </v-subheader>
                      <v-switch
                        v-model="strict"
                        color="primary"
                        label="Always ask password"
                      />
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item
                  transition="fade"
                  reverse-transition="fade"
                  value="authentication"
                >
                  <v-card
                    flat
                  >
                    <v-card-text>
                      <v-subheader
                        class="pa-0"
                      >
                        Remember Me Expiration
                        <v-tooltip
                          right
                          color="warning lighten-2"
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
                        :tick-labels="['1 day', '7 days', '14 days']"
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
                        Paging Type
                      </v-subheader>
                      <v-radio-group
                        v-model="paging"
                        row
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
                        Colors
                        <v-tooltip
                          right
                          color="warning lighten-2"
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
                          {{ hints.theme }}
                        </v-tooltip>
                      </v-subheader>
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
              Reset
            </v-btn>
            <v-spacer />
            <v-btn
              :disabled="loading"
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
      tab: '',
      tabs: [
        {
          href: 'general',
          title: 'General',
        },
        {
          href: 'authentication',
          title: 'Authentication',
        },
        {
          href: 'pagination',
          title: 'Pagination',
        },
        {
          href: 'theme',
          title: 'Theme',
        },
      ],
      strict: false,
      keepDays: 7,
      paging: 'loadMoreButton',
      theme: 'indigo',
      hints: {
        keepDays: 'This setting will take effect on next login.',
        theme: 'This setting will take effect after reloading the page.',
      },
    };
  },
  computed: {
    ...mapState([
      'settings',
    ]),
    ...mapGetters([
      'defaultLock',
      'defaultStrict',
      'defaultKeep',
      'defaultKeepDays',
      'defaultPaging',
      'defaultPaginate',
      'defaultTheme',
    ]),
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
    setTab(tab) {
      this.tab = tab;
    },
    setStrict(strict) {
      this.strict = strict;
    },
    setKeepDays(keepDays) {
      this.keepDays = keepDays;
    },
    setpaging(paging) {
      this.paging = paging;
    },
    setTheme(theme) {
      this.theme = theme;
    },
    setHints(hints) {
      this.hints = hints;
    },
    fillSettings() {
      this.setStrict(this.defaultStrict);
      this.setKeepDays(this.defaultKeepDays);
      this.setpaging(this.defaultPaging);
      this.setTheme(this.defaultTheme);
    },
    resetSettings() {
      this.fillSettings();
    },
    saveSettings() {
      this.setLoading(true);
      this.setTab(this.tab);
      const settings = {
        lock: this.defaultLock,
        strict: this.strict,
        keep: this.defaultKeep,
        keepDays: this.keepDays || 1,
        paging: this.paging,
        paginate: this.defaultPaginate,
        theme: this.theme,
      };
      cache.set('settings', settings);
      this.setSettings(cache.get('settings'));
      setTimeout(() => {
        this.setLoading(false);
      }, 1000 * 0.5);
    },
  },
};
</script>
