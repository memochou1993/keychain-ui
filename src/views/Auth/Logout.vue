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
import cookie from '@/helpers/cookie';
import { mapMutations, mapActions } from 'vuex';
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
    ...mapMutations('auth', [
      'setPayload'
    ]),
    ...mapActions('auth', [
      'destroyToken',
    ]),
    async logout() {
      await this.beforeProcess();
      await this.destroyToken()
        .catch((error) => {
          this.setError(error);
        })
        .finally(() => {
          cookie.delete('payload');
          this.setPayload(null);
          this.$router.push({
            name: 'auth.login',
          });
        });
    },
  },
};
</script>
