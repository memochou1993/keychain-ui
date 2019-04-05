<template>
  <div
    id="app"
  >
    <v-app>
      <TheToolbar />
      <v-content>
        <v-container
          grid-list-xl
        >
          <router-view />
        </v-container>
      </v-content>
      <TheFooter />
    </v-app>
  </div>
</template>

<script>
import TheToolbar from './components/TheToolbar.vue';
import TheFooter from './components/TheFooter.vue';

export default {
  name: 'App',
  components: {
    TheToolbar,
    TheFooter,
  },
};
</script>
