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
          @click="copyContent"
        >
          <v-list-tile-title>
            <v-icon
              small
              class="mr-2"
            >
              mdi-content-copy
            </v-icon>
            {{ $t('actions.copy') }}
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          @click="viewKey"
        >
          <v-list-tile-title>
            <v-icon
              small
              class="mr-2"
            >
              mdi-file-document-outline
            </v-icon>
            {{ $t('actions.view') }}
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          @click="editKey"
        >
          <v-list-tile-title>
            <v-icon
              small
              class="mr-2"
            >
              mdi-pencil
            </v-icon>
            {{ $t('actions.edit') }}
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          v-if="selectedKey.link"
          :href="selectedKey.link"
          target="_blank"
        >
          <v-list-tile-title>
            <v-icon
              small
              class="mr-2"
            >
              mdi-link
            </v-icon>
            {{ $t('actions.openLink') }}
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          @click="removeKey"
        >
          <v-list-tile-title>
            <v-icon
              small
              class="mr-2"
            >
              mdi-trash-can-outline
            </v-icon>
            {{ isDeprecated ? $t('actions.clickToConfirm') : $t('actions.remove') }}
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
    copyContent() {
      this.attempt('copy', this.selectedKey);
      if (!this.isUnlocked) {
        this.setDialog('unlock');
        return;
      }
      this.$copyText(this.replaceTags(this.selectedKey.content));
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
          if (this.keys.length <= 1) {
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
