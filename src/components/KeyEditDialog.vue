<template>
  <div>
    <v-dialog
      v-model="dialog"
      :max-width="400"
      :persistent="!!title || !!content"
    >
      <v-card>
        <div
          primary-title
          class="headline text-xs-right"
        >
          <v-btn
            fab
            flat
            small
            color="secondary"
            @click="setDialog(false)"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </div>
        <v-divider />
        <v-form
          v-if="!loading"
          ref="form"
          v-model="valid"
          class="pa-3"
          @submit.prevent="update"
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
          <v-text-field
            v-model="content"
            :rules="[v => !!v || 'Content is required']"
            type="text"
            label="Content"
            class="my-3"
          />
          <v-text-field
            v-model="password"
            :append-icon="`mdi-format-letter-case${capsLock ? '-upper' : '-lower'}`"
            type="password"
            label="Password"
            autocomplete
            @keyup="detectCapsLock"
            @keydown="detectCapsLock"
            class="my-3"
          />
        </v-form>
        <AppNoData
          v-else
          :noData="noData"
          item="key"
        />
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
      password: '',
      capsLock: false,
    };
  },
  computed: {
    ...mapState('key', [
      'key',
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
    this.fetchKey();
  },
  mounted() {
    setTimeout(() => {
      this.setDialog(true);
    }, 0);
  },
  methods: {
    ...mapActions('key', [
      'setKey',
      'setEditKey',
      'setSelectedKey',
      'setEditDialog',
    ]),
    beforeProcess() {
      this.setLoading(true);
      this.setNoData(false);
      this.setError(null);
    },
    fetchKey() {
      this.beforeProcess();
      this.$store.dispatch('key/fetchKey', {
        params: {
          with: 'user',
        },
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
      this.setKey(null);
      this.setEditKey(false);
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
    setCapsLock(capsLock) {
      this.capsLock = capsLock;
    },
    detectCapsLock(event) {
      const isCapsLock = event.getModifierState('CapsLock');
      if (this.capsLock !== isCapsLock) {
        this.setCapsLock(isCapsLock);
      }
    },
    update() {
      console.log(1);
    },
  },
};
</script>
