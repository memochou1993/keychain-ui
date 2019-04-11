<template>
  <div>
    <v-dialog
      v-model="dialog"
      :max-width="400"
    >
      <v-card>
        <v-card-text>
          <div
            class="content my-3"
          >
            <span>{{ selectedKey.content }}</span>
          </div>
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
      content: '',
    };
  },
  computed: {
    ...mapState('key', [
      'selectedKey',
    ]),
  },
  watch: {
    dialog(value) {
      if (!value) {
        this.processed();
      }
    },
  },
  created() {
    this.setContent(this.selectedKey.content);
  },
  mounted() {
    setTimeout(() => {
      this.setDialog(true);
    }, 0);
  },
  methods: {
    ...mapActions('key', [
      'setSelectedKey',
      'setViewDialog',
    ]),
    processed() {
      this.setSelectedKey(null);
      this.setViewDialog(false);
    },
    setDialog(dialog) {
      this.dialog = dialog;
    },
    setContent(content) {
      this.content = content;
    },
  },
};
</script>

<style lang="stylus" scoped>
.content {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
