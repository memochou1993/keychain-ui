<template>
  <div>
    <v-dialog
      v-model="enabled"
      :max-width="400"
      :persistent="!!persistent"
    >
      <v-card>
        <v-card-title>
          <v-spacer />
          <v-icon
            @click="setEnabled(false)"
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
              v-if="enabled"
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
            <v-switch
              v-model="password"
              color="primary"
              label="Lock"
            />
          </v-form>
          <AppNoData
            v-else
            :noData="noData"
            message="No key found"
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
import { mapState, mapMutations, mapActions } from 'vuex';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppNoData,
  },
  data() {
    return {
      enabled: false,
      valid: false,
      title: '',
      content: '',
      password: false,
      loading: false,
      noData: false,
      error: null,
    };
  },
  computed: {
    ...mapState('key', [
      'key',
    ]),
    persistent() {
      return this.title || this.content;
    },
  },
  watch: {
    enabled(value) {
      if (!value) {
        this.processed();
      }
    },
  },
  created() {
    this.getKey();
  },
  mounted() {
    setTimeout(() => {
      this.setEnabled(true);
    }, 0);
  },
  methods: {
    ...mapMutations('key', [
      'setKey',
      'setSelectedKey',
      'setDialog',
    ]),
    ...mapActions('key', [
      'fetchKey',
      'updateKey',
    ]),
    beforeProcess() {
      this.setLoading(true);
      this.setNoData(false);
      this.setError(null);
    },
    getKey() {
      this.beforeProcess();
      this.fetchKey({
        params: {
          with: '',
        },
      })
        .then(() => {
          setTimeout(() => {
            this.process();
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
    editKey() {
      this.beforeProcess();
      this.updateKey({
        params: {
          with: '',
          title: this.title,
          content: this.content,
          password: this.password,
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
    process() {
      this.setTitle(this.key.title);
      this.setContent(this.key.content);
      this.setPassword(this.key.password);
    },
    processed() {
      this.setKey(null);
      this.setDialog('');
      this.setSelectedKey(null);
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
    setEnabled(enabled) {
      this.enabled = enabled;
    },
    setTitle(title) {
      this.title = title;
    },
    setContent(content) {
      this.content = content;
    },
    setPassword(password) {
      this.password = password;
    },
  },
};
</script>
