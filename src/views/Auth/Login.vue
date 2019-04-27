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
          :value="!!error || isSuspended"
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
                  :rules="[v => !!v || 'Username is required.']"
                  :autofocus="!error"
                  type="text"
                  label="Username"
                  class="my-3"
                />
                <v-text-field
                  v-model="password"
                  :rules="[v => !!v || 'Password is required.']"
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
                  v-model="keep"
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
                :disabled="!valid || loading || isSuspended"
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
import {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';
import cache from '@/helpers/cache';
import api from '@/mixins/api';
import common from '@/mixins/common';
import throttle from '@/mixins/throttle';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppNoData,
  },
  mixins: [
    api,
    common,
    throttle,
  ],
  data() {
    return {
      valid: false,
      username: '',
      password: '',
      keep: false,
    };
  },
  computed: {
    ...mapState([
      'settings',
    ]),
    ...mapGetters([
      'defaultKeep',
    ]),
    errorMessage() {
      return this.isSuspended
        ? `Too many login attempts. Please try again in ${this.counter} seconds.`
        : 'Incorrect username or password.';
    },
  },
  watch: {
    keep(value) {
      if (value !== this.defaultKeep) {
        const { data } = this.settings;
        data.keep = this.keep;
        cache.set('settings', data);
        this.setSettings(cache.get('settings'));
      }
    },
  },
  created() {
    this.setKeep(this.defaultKeep);
  },
  methods: {
    ...mapMutations([
      'setSettings',
    ]),
    ...mapActions('auth', [
      'fetchToken',
    ]),
    async login() {
      cache.set('settings', this.settings.data);
      this.setSettings(cache.get('settings'));
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
          this.suspend();
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
    setKeep(keep) {
      this.keep = keep;
    },
  },
};
</script>
