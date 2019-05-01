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
                  :rules="rules.name"
                  :error-messages="errorMessages.name"
                  type="text"
                  label="Name"
                  autofocus
                  class="my-3"
                />
                <v-text-field
                  v-model="username"
                  :rules="rules.username"
                  :error-messages="errorMessages.username"
                  type="text"
                  label="Username"
                  class="my-3"
                />
                <v-text-field
                  v-model="email"
                  :rules="rules.email"
                  :error-messages="errorMessages.email"
                  type="text"
                  label="Email"
                  class="my-3"
                />
                <v-text-field
                  v-model="password"
                  :rules="rules.password"
                  :error-messages="errorMessages.password"
                  type="password"
                  label="Password"
                  autocomplete
                  class="my-3"
                />
                <v-text-field
                  v-model="confirmPassword"
                  :rules="rules.confirmPassword"
                  :error-messages="errorMessages.confirmPassword"
                  type="password"
                  label="Confirm password"
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
                Clear
              </v-btn>
              <v-spacer />
              <v-btn
                :disabled="!valid || loading"
                type="submit"
                color="primary"
                class="white--text"
              >
                Register
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
      message: '',
      valid: false,
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      rules: {
        name: [
          v => (v && !!v.trim()) || 'The name field is required.',
        ],
        username: [
          v => (v && !!v.trim()) || 'The username field is required.',
          v => (v && v.length >= 8) || 'The username must be at least 8 characters.',
          v => (v && !!v.match(/^[a-z0-9]+$/i)) || 'The username may only contain letters and numbers.',
        ],
        email: [
          v => (v && !!v.trim()) || 'The email is required.',
        ],
        password: [
          v => (v && !!v.trim()) || 'The password is required.',
          v => (v && v.length >= 8) || 'The password must be at least 8 characters.',
        ],
        confirmPassword: [
          v => (v && v === this.password) || 'The password confirmation does not match.',
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
    ]),
    async register() {
      await this.beforeProcess();
      await this.storeUser({
        params: {
          name: this.name,
          username: this.username,
          email: this.email,
          password: this.password,
        },
      })
        .then(() => {
          this.setMessage('Registered successfully.');
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
        const confirmPassword = 'Password confirmation doesn\'t match the password.';
        return this.setErrorMessages({ ...this.errorMessages, confirmPassword });
      }
      return this.register();
    }
  },
};
</script>
