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
        sm6
      >
        <v-alert
          v-if="!loading"
          :value="!!error"
          type="error"
          outline
        >
          {{ errorMessage }}
        </v-alert>
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
                  :rules="[v => !!v || 'Username is required']"
                  :autofocus="!error"
                  type="text"
                  label="Username"
                  class="my-3"
                />
                <v-text-field
                  v-model="password"
                  :rules="[v => !!v || 'Password is required']"
                  :autofocus="!!error"
                  :append-icon="`mdi-format-letter-case${capsLock ? '-upper' : '-lower'}`"
                  type="password"
                  label="Password"
                  autocomplete
                  class="my-3"
                  @keyup="detectCapsLock"
                  @keydown="detectCapsLock"
                />
                <v-switch
                  v-model="keeper"
                  color="primary"
                  label="Remember me"
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
import cache from '@/helpers/cache';
import api from '@/mixins/api';
import helper from '@/mixins/helper';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppNoData,
  },
  mixins: [
    api,
    helper,
  ],
  data() {
    return {
      valid: false,
      errorMessage: 'Incorrect username or password',
      username: '',
      password: '',
      keeper: false,
    };
  },
  created() {
    cache.delete('keeper');
  },
  methods: {
    ...mapActions('auth', [
      'fetchToken',
    ]),
    setPassword(password) {
      this.password = password;
    },
    keep() {
      if (this.keeper) {
        cache.set('keeper', this.keeper);
      }
    },
    login() {
      this.keep();
      this.beforeProcess();
      this.fetchToken({
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
  },
};
</script>
