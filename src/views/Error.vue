<template>
  <div>
    Error
    <router-link
      :to="{ name: 'auth.login' }"
    >
      Login
    </router-link>
  </div>
</template>

<script>
import cookie from '@/helpers/cookie';
import { mapMutations } from 'vuex';

export default {
  created() {
    cookie.delete('payload');
    this.setPayload(null);
  },
  methods: {
    ...mapMutations('auth', [
      'setPayload',
    ]),
  },
};
</script>
