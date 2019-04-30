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
                          :rules="[v => !!v || 'Name is required.']"
                          type="text"
                          label="Name"
                          autofocus
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
                          :rules="[v => !!v || 'Old password is required.']"
                          type="password"
                          label="Old password"
                          autocomplete
                          class="my-3"
                        />
                        <v-text-field
                          v-model="newPassword"
                          :rules="[v => v.length >= 8 || 'New password must be at least 8 characters.']"
                          type="password"
                          label="New password"
                          autocomplete
                          class="my-3"
                        />
                        <v-text-field
                          :rules="[v => v === newPassword || 'Password confirmation doesn\'t match the password.']"
                          type="password"
                          label="Old password"
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
              @click="resetUser"
            >
              Reset
            </v-btn>
            <v-spacer />
            <v-btn
              :disabled="disabled || loading"
              color="primary"
              class="white--text"
              @click="editUser"
            >
              Update
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
      tab: '',
      tabs: [
        {
          href: 'profile',
          title: 'Profile',
        },
        {
          href: 'password',
          title: 'Password',
        },
      ],
      validProfile: false,
      validPassword: false,
      name: '',
      oldPassword: '',
      newPassword: '',
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
  created() {
    this.getUser();
  },
  methods: {
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
          password: this.newPassword,
        },
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
    process() {
      this.fillUser();
    },
    setName(name) {
      this.name = name;
    },
    fillUser() {
      this.setName(this.user.name);
    },
    resetUser() {
      this.fillUser();
    },
  },
};
</script>
