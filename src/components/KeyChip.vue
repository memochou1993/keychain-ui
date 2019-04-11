<template>
  <div>
    <div
      v-if="isSplit"
    >
      <v-chip
        small
        outline
        class="mx-0"
        @click="viewKey"
      >
        ⋯⋯
      </v-chip>
    </div>
    <div
      v-else
    >
      {{ selectedKey.content }}
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    selectedKey: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isSplit() {
      return this.selectedKey.content.indexOf('\n') !== -1;
    },
  },
  methods: {
    ...mapActions('key', [
      'setSelectedKey',
      'setViewDialog',
    ]),
    viewKey() {
      this.setSelectedKey(this.selectedKey);
      this.setViewDialog(true);
    },
  },
};
</script>
