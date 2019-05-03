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
              :label="$t('fields.password')"
              :rules="rules.password"
              :loading="loading"
              :append-icon="`mdi-format-letter-case${capsLock ? '-upper' : '-lower'}`"
              :error-messages="errorMessages"
              type="password"
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
import {
  mapState, mapMutations, mapActions,
} from 'vuex';
import api from '@/mixins/api';
import common from '@/mixins/common';
import dialog from '@/mixins/dialog';
import validation from '@/mixins/validation';

export default {
  mixins: [
    api,
    common,
    dialog,
    validation,
  ],
  data() {
    return {
      valid: false,
      password: '',
      rules: {
        password: [
          v => (v && !!v.trim()) || this.vt('password', 'required'),
        ],
      },
    };
  },
  computed: {
    ...mapState('key', [
      'key',
      'attemption',
      'selectedKey',
    ]),
    errorMessages() {
      if (this.status === 401) {
        return [this.$t('messages.unlock.failed')];
      }
      if (this.status === 429) {
        return [this.$t('messages.unlock.throttle')];
      }
      return [];
    },
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
    async getKey() {
      await this.beforeProcess();
      await this.fetchKey({
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
    setPassword(password) {
      this.password = password;
    },
    unlockKey() {
      if (!this.password) {
        return this.setError(true);
      }
      return this.getKey();
    },
    toggleKey() {
      this.setDialog('');
      this.pushExposedKeys(this.key.id);
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
      this.pushDeprecatedKeys(this.selectedKey.id);
    },
  },
};
</script>
