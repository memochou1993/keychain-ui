<template>
  <div>
    <v-menu
      offset-x
      :close-on-content-click="attemption !== 'remove'"
      :left="!breakpoint.mdAndUp"
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
          v-if="selectedKey.link"
          :href="selectedKey.link"
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
import {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';
import api from '@/mixins/api';
import common from '@/mixins/common';
import paging from '@/mixins/paging';

export default {
  mixins: [
    api,
    common,
    paging,
  ],
  props: {
    selectedKey: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState([
      'refresh',
    ]),
    ...mapState('key', [
      'keys',
      'pages',
      'attemption',
      'deprecatedKeys',
    ]),
    ...mapGetters([
      'defaultPaging',
      'defaultPaginate',
    ]),
    ...mapGetters('key', [
      'isUnlocked',
    ]),
    isDeprecated() {
      return this.deprecatedKeys.includes(this.selectedKey.id);
    },
  },
  methods: {
    ...mapMutations([
      'setRefresh',
    ]),
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
    isDestroyed(rate) {
      return this.keys.length <= this.defaultPaginate * rate;
    },
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
    deprecateKey() {
      setTimeout(() => {
        this.shiftDeprecatedKeys();
      }, 1000 * 2);
      this.pushDeprecatedKeys(this.selectedKey.id);
    },
    async removeKey() {
      this.attempt('remove', this.selectedKey);
      if (!this.isUnlocked) {
        return this.setDialog('unlock');
      }
      if (!this.isDeprecated) {
        return this.deprecateKey();
      }
      await this.refreshToken();
      await this.destroyKey()
        .then(() => {
          if (!this.keys.length) {
            return this.setRefresh(this.refresh + 1);
          }
          if (this.isInfiniteScroll && this.pages > 1 && this.isDestroyed(2 / 3)) {
            return this.setRefresh(this.refresh + 1);
          }
          return true;
        });
      return true;
    },
  },
};
</script>
