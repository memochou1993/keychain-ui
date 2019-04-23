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
      return moment.duration(moment().diff(moment(this.payload.createdAt))).seconds();
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
  },
};

export default api;
