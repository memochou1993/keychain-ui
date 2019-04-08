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
      <v-list
        dense
      >
        <v-list-tile
          @click="editKey"
        >
          <v-list-tile-title>
            Edit
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          @click="destroyKey"
        >
          <v-list-tile-title>
            Remove
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    selectedKey: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('key', [
      'unlockedKeys',
    ]),
  },
  methods: {
    setEditKey(editKey) {
      this.$store.dispatch('key/setEditKey', editKey);
    },
    setEditDialog(editDialog) {
      this.$store.dispatch('key/setEditDialog', editDialog);
    },
    setSelectedKey(selectedKey) {
      this.$store.dispatch('key/setSelectedKey', selectedKey);
    },
    setUnlockDialog(unlockDialog) {
      this.$store.dispatch('key/setUnlockDialog', unlockDialog);
    },
    editKey() {
      this.setEditKey(true);
      this.setSelectedKey(this.selectedKey);
      if (!this.unlockedKeys.includes(this.selectedKey.id)) {
        return this.setUnlockDialog(true);
      }
      return this.setEditDialog(true);
    },
    destroyKey() {
      this.$store.dispatch('key/destroyKey', {
        selectedkey: this.selectedKey,
      });
    },
  },
};
</script>
