<template>
  <div>
    <v-toolbar
      app
      dark
      clipped-right
      color="primary"
    >
      <v-toolbar-title
        class="headline"
      >
        Keychain
      </v-toolbar-title>
      <v-spacer />
      <KeySearch />
      <v-toolbar-items>
        <v-btn
          icon
        >
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import KeySearch from '@/components/KeySearch.vue';

export default {
  components: {
    KeySearch,
  },
};
</script>
