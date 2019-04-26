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
              :rules="[v => !!v || 'Title is required.']"
              type="text"
              label="Title"
              autofocus
              class="my-3"
            />
            <v-textarea
              v-model="content"
              :rules="[v => !!v || 'Content is required.']"
              type="text"
              label="Content"
              auto-grow
              class="my-3"
            />
            <v-text-field
              v-model="link"
              type="text"
              label="Link"
              class="my-3"
            />
            <v-switch
              v-model="lock"
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
import cache from '@/helpers/cache';
import {
  mapState, mapMutations, mapActions, mapGetters,
} from 'vuex';
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
      content: '',
      link: '',
      lock: false,
    };
  },
  computed: {
    ...mapState([
      'settings',
    ]),
    ...mapGetters([
      'defaultLock',
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
    lock(value) {
      if (value !== this.defaultLock) {
        const { data } = this.settings;
        data.lock = this.lock;
        cache.set('settings', data);
        this.setSettings({ ...this.settings, data });
      }
    },
  },
  created() {
    this.setLock(this.defaultLock);
  },
  mounted() {
    setTimeout(() => {
      this.setEnabled(true);
    }, 0);
  },
  methods: {
    ...mapMutations([
      'setSettings',
    ]),
    ...mapMutations('key', [
      'setKey',
      'setDialog',
    ]),
    ...mapActions('key', [
      'storeKey',
    ]),
    async createKey() {
      await this.beforeProcess();
      await this.storeKey({
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
    processed() {
      this.setDialog('');
    },
    setLock(lock) {
      this.lock = lock;
    },
  },
};
</script>
