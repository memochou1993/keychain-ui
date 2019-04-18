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
        md4
      >
        <v-card>
          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="login"
          >
            <v-card-text>
              <div
                v-if="!loading"
              >
                <v-text-field
                  v-model="username"
                  :error="!!error"
                  :rules="[v => !!v || 'Username is required']"
                  type="username"
                  label="Username"
                  :autofocus="!error"
                  class="my-3"
                />
                <v-text-field
                  v-model="password"
                  :error="!!error"
                  :rules="[v => !!v || 'Password is required']"
                  :error-messages="errorMessages"
                  type="password"
                  label="Password"
                  :autofocus="!!error"
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
              {{valid}}
              <v-btn
                :disabled="!valid || loading"
                type="submit"
                color="primary"
                class="white--text"
              >
                Login
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
      valid: false,
      errorMessages: [],
      username: '',
      password: '',
    };
  },
  methods: {
    ...mapActions('auth', [
      'fetchToken',
    ]),
    setErrorMessages(errorMessages) {
      this.errorMessages = errorMessages;
    },
    setPassword(password) {
      this.password = password;
    },
    login() {
      this.beforeProcess();
      this.fetchToken({
        params: {
          username: this.username,
          password: this.password,
          grant_type: process.env.VUE_APP_API_GRANT_TYPE,
          client_id: process.env.VUE_APP_API_CLIENT_ID,
          client_secret: process.env.VUE_APP_API_CLIENT_SECRET,
        },
      })
        .then(() => {
          setTimeout(() => {
            this.processed();
          }, 1000 * 0.25);
        })
        .catch((error) => {
          this.setError(error);
          this.setNoData(true);
          this.setErrorMessages([...this.errorMessages, 'Incorrect username or password']);
        })
        .finally(() => {
          setTimeout(() => {
            this.setPassword('');
            this.setLoading(false);
          }, 1000 * 0.25);
        });
    },
    processed() {
      //
    },
  },
};
</script>
