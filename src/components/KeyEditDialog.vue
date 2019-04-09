<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-text>
          <v-form
            @submit.prevent="update"
          >
            {{ selectedKey.title }}
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppNoData,
  },
  data() {
    return {
      dialog: true,
    };
  },
  computed: {
    ...mapState('key', [
      'selectedKey',
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
    setKey(key) {
      this.$store.dispatch('key/setKey', key);
    },
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
