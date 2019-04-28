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
        sm10
        md8
      >
        Profile
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import api from '@/mixins/api';

export default {
  mixins: [
    api,
  ],
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
      //
    },
  },
};
</script>
