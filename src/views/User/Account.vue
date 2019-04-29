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
        sm8
        md6
      >
        <v-card>
          <v-card-text>
            <v-form
              v-if="!loading"
              v-model="valid"
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
                      <v-text-field
                        v-model="name"
                        :rules="[v => !!v || 'Name is required.']"
                        type="text"
                        label="Name"
                        autofocus
                        class="my-3"
                      />
                      <v-text-field
                        v-model="email"
                        :rules="[v => !!v || 'Email is required.']"
                        type="text"
                        label="Email"
                        class="my-3"
                      />
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
                    <v-card-text>
                      <v-text-field
                        v-model="oldPassword"
                        :rules="[v => !!v || 'Old password is required.']"
                        type="password"
                        label="Old password"
                        class="my-3"
                      />
                      <v-text-field
                        v-model="newPassword"
                        :rules="[v => v.length >= 8 || 'New password must be at least 8 characters.']"
                        type="password"
                        label="New password"
                        class="my-3"
                      />
                      <v-text-field
                        :rules="[v => v === newPassword || 'Password confirmation doesn\'t match the password.']"
                        type="password"
                        label="Old password"
                        class="my-3"
                      />
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
              @click="resetAccount"
            >
              Reset
            </v-btn>
            <v-spacer />
            <v-btn
              :disabled="!valid || loading"
              color="primary"
              class="white--text"
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
      valid: false,
      name: '',
      email: '',
      oldPassword: '',
      newPassword: '',
    };
  },
  computed: {
    ...mapState('user', [
      'user',
    ]),
  },
  created() {
    this.getUser();
  },
  methods: {
    ...mapActions('user', [
      'fetchUser',
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
    process() {
      this.fillAccount();
    },
    setName(name) {
      this.name = name;
    },
    setEmail(email) {
      this.email = email;
    },
    fillAccount() {
      this.setName(this.user.name);
      this.setEmail(this.user.email);
    },
    resetAccount() {
      this.fillAccount();
    },
  },
};
</script>
