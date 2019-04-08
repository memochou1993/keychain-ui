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
              :append-icon="capsLock ? 'mdi-format-letter-case-upper' : 'mdi-format-letter-case-lower'"
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
export default {
  props: {
    selectedKey: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: true,
      password: '',
      loading: false,
      error: null,
      capsLock: false,
    };
  },
  watch: {
    dialog(value) {
      this.$emit('setSelectedKey', null);
      this.$emit('setUnlockDialog', value);
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
          this.setDialog(false);
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
    setDialog(dialog) {
      this.dialog = dialog;
    },
    setCapsLock(capsLock) {
      this.capsLock = capsLock;
    },
    setPassword(password) {
      this.password = password;
    },
    unlock() {
      this.fetchKey();
    },
    detectCapsLock(event) {
      if (this.capsLock !== event.getModifierState('CapsLock')) {
        this.setCapsLock(event.getModifierState('CapsLock'));
      }
    },
  },
};
</script>
