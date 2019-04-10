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
              v-if="dialog"
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
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      dialog: false,
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
      'setViewKey',
      'setEditKey',
      'setExposedKeys',
      'setSelectedKey',
      'setUnlockDialog',
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
          this.processed();
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
    processed() {
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
    setDialog(dialog) {
      this.dialog = dialog;
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
    unlock() {
      this.fetchKey();
    },
  },
};
</script>
