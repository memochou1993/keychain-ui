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
        sm6
        md4
      >
        <v-alert
          v-if="!!error"
          :value="true"
          type="error"
          outline
        >
          {{ message }}
        </v-alert>
        <v-card>
          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="submit"
          >
            <v-card-text>
              <div
                v-if="!loading"
              >
                <v-text-field
                  v-model="username"
                  :label="$t('fields.username')"
                  :rules="rules.username"
                  :autofocus="!error"
                  type="text"
                  class="my-3"
                />
                <v-text-field
                  v-model="password"
                  :label="$t('fields.password')"
                  :rules="rules.password"
                  :autofocus="!!error"
                  :append-icon="`mdi-format-letter-case${capsLock ? '-upper' : '-lower'}`"
                  type="password"
                  autocomplete
                  class="my-3"
                  @keyup="detectCapsLock"
                  @keydown="detectCapsLock"
                />
                <v-switch
                  v-model="keep"
                  :label="$t('fields.rememberMe')"
                  color="primary"
                />
              </div>
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
                {{ $t('actions.clear') }}
              </v-btn>
              <v-spacer />
              <v-btn
                :disabled="!valid || loading"
                type="submit"
                color="primary"
                class="white--text"
              >
                {{ $t('actions.login') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import api from '@/mixins/api';
import common from '@/mixins/common';
import validation from '@/mixins/validation';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppNoData,
  },
  mixins: [
    api,
    common,
    validation,
  ],
  data() {
    return {
      valid: false,
      username: '',
      password: '',
      keep: false,
      rules: {
        username: [
          v => (v && !!v.trim()) || this.vt('username', 'required'),
        ],
        password: [
          v => (v && !!v.trim()) || this.vt('password', 'required'),
        ],
      },
    };
  },
  computed: {
    message() {
      if (this.status === 401) {
        return this.$t('messages.login.failed');
      }
      if (this.status === 429) {
        return this.$t('messages.login.throttle');
      }
      return '';
    },
  },
  methods: {
    ...mapActions('auth', [
      'fetchToken',
    ]),
    async login() {
      await this.beforeProcess();
      await this.fetchToken({
        params: {
          username: this.username,
          password: this.password,
          grant_type: 'password',
          client_id: process.env.VUE_APP_API_CLIENT_ID,
          client_secret: process.env.VUE_APP_API_CLIENT_SECRET,
        },
      })
        .then(() => {
          setTimeout(() => {
            this.process();
          }, 1000 * 0.25);
        })
        .catch((error) => {
          this.setError(error);
          this.setNoData(true);
          this.setPassword('');
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 1000 * 0.25);
        });
    },
    process() {
      this.$router.push({
        name: 'user.keys',
      });
    },
    setPassword(password) {
      this.password = password;
    },
    submit() {
      this.login();
    },
  },
};
</script>
