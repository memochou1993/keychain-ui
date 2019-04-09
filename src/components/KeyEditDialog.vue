<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-text>
          <v-form
            v-if="!loading"
            @submit.prevent="unlock"
          >
            {{ key.title }}
          </v-form>
          <AppNoData
            v-else
            item="key"
          />
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
      loading: false,
      error: null,
    };
  },
  computed: {
    ...mapState('key', [
      'key',
      'password',
      'unlockedKeys',
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
  created() {
    if (!this.unlockedKeys.includes(this.selectedkey)) {
      this.fetchKey();
    }
  },
  methods: {
    fetchKey() {
      console.log(1);
      this.setLoading(true);
      this.setError(null);
      this.$store.dispatch('key/fetchKey', {
        selectedkey: this.selectedKey,
        params: {
          with: 'user',
          password: this.password,
        },
      })
        .catch((error) => {
          this.setError(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 250);
        });
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setError(error) {
      this.error = error;
    },
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
