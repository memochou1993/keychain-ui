<template>
  <div />
</template>

<script>
import { mapActions } from 'vuex';
import api from '@/mixins/api';

export default {
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
    logout() {
      this.beforeProcess();
      this.destroyToken()
        .then(() => {
          this.process();
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
