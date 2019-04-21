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
      <v-flex>
        <AppNoData />
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
  created() {
    this.logout();
  },
  methods: {
    ...mapActions('auth', [
      'destroyToken',
    ]),
    async logout() {
      this.beforeProcess();
      await this.refreshToken();
      await this.destroyToken()
        .then(() => {
          setTimeout(() => {
            this.process();
          }, 1000 * 0.25);
        })
        .catch((error) => {
          this.setError(error);
        });
    },
    process() {
      this.$router.push({
        name: 'auth.login',
      });
    },
  },
};
</script>
