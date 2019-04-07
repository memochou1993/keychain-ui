<template>
  <div>
    <v-menu
      offset-x
    >
      <template
        v-slot:activator="{ on }"
      >
        <v-btn
          icon
          class="secondary--text text--darken-2"
          v-on="on"
        >
          <v-icon>
            mdi-dots-horizontal
          </v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-tile>
          <v-list-tile-title>
            Details
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          @click="deleteKey"
        >
          <v-list-tile-title>
            Delete
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    selectedKey: {
      type: Object,
      required: true,
    },
  },
  methods: {
    deleteKey() {
      this.$store.dispatch('key/deleteKey', {
        selectedkey: this.selectedKey,
      });
    },
  },
};
</script>
