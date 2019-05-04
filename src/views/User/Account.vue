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
      >
        <v-alert
          v-if="!loading"
          :type="`${!!error ? 'error' : 'success'}`"
          :value="message"
          outline
        >
          {{ message }}
        </v-alert>
        <v-card>
          <v-card-text>
            <div
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
                  value="profile"
                >
                  <v-card
                    flat
                  >
                    <v-card-text>
                      <v-form
                        v-model="validProfile"
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
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item
                  transition="fade"
                  reverse-transition="fade"
                  value="password"
                >
                  <v-card
                    flat
                  >
                    <v-form
                      v-model="validPassword"
                    >
                      <v-card-text>
                        <v-text-field
                          v-model="oldPassword"
                          :label="$t('fields.oldPassword')"
                          :rules="rules.oldPassword"
                          :error-messages="errorMessages.oldPassword"
                          type="password"
                          autocomplete
                          class="my-3"
                        />
                        <v-text-field
                          v-model="newPassword"
                          :label="$t('fields.newPassword')"
                          :rules="rules.newPassword"
                          :error-messages="errorMessages.newPassword"
                          type="password"
                          autocomplete
                          class="my-3"
                        />
                        <v-text-field
                          v-model="confirmNewPassword"
                          :label="$t('fields.confirmNewPassword')"
                          :rules="rules.confirmNewPassword"
                          :error-messages="errorMessages.confirmNewPassword"
                          type="password"
                          autocomplete
                          class="my-3"
                        />
                      </v-card-text>
                    </v-form>
                  </v-card>
                </v-tab-item>
              </v-tabs>
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
              @click="resetAccount"
            >
              {{ $t('actions.reset') }}
            </v-btn>
            <v-spacer />
            <v-btn
              :disabled="disabled || loading"
              color="primary"
              class="white--text"
              @click="updateAccount"
            >
              {{ $t('actions.update') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
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
      tab: '',
      tabs: [
        {
          title: this.$t('tabs.profile'),
          href: 'profile',
        },
        {
          title: this.$t('tabs.password'),
          href: 'password',
        },
      ],
      validProfile: false,
      validPassword: false,
      name: '',
      username: '',
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      rules: {
        name: [
          v => (v && !!v.trim()) || this.vt('name', 'required'),
        ],
        username: [
          v => (v && !!v.trim()) || this.vt('username', 'required'),
          v => (v && v.length >= 8) || this.vt('username', 'min', 8),
          v => (v && !!v.match(/^[a-z0-9]+$/i)) || this.vt('username', 'alphaNum'),
        ],
        oldPassword: [
          v => (v && !!v.trim()) || this.vt('oldPassword', 'required'),
        ],
        newPassword: [
          v => (v && !!v.trim()) || this.vt('newPassword', 'required'),
          v => (v && v.length >= 8) || this.vt('newPassword', 'min', 8),
        ],
        confirmNewPassword: [
          v => (v && v === this.newPassword) || this.$t('rules.confirmNewPassword'),
        ],
      },
      errorMessages: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
    };
  },
  computed: {
    ...mapState('user', [
      'user',
    ]),
    isProfile() {
      return this.tab === 'profile';
    },
    isPassword() {
      return this.tab === 'password';
    },
    disabled() {
      if (this.isProfile) {
        return !this.validProfile;
      }
      if (this.isPassword) {
        return !this.validPassword;
      }
      return true;
    },
  },
  watch: {
    tab() {
      this.setError(null);
      this.setMessage('');
      if (this.isProfile) {
        this.fillPassword();
      }
      if (this.isPassword) {
        this.fillUser();
      }
    },
    name() {
      const name = '';
      this.setErrorMessages({ ...this.errorMessages, name });
    },
    username() {
      const username = '';
      this.setErrorMessages({ ...this.errorMessages, username });
    },
    oldPassword() {
      const oldPassword = '';
      this.setErrorMessages({ ...this.errorMessages, oldPassword });
    },
    newPassword() {
      const newPassword = '';
      this.setErrorMessages({ ...this.errorMessages, newPassword });
    },
    confirmNewPassword() {
      const confirmNewPassword = '';
      this.setErrorMessages({ ...this.errorMessages, confirmNewPassword });
    },
  },
  created() {
    this.getUser();
  },
  methods: {
    ...mapActions('auth', [
      'resetPassword',
    ]),
    ...mapActions('user', [
      'fetchUser',
      'updateUser',
    ]),
    async getUser() {
      await this.beforeProcess();
      await this.fetchUser({
        params: {
          with: '',
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
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 1000 * 0.25);
        });
    },
    async editUser() {
      await this.beforeProcess();
      await this.updateUser({
        params: {
          with: '',
          name: this.name,
          username: this.username,
          old_password: this.oldPassword,
          new_password: this.newPassword,
        },
      })
        .then(() => {
          this.setMessage(this.$t('messages.profile.update.success'));
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
    async editPassword() {
      await this.beforeProcess();
      await this.resetPassword({
        params: {
          with: '',
          name: this.name,
          username: this.username,
          old_password: this.oldPassword,
          new_password: this.newPassword,
        },
      })
        .then(() => {
          this.setMessage(this.$t('messages.password.update.success'));
          this.fillPassword();
        })
        .catch((error) => {
          const oldPassword = this.$t('messages.password.update.failed');
          this.setErrorMessages({ ...this.errorMessages, oldPassword });
          this.setError(error);
          this.setNoData(true);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 1000 * 0.25);
        });
    },
    process() {
      this.fillUser();
    },
    setMessage(message) {
      this.message = message;
    },
    setName(name) {
      this.name = name;
    },
    setUsername(username) {
      this.username = username;
    },
    setOldPassword(oldPassword) {
      this.oldPassword = oldPassword;
    },
    setNewPassword(newPassword) {
      this.newPassword = newPassword;
    },
    setConfirmNewPassword(confirmNewPassword) {
      this.confirmNewPassword = confirmNewPassword;
    },
    setErrorMessages(errorMessages) {
      this.errorMessages = errorMessages;
    },
    fillUser() {
      this.setName(this.user.name);
      this.setUsername(this.user.username);
    },
    fillPassword() {
      this.setOldPassword('');
      this.setNewPassword('');
      this.setConfirmNewPassword('');
    },
    resetAccount() {
      if (this.isProfile) {
        this.fillUser();
      }
      if (this.isPassword) {
        this.fillPassword();
      }
    },
    updateAccount() {
      if (this.isProfile) {
        this.editUser();
      }
      if (this.isPassword) {
        if (this.newPassword !== this.confirmNewPassword) {
          const confirmNewPassword = this.$t('rules.confirmNewPassword');
          return this.setErrorMessages({ ...this.errorMessages, confirmNewPassword });
        }
        this.editPassword();
      }
      return true;
    },
  },
};
</script>
