<template>
  <div>
    <v-dialog
      v-model="dialog"
      :max-width="400"
      :persistent="!!persistent"
    >
      <v-card>
        <v-card-title>
          <v-spacer />
          <v-icon
            @click="setDialog(false)"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-divider />
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
            :disabled="loading"
            flat
            color="primary"
            @click="$refs.form.reset()"
          >
            Clear
          </v-btn>
          <v-spacer />
          <v-btn
            :disabled="!valid || loading"
            color="primary"
            class="white--text"
            @click="createKey"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
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
    persistent() {
      return this.title || this.content;
    },
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
      'storeKey',
      'setKey',
      'setCreateDialog',
    ]),
    beforeProcess() {
      this.setLoading(true);
      this.setNoData(false);
      this.setError(null);
    },
    createKey() {
      this.beforeProcess();
      this.storeKey({
        params: {
          with: '',
          title: this.title,
          content: this.content,
        },
      })
        .then(() => {
          setTimeout(() => {
            this.processed();
          }, 1000 * 0.25);
        })
        .catch((error) => {
          this.setNoData(true);
          this.setError(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 1000 * 0.25);
        });
    },
    processed() {
      this.setCreateDialog(false);
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
  },
};
</script>
