<template>
  <div>
    <v-menu
      :close-on-content-click="!isDeprecated"
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
          :color="`warning ${isDeprecated ? 'darken-4' : 'darken-2'}`"
          @click="removeKey"
        >
          <v-list-tile-title>
            {{ isDeprecated ? 'Click to confirm' : 'Remove' }}
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
    isUnlocked() {
      return this.unlockedKeys.includes(this.selectedKey.id);
    },
    isDeprecated() {
      return this.deprecatedKeys.includes(this.selectedKey.id);
    },
  },
  methods: {
    setEditKey(editKey) {
      this.$store.dispatch('key/setEditKey', editKey);
    },
    setUnlockDialog(unlockDialog) {
      this.$store.dispatch('key/setUnlockDialog', unlockDialog);
    },
    setDeprecatedKeys(deprecatedKeys) {
      this.$store.dispatch('key/setDeprecatedKeys', deprecatedKeys);
    },
    setSelectedKey(selectedKey) {
      this.$store.dispatch('key/setSelectedKey', selectedKey);
    },
    setEditDialog(editDialog) {
      this.$store.dispatch('key/setEditDialog', editDialog);
    },
    editKey() {
      this.setEditKey(true);
      this.setSelectedKey(this.selectedKey);
      if (this.selectedKey.password && !this.isUnlocked) {
        return this.setUnlockDialog(true);
      }
      return this.setEditDialog(true);
    },
    removeKey() {
      this.setSelectedKey(this.selectedKey);
      if (!this.isDeprecated) {
        return this.setDeprecatedKeys([this.selectedKey.id]);
      }
      return this.$store.dispatch('key/removeKey');
    },
  },
};
</script>
