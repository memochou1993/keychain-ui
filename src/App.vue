<template>
  <div
    id="app"
  >
    <v-app>
      <TheToolbar />
      <v-content>
        <router-view />
      </v-content>
      <TheFooter />
    </v-app>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import TheToolbar from './components/TheToolbar.vue';
import TheFooter from './components/TheFooter.vue';

export default {
  name: 'App',
  components: {
    TheToolbar,
    TheFooter,
  },
  computed: {
    ...mapState([
      'error',
    ]),
  },
  watch: {
    error(value) {
      if (value) {
        this.abort(value.response.status);
        this.setError(null);
      }
    },
  },
  methods: {
    ...mapMutations([
      'setError',
    ]),
    abort(status) {
      this.$router.push({
        name: 'error',
        query: {
          status,
        },
      });
    },
  },
};
</script>
