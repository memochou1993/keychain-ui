import { mapGetters, mapActions } from 'vuex';

const api = {
  data() {
    return {
      error: null,
      noData: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters('auth', [
      'authentication',
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
      this.setError(null);
      this.setNoData(false);
      this.setLoading(true);
    },
    refreshToken() {
      return this.fetchToken({
        params: {
          grant_type: 'refresh_token',
          client_id: process.env.VUE_APP_API_CLIENT_ID,
          client_secret: process.env.VUE_APP_API_CLIENT_SECRET,
          refresh_token: this.authentication.refresh_token,
        },
      });
    },
  },
};

export default api;
