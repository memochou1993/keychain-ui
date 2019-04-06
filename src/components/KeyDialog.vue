<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          Dialog
        </v-card-title>
        <v-card-actions>
          <v-btn
            flat
            color="primary"
            @click="setDialog(false)"
          >
            Close
          </v-btn>
          <v-spacer />
          <v-btn
            flat
            color="primary"
            @click="unlock()"
          >
            Unlock
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: true,
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
