<template>
  <div>
    <v-menu
      :close-on-content-click="attemption !== 'remove'"
      :left="!breakpoint.mdAndUp"
      :offset-x="!breakpoint.mdAndUp"
    >
      <template
        v-slot:activator="{ on }"
      >
        <v-btn
          icon
          class="secondary--text"
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
          v-if="linkify(selectedKey.content)"
          :href="linkify(selectedKey.content)"
          color="info darken-2"
          target="_blank"
        >
          <v-list-tile-title>
            Open Link
          </v-list-tile-title>
        </v-list-tile>
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
            {{ isDeprecated ? 'Click to Confirm' : 'Remove' }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import helper from '@/mixins/helper';
import {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';

export default {
  mixins: [
    helper,
  ],
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
    ]),
    ...mapGetters('key', [
      'isUnlocked',
    ]),
    isDeprecated() {
      return this.deprecatedKeys.includes(this.selectedKey.id);
    },
  },
  methods: {
    ...mapMutations('key', [
      'setDialog',
      'setAttemption',
      'pushDeprecatedKeys',
      'shiftDeprecatedKeys',
      'setSelectedKey',
    ]),
    ...mapActions('key', [
      'destroyKey',
    ]),
    attempt(attemption, key) {
      this.setAttemption(attemption);
      this.setSelectedKey(key);
    },
    viewKey() {
      this.attempt('view', this.selectedKey);
      this.setDialog(!this.isUnlocked ? 'unlock' : 'view');
    },
    editKey() {
      this.attempt('edit', this.selectedKey);
      this.setDialog(!this.isUnlocked ? 'unlock' : 'edit');
    },
    removeKey() {
      this.attempt('remove', this.selectedKey);
      if (!this.isUnlocked) {
        return this.setDialog('unlock');
      }
      if (!this.isDeprecated) {
        setTimeout(() => {
          this.shiftDeprecatedKeys();
        }, 1000 * 2);
        return this.pushDeprecatedKeys(this.selectedKey.id);
      }
      return this.destroyKey();
    },
  },
};
</script>
