<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-text>
          <v-form
            @submit.prevent="unlock"
          >
            {{ key.title }}
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      dialog: true,
    };
  },
  computed: {
    ...mapState('key', [
      'key',
    ]),
  },
  watch: {
    dialog(value) {
      if (!value) {
        this.initializeData();
      }
    },
  },
  methods: {
    setEditKey(editKey) {
      this.$store.dispatch('key/setEditKey', editKey);
    },
    setSelectedKey(selectedKey) {
      this.$store.dispatch('key/setSelectedKey', selectedKey);
    },
    setEditDialog(editDialog) {
      this.$store.dispatch('key/setEditDialog', editDialog);
    },
    initializeData() {
      this.setEditKey(false);
      this.setSelectedKey(null);
      this.setEditDialog(false);
    },
  },
};
</script>

