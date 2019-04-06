<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-text>
          <v-form
            @submit.prevent="unlock()"
          >
            <v-text-field
              v-model="password"
              :type="isVisible ? 'text' : 'password'"
              :error="!!error"
              :loading="loading"
              :append-icon="isVisible ? 'mdi-eye' : 'mdi-eye-off'"
              label="Password"
              autofocus
              autocomplete
              @click:append="isVisible = !isVisible"
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
      isVisible: false,
      loading: false,
      error: null,
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
        key: this.selectedKey,
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
          }, 250);
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
    setPassword(password) {
      this.password = password;
    },
    unlock() {
      this.fetchKey();
    },
  },
};
</script>
