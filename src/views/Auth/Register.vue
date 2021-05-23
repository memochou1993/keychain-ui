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
          v-if="message"
          :value="true"
          type="success"
          outline
        >
          {{ message }}
        </v-alert>
        <v-card
          v-else
        >
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
                  v-model="name"
                  :label="$t('fields.name')"
                  :rules="rules.name"
                  :error-messages="errorMessages.name"
                  type="text"
                  autofocus
                  class="my-3"
                />
                <v-text-field
                  v-model="username"
                  :label="$t('fields.username')"
                  :rules="rules.username"
                  :error-messages="errorMessages.username"
                  type="text"
                  class="my-3"
                />
                <v-text-field
                  v-model="email"
                  :label="$t('fields.email')"
                  :rules="rules.email"
                  :error-messages="errorMessages.email"
                  type="text"
                  class="my-3"
                />
                <v-text-field
                  v-model="password"
                  :label="$t('fields.password')"
                  :rules="rules.password"
                  :error-messages="errorMessages.password"
                  type="password"
                  autocomplete
                  class="my-3"
                />
                <v-text-field
                  v-model="confirmPassword"
                  :label="$t('fields.confirmPassword')"
                  :rules="rules.confirmPassword"
                  :error-messages="errorMessages.confirmPassword"
                  type="password"
                  autocomplete
                  class="my-3"
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
                {{ $t('actions.register') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import colors from 'vuetify/lib/util/colors';
import { mapActions } from 'vuex';
import api from '@/mixins/api';
import validation from '@/mixins/validation';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppNoData,
  },
  mixins: [
    api,
    validation,
  ],
  data() {
    return {
      message: '',
      valid: false,
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      settings: {
        language: 'en',
        lock: false,
        strict: false,
        keep: false,
        keepDays: 7,
        paging: 'loadMoreButton',
        paginate: 15,
        theme: colors.indigo,
      },
      rules: {
        name: [
          v => (v && !!v.trim()) || this.vt('name', 'required'),
        ],
        username: [
          v => (v && !!v.trim()) || this.vt('username', 'required'),
          v => (v && v.length >= 8) || this.vt('username', 'min', 8),
          v => (v && !!v.match(/^[a-z0-9]+$/i)) || this.vt('username', 'alphaNum'),
        ],
        email: [
          v => (v && !!v.trim()) || this.vt('email', 'required'),
          v => (v && !!v.match(/\S+@\S+\.\S+/)) || this.vt('email', 'email'),
        ],
        password: [
          v => (v && !!v.trim()) || this.vt('password', 'required'),
          v => (v && v.length >= 8) || this.vt('newPassword', 'min', 8),
        ],
        confirmPassword: [
          v => (v && v === this.password) || this.$t('rules.confirmNewPassword'),
        ],
      },
      errorMessages: {
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
    };
  },
  watch: {
    name() {
      const name = '';
      this.setErrorMessages({ ...this.errorMessages, name });
    },
    username() {
      const username = '';
      this.setErrorMessages({ ...this.errorMessages, username });
    },
    email() {
      const email = '';
      this.setErrorMessages({ ...this.errorMessages, email });
    },
    password() {
      const password = '';
      this.setErrorMessages({ ...this.errorMessages, password });
    },
    confirmPassword() {
      const confirmPassword = '';
      this.setErrorMessages({ ...this.errorMessages, confirmPassword });
    },
  },
  methods: {
    ...mapActions('auth', [
      'storeUser',
      'verify',
    ]),
    async register() {
      await this.beforeProcess();
      const { success } = await this.verify({
        params: {
          token: await this.getRecaptchaToken('register'),
        },
      });
      if (!success) {
        this.setLoading(false);
        return;
      }
      await this.storeUser({
        params: {
          name: this.name,
          username: this.username,
          email: this.email,
          password: this.password,
          settings: JSON.stringify(this.settings),
        },
      })
        .then(() => {
          this.setMessage(this.$t('messages.register.success'));
        })
        .catch((error) => {
          this.setErrorMessages(error.response.data.errors);
          this.setError(error);
          this.setNoData(true);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 1000 * 0.25);
        });
    },
    setMessage(message) {
      this.message = message;
    },
    setErrorMessages(errorMessages) {
      this.errorMessages = errorMessages;
    },
    submit() {
      if (this.password !== this.confirmPassword) {
        const confirmPassword = this.$t('rules.confirmPassword');
        return this.setErrorMessages({ ...this.errorMessages, confirmPassword });
      }
      return this.register();
    },
  },
};
</script>
