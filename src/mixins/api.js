import moment from 'moment';
import { mapState, mapActions } from 'vuex';

const api = {
  data() {
    return {
      error: null,
      noData: false,
      loading: false,
      buffer: 60,
    };
  },
  computed: {
    ...mapState('auth', [
      'payload',
    ]),
    status() {
      if (this.error && this.error.response) {
        return this.error.response.status;
      }
      return 0;
    },
  },
  methods: {
    ...mapActions('auth', [
      'fetchToken',
    ]),
    setError(error) {
      this.error = error;
    },
    setNoData(noData) {
      this.noData = noData;
    },
    setLoading(loading) {
      this.loading = loading;
    },
    beforeProcess() {
      return new Promise(async (resolve) => {
        this.setError(null);
        this.setNoData(false);
        this.setLoading(true);
        await this.refreshToken();
        resolve();
      });
    },
    isExpended() {
      return moment().diff(this.payload.createdAt, 'seconds');
    },
    isExpired() {
      return this.payload && this.isExpended() > this.payload.data.expires_in - this.buffer;
    },
    refreshToken() {
      if (!this.isExpired()) {
        return false;
      }
      return this.fetchToken({
        params: {
          grant_type: 'refresh_token',
          client_id: process.env.VUE_APP_API_CLIENT_ID,
          client_secret: process.env.VUE_APP_API_CLIENT_SECRET,
          refresh_token: this.payload.data.refresh_token,
        },
      });
    },
    async getRecaptchaToken(action) {
      await this.$recaptchaLoaded();
      const token = await this.$recaptcha(action);
      return token;
    },
  },
};

export default api;
