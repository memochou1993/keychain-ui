<template>
  <div>
    <v-dialog
      v-model="dialog"
      :max-width="400"
    >
      <v-card>
        <v-card-text>
          <div
            class="text my-3"
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
      title: '',
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
    this.setTitle(this.selectedKey.title);
    this.setContent(this.selectedKey.content);
  },
  mounted() {
    setTimeout(() => {
      this.setDialog(true);
    }, 0);
  },
  methods: {
    ...mapActions('key', [
      'setAttempt',
      'setSelectedKey',
      'setViewDialog',
    ]),
    processed() {
      this.setAttempt('');
      this.setSelectedKey(null);
      this.setViewDialog(false);
    },
    setDialog(dialog) {
      this.dialog = dialog;
    },
    setTitle(title) {
      this.title = title;
    },
    setContent(content) {
      this.content = content;
    },
  },
};
</script>

<style lang="stylus" scoped>
.text {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
