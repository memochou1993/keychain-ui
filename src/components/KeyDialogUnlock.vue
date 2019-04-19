<template>
  <div>
    <v-dialog
      v-model="enabled"
      :max-width="400"
    >
      <v-card>
        <v-card-text>
          <v-form
            v-model="valid"
            @submit.prevent="unlockKey"
          >
            <v-text-field
              v-if="enabled"
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
              @keypress="input"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import api from '@/mixins/api';
import dialog from '@/mixins/dialog';

export default {
  mixins: [
    api,
    dialog,
  ],
  data() {
    return {
      valid: false,
      errorMessages: [],
      password: '',
      capsLock: false,
    };
  },
  computed: {
    ...mapState('key', [
      'key',
      'attemption',
      'selectedKey',
    ]),
  },
  watch: {
    enabled(value) {
      if (!value) {
        this.processed();
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.setEnabled(true);
    }, 0);
  },
  methods: {
    ...mapMutations('key', [
      'setDialog',
      'setApproved',
      'setAttemption',
      'pushExposedKeys',
      'pushDeprecatedKeys',
      'shiftDeprecatedKeys',
    ]),
    ...mapActions('key', [
      'fetchKey',
    ]),
    getKey() {
      this.beforeProcess();
      this.fetchKey({
        params: {
          with: '',
          check: true,
          password: this.password,
        },
      })
        .then(() => {
          setTimeout(() => {
            this.process();
          }, 1000 * 0.25);
        })
        .catch((error) => {
          this.setError(error);
          this.setNoData(true);
          this.setPassword('');
          this.setErrorMessages([...this.errorMessages, 'Password is invalid']);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 1000 * 0.25);
        });
    },
    process() {
      this.setApproved(true);
      switch (this.attemption) {
        case 'toggle':
          this.toggleKey();
          break;
        case 'view':
          this.viewKey();
          break;
        case 'edit':
          this.editKey();
          break;
        case 'remove':
          this.removeKey();
          break;
        default:
          break;
      }
      this.setAttemption('');
    },
    processed() {
      this.setDialog('');
      this.setAttemption('');
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
    input() {
      this.setError(null);
      this.setErrorMessages([]);
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
      return this.getKey();
    },
    toggleKey() {
      this.setDialog('');
      this.pushExposedKeys([this.key.id]);
    },
    viewKey() {
      this.setDialog('view');
    },
    editKey() {
      this.setDialog('edit');
    },
    removeKey() {
      this.setDialog('');
      setTimeout(() => {
        this.shiftDeprecatedKeys();
      }, 1000 * 2);
      this.pushDeprecatedKeys([this.selectedKey.id]);
    },
  },
};
</script>
