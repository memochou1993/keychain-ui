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
            <v-text-field
              v-model="password"
              :type="'password'"
              :error="!!error"
              :loading="loading"
              :append-icon="`mdi-format-letter-case-${capsLock ? 'upper' : 'lower'}`"
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
      error: null,
      password: '',
      capsLock: false,
    };
  },
  computed: {
    ...mapState('key', [
      'selectedKey',
      'unlockDialog',
    ]),
  },
  watch: {
    dialog(value) {
      if (!value) {
        this.setSelectedKey(null);
        this.setUnlockDialog(false);
      }
    },
  },
  methods: {
    fetchKey() {
      this.setLoading(true);
      this.setError(null);
      this.$store.dispatch('key/fetchKey', {
        selectedkey: this.selectedKey,
        params: {
          with: 'user',
          password: this.password,
        },
      })
        .then(() => {
          this.setSelectedKey(null);
          this.setUnlockDialog(false);
        })
        .catch((error) => {
          this.setPassword('');
          this.setError(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 500);
        });
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setError(error) {
      this.error = error;
    },
    setSelectedKey(selectedKey) {
      this.$store.dispatch('key/setSelectedKey', selectedKey);
    },
    setUnlockDialog(unlockDialog) {
      this.$store.dispatch('key/setUnlockDialog', unlockDialog);
    },
    setPassword(password) {
      this.password = password;
    },
    setCapsLock(capsLock) {
      this.capsLock = capsLock;
    },
    detectCapsLock(event) {
      if (this.capsLock !== event.getModifierState('CapsLock')) {
        this.setCapsLock(event.getModifierState('CapsLock'));
      }
    },
    unlock() {
      this.fetchKey();
    },
  },
};
</script>
