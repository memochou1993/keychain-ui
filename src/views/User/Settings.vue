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
              <v-switch
                v-model="strict"
                color="primary"
                label="Strict"
              />
              <v-switch
                v-model="pagination"
                color="primary"
                label="Pagination"
              />
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
              @click="$refs.form.reset()"
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
      keepDays: 7,
      strict: false,
      paginate: 15,
      pagination: false,
    };
  },
  created() {
    const settings = cache.get('settings');
    if (settings) {
      this.setStrict(settings.data.key.strict);
      this.setPagination(settings.data.key.pagination);
    }
  },
  computed: {
    settings() {
      return {
        auth: {
          keepDays: this.keepDays,
        },
        key: {
          strict: this.strict,
          paginate: this.paginate,
          pagination: this.pagination,
        },
      };
    },
  },
  methods: {
    ...mapMutations([
      'setSettings',
    ]),
    setLoading(loading) {
      this.loading = loading;
    },
    setStrict(strict) {
      this.strict = strict;
    },
    setPagination(pagination) {
      this.pagination = pagination;
    },
    saveSettings() {
      this.setLoading(true);
      cache.set('settings', this.settings);
      this.setSettings(cache.get('settings'));
      setTimeout(() => {
        this.setLoading(false);
      }, 1000 * 0.5);
    },
  },
};
</script>
