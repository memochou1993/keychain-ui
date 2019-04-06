<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="400px"
    >
      <v-card>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="password"
              :type="show ? 'text' : 'password'"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              name="input"
              label="Password"
              autocomplete
              @click:append="show = !show"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: true,
      password: '',
      show: false,
    };
  },
  watch: {
    dialog(value) {
      this.$emit('setUnlockDialog', value);
    },
  },
  methods: {
    setDialog(dialog) {
      this.dialog = dialog;
    },
    unlock() {
      this.setDialog(false);
      this.$store.dispatch('setUnlock', true);
    },
  },
};
</script>
