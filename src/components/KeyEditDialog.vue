<template>
  <div>
    <v-dialog
      v-model="dialog"
      :max-width="400"
    >
      <v-card>
        <v-card-text>
          <v-form
            v-if="!loading"
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-if="dialog"
              v-model="title"
              :rules="[v => !!v || 'Title is required']"
              type="text"
              label="Title"
              autofocus
              class="my-3"
            />
            <v-textarea
              v-model="content"
              :rules="[v => !!v || 'Content is required']"
              type="text"
              label="Content"
              class="my-3"
            />
          </v-form>
          <AppNoData
            v-else
            :noData="noData"
            item="key"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            flat
            color="primary"
            @click="$refs.form.reset()"
          >
            Clear
          </v-btn>
          <v-spacer />
          <v-btn
            :disabled="!valid"
            color="primary"
            class="white--text"
            @click="editKey"
          >
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppNoData,
  },
  data() {
    return {
      dialog: false,
      loading: false,
      noData: false,
      error: null,
      valid: false,
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
      'setEditDialog',
    ]),
    beforeProcess() {
      this.setLoading(true);
      this.setNoData(false);
      this.setError(null);
    },
    updateKey() {
      this.beforeProcess();
      this.$store.dispatch('key/updateKey', {
        params: {
          with: '',
          title: this.title,
          content: this.content,
        },
      })
        .then(() => {
          this.processed();
        })
        .catch((error) => {
          this.setNoData(true);
          this.setError(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 250);
        });
    },
    processed() {
      this.setAttempt('');
      this.setSelectedKey(null);
      this.setEditDialog(false);
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
    setTitle(title) {
      this.title = title;
    },
    setContent(content) {
      this.content = content;
    },
    editKey() {
      this.updateKey();
    },
  },
};
</script>
