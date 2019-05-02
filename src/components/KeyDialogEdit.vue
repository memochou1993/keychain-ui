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
            v-model="valid"
          >
            <v-text-field
              v-if="enabled"
              v-model="title"
              :label="$t('fields.title')"
              :rules="rules.title"
              type="text"
              autofocus
              class="my-3"
            />
            <v-textarea
              v-model="content"
              :label="$t('fields.content')"
              :rules="rules.content"
              type="text"
              auto-grow
              class="my-3"
            />
            <v-text-field
              v-model="link"
              :label="$t('fields.link')"
              type="text"
              class="my-3"
            />
            <v-switch
              v-model="lock"
              :label="$t('fields.lock')"
              color="primary"
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
            @click="resetKey"
          >
            {{ $t('actions.reset') }}
          </v-btn>
          <v-spacer />
          <v-btn
            :disabled="!valid || loading"
            color="primary"
            class="white--text"
            @click="editKey"
          >
            {{ $t('actions.edit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  mapState, mapMutations, mapActions,
} from 'vuex';
import api from '@/mixins/api';
import dialog from '@/mixins/dialog';
import validation from '@/mixins/validation';
import AppNoData from '@/components/AppNoData.vue';

export default {
  components: {
    AppNoData,
  },
  mixins: [
    api,
    dialog,
    validation,
  ],
  data() {
    return {
      valid: false,
      title: '',
      content: '',
      link: '',
      lock: false,
      rules: {
        title: [
          v => (v && !!v.trim()) || this.vt('title', 'required'),
        ],
        content: [
          v => (v && !!v.trim()) || this.vt('content', 'required'),
        ],
      },
    };
  },
  computed: {
    ...mapState('key', [
      'key',
    ]),
    persistent() {
      return this.title || this.content || this.link;
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
      'setDialog',
      'setSelectedKey',
    ]),
    ...mapActions('key', [
      'fetchKey',
      'updateKey',
    ]),
    async getKey() {
      await this.beforeProcess();
      await this.fetchKey({
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
          this.setError(error);
          this.setNoData(true);
        })
        .finally(() => {
          setTimeout(() => {
            this.setLoading(false);
          }, 1000 * 0.25);
        });
    },
    async editKey() {
      await this.beforeProcess();
      await this.updateKey({
        params: {
          with: '',
          title: this.title,
          content: this.content,
          link: this.link,
          lock: this.lock,
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
    process() {
      this.fillKey();
    },
    processed() {
      this.setKey(null);
      this.setDialog('');
      this.setSelectedKey(null);
    },
    setTitle(title) {
      this.title = title;
    },
    setContent(content) {
      this.content = content;
    },
    setLink(link) {
      this.link = link;
    },
    setLock(lock) {
      this.lock = lock;
    },
    resetKey() {
      this.fillKey();
    },
    fillKey() {
      this.setTitle(this.key.title);
      this.setContent(this.key.content);
      this.setLink(this.key.link);
      this.setLock(this.key.lock);
    },
  },
};
</script>
