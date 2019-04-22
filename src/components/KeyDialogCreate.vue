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
            <v-text-field
              v-model="link"
              type="text"
              label="Link"
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
import { mapState, mapMutations, mapActions } from 'vuex';
import api from '@/mixins/api';
import dialog from '@/mixins/dialog';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppNoData,
  },
  mixins: [
    api,
    dialog,
  ],
  data() {
    return {
      valid: false,
      title: '',
      link: '',
      content: '',
      password: false,
    };
  },
  computed: {
    ...mapState('key', [
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
  mounted() {
    setTimeout(() => {
      this.setEnabled(true);
    }, 0);
  },
  methods: {
    ...mapMutations('key', [
      'setKey',
      'setDialog',
    ]),
    ...mapActions('key', [
      'storeKey',
    ]),
    async createKey() {
      this.beforeProcess();
      await this.refreshToken();
      await this.storeKey({
        params: {
          with: '',
          title: this.title,
          content: this.content,
          link: this.link,
          password: this.password,
        },
      })
        .then(() => {
          setTimeout(() => {
            this.processed();
          }, 1000 * 0.25);
        })
        .catch((error) => {
          this.setError(error);
          this.setNoData(true);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 1000 * 0.25);
        });
    },
    processed() {
      this.setDialog('');
    },
  },
};
</script>
