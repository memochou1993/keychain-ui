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
import { mapMutations } from 'vuex';

export default {
  created() {
    this.$cookie.delete('payload');
    this.setPayload(null);
  },
  methods: {
    ...mapMutations('auth', [
      'setPayload',
    ]),
  },
}
</script>
