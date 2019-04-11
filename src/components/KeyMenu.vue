<template>
  <div>
    <v-menu
      :close-on-content-click="action !== 'remove'"
      offset-x
    >
      <template
        v-slot:activator="{ on }"
      >
        <v-btn
          icon
          class="secondary--text text--darken-1"
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
          @click="viewKey"
        >
          <v-list-tile-title>
            View
          </v-list-tile-title>
        </v-list-tile>
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
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  props: {
    selectedKey: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('key', [
      'action',
      'deprecatedKeys',
    ]),
    ...mapGetters('key', [
      'isUnlocked',
    ]),
    isDeprecated() {
      return this.deprecatedKeys.includes(this.selectedKey.id);
    },
  },
  methods: {
    ...mapActions('key', [
      'destroyKey',
      'setAction',
      'setDeprecatedKeys',
      'setSelectedKey',
      'setUnlockDialog',
      'setViewDialog',
      'setEditDialog',
    ]),
    attempt(action, key) {
      this.setAction(action);
      this.setSelectedKey(key);
    },
    viewKey() {
      this.attempt('view', this.selectedKey);
      if (!this.isUnlocked) {
        return this.setUnlockDialog(true);
      }
      return this.setViewDialog(true);
    },
    editKey() {
      this.attempt('edit', this.selectedKey);
      if (!this.isUnlocked) {
        return this.setUnlockDialog(true);
      }
      return this.setEditDialog(true);
    },
    removeKey() {
      this.attempt('remove', this.selectedKey);
      if (!this.isUnlocked) {
        return this.setUnlockDialog(true);
      }
      if (!this.isDeprecated) {
        return this.setDeprecatedKeys([this.selectedKey.id]);
      }
      return this.destroyKey();
    },
  },
};
</script>
