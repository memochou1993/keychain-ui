<template>
  <div>
    <v-dialog
      v-model="dialog"
      :max-width="400"
    >
      <v-card>
        <v-card-text>
          <v-form
            @submit.prevent="unlock"
          >
            <v-text-field
              v-model="password"
              :type="'password'"
              :error="!!error"
              :loading="loading"
              :append-icon="`mdi-format-letter-case${capsLock ? '-upper' : '-lower'}`"
              label="Password"
              autofocus
              autocomplete
              @keyup="detectCapsLock"
              @keydown="detectCapsLock"
            />
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
      loading: false,
      noData: false,
      error: null,
      password: '',
      capsLock: false,
    };
  },
  computed: {
    ...mapState('key', [
      'selectedKey',
      'unlockDialog',
      'exposedKeys',
      'viewKey',
      'editKey',
    ]),
  },
  watch: {
    dialog(value) {
      if (!value) {
        this.fetched();
      }
    },
  },
  methods: {
    beforeFetch() {
      this.setLoading(true);
      this.setNoData(false);
      this.setError(null);
    },
    fetchKey() {
      this.beforeFetch();
      this.$store.dispatch('key/fetchKey', {
        params: {
          with: 'user',
          password: this.password,
        },
      })
        .then(({ data }) => {
          if (this.viewKey) {
            this.setExposedKeys(this.exposedKeys.concat(data.id));
          }
          if (this.editKey) {
            this.setEditDialog(true);
          }
          this.fetched();
        })
        .catch((error) => {
          this.setNoData(true);
          this.setError(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.setPassword('');
            this.setLoading(false);
          }, 250);
        });
    },
    fetched() {
      this.setViewKey(false);
      this.setEditKey(false);
      this.setUnlockDialog(false);
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setNoData(noData) {
      this.noData = noData;
    },
    setError(error) {
      this.error = error;
    },
    setPassword(password) {
      this.password = password;
    },
    setCapsLock(capsLock) {
      this.capsLock = capsLock;
    },
    setViewKey(viewKey) {
      this.$store.dispatch('key/setViewKey', viewKey);
    },
    setEditKey(editKey) {
      this.$store.dispatch('key/setEditKey', editKey);
    },
    setExposedKeys(exposedKeys) {
      this.$store.dispatch('key/setExposedKeys', exposedKeys);
    },
    setSelectedKey(selectedKey) {
      this.$store.dispatch('key/setSelectedKey', selectedKey);
    },
    setUnlockDialog(unlockDialog) {
      this.$store.dispatch('key/setUnlockDialog', unlockDialog);
    },
    setEditDialog(editDialog) {
      this.$store.dispatch('key/setEditDialog', editDialog);
    },
    detectCapsLock(event) {
      const isCapsLock = event.getModifierState('CapsLock');
      if (this.capsLock === isCapsLock) {
        return true;
      }
      return this.setCapsLock(isCapsLock);
    },
    unlock() {
      this.fetchKey();
    },
  },
};
</script>
