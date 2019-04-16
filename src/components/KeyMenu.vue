<template>
  <div>
    <v-menu
      :close-on-content-click="attemption !== 'remove'"
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
      'attemption',
      'deprecatedKeys',
      'dialogs',
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
      'setAttemption',
      'setDeprecatedKeys',
      'setSelectedKey',
      'setDialogs',
    ]),
    attempt(attemption, key) {
      this.setAttemption(attemption);
      this.setSelectedKey(key);
    },
    viewKey() {
      this.attempt('view', this.selectedKey);
      this.setDialogs([...this.dialogs, !this.isUnlocked ? 'unlock' : 'view']);
    },
    editKey() {
      this.attempt('edit', this.selectedKey);
      this.setDialogs([...this.dialogs, !this.isUnlocked ? 'unlock' : 'edit']);
    },
    removeKey() {
      this.attempt('remove', this.selectedKey);
      if (!this.isUnlocked) {
        return this.setDialogs([...this.dialogs, 'unlock']);
      }
      if (!this.isDeprecated) {
        setTimeout(() => {
          this.setDeprecatedKeys(this.deprecatedKeys.filter(
            deprecatedKey => deprecatedKey !== this.selectedKey.id,
          ));
        }, 1000 * 2.5);
        return this.setDeprecatedKeys([...this.deprecatedKeys, this.selectedKey.id]);
      }
      return this.destroyKey();
    },
  },
};
</script>
