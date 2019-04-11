<template>
  <div>
    <v-dialog
      v-model="dialog"
      :max-width="400"
    >
      <v-card>
        <v-card-text>
          <v-form
            v-model="valid"
            @submit.prevent="unlockKey"
          >
            <v-text-field
              v-if="dialog"
              v-model="password"
              :error="!!error"
              :rules="[v => !!v || 'Password is required']"
              :loading="loading"
              :append-icon="`mdi-format-letter-case${capsLock ? '-upper' : '-lower'}`"
              :error-messages="errorMessages"
              type="password"
              label="Password"
              autofocus
              autocomplete
              validate-on-blur
              class="my-3"
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
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      dialog: false,
      loading: false,
      noData: false,
      error: null,
      valid: false,
      errorMessages: [],
      password: '',
      capsLock: false,
    };
  },
  computed: {
    ...mapState('key', [
      'key',
      'action',
      'selectedKey',
      'exposedKeys',
    ]),
  },
  watch: {
    dialog(value) {
      if (!value) {
        this.processed();
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.setDialog(true);
    }, 0);
  },
  methods: {
    ...mapActions('key', [
      'setAction',
      'setExposedKeys',
      'setDeprecatedKeys',
      'setUnlockDialog',
      'setViewDialog',
      'setEditDialog',
    ]),
    beforeProcess() {
      this.setLoading(true);
      this.setNoData(false);
      this.setError(null);
    },
    fetchKey() {
      this.beforeProcess();
      this.$store.dispatch('key/fetchKey', {
        params: {
          with: '',
          check: true,
          password: this.password,
        },
      })
        .then(() => {
          setTimeout(() => {
            this.process();
            this.processed();
          }, 250);
        })
        .catch((error) => {
          this.setErrorMessages(this.errorMessages.concat('Password is invalid'));
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
    process() {
      if (this.action === 'toggle') {
        this.toggleKey();
      }
      if (this.action === 'view') {
        this.viewKey();
      }
      if (this.action === 'edit') {
        this.editKey();
      }
      if (this.action === 'remove') {
        this.removeKey();
      }
    },
    processed() {
      this.setAction('');
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
    setDialog(dialog) {
      this.dialog = dialog;
    },
    setErrorMessages(errorMessages) {
      this.errorMessages = errorMessages;
    },
    setPassword(password) {
      this.password = password;
    },
    setCapsLock(capsLock) {
      this.capsLock = capsLock;
    },
    detectCapsLock(event) {
      const isCapsLock = event.getModifierState('CapsLock');
      if (this.capsLock !== isCapsLock) {
        this.setCapsLock(isCapsLock);
      }
    },
    unlockKey() {
      if (!this.password) {
        return this.setError(true);
      }
      return this.fetchKey();
    },
    toggleKey() {
      this.setExposedKeys(this.exposedKeys.concat(this.key.id));
    },
    viewKey() {
      this.setViewDialog(true);
    },
    editKey() {
      this.setEditDialog(true);
    },
    removeKey() {
      this.setDeprecatedKeys([this.selectedKey.id]);
    },
  },
};
</script>
