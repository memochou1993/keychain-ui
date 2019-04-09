<template>
  <div>
    <v-menu
      offset-x
      :close-on-content-click="!isDeprecated()"
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
          @click="removeKey"
          :color="isDeprecated() ? 'warning darken-4' : 'warning darken-2'"
        >
          <v-list-tile-title>
            {{ isDeprecated() ? 'Click to confirm' : 'Remove' }}
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
      'deprecatedKeys',
    ]),
  },
  methods: {
    setEditKey(editKey) {
      this.$store.dispatch('key/setEditKey', editKey);
    },
    setSelectedKey(selectedKey) {
      this.$store.dispatch('key/setSelectedKey', selectedKey);
    },
    setDeprecatedKeys(deprecatedKeys) {
      this.$store.dispatch('key/setDeprecatedKeys', deprecatedKeys);
    },
    setUnlockDialog(unlockDialog) {
      this.$store.dispatch('key/setUnlockDialog', unlockDialog);
    },
    setEditDialog(editDialog) {
      this.$store.dispatch('key/setEditDialog', editDialog);
    },
    editKey() {
      this.setEditKey(true);
      this.setSelectedKey(this.selectedKey);
      if (!this.selectedKey.password) {
        return this.setEditDialog(true);
      }
      if (!this.unlockedKeys.includes(this.selectedKey.id)) {
        return this.setUnlockDialog(true);
      }
      return this.setEditDialog(true);
    },
    removeKey() {
      this.setSelectedKey(this.selectedKey);
      if (!this.deprecatedKeys.includes(this.selectedKey.id)) {
        return this.setDeprecatedKeys([this.selectedKey.id]);
      }
      return this.$store.dispatch('key/removeKey');
    },
    isDeprecated() {
      return this.deprecatedKeys.includes(this.selectedKey.id);
    },
  },
};
</script>
