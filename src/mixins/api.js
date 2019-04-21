import moment from 'moment';
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
      const duration = moment.duration(moment().diff(moment(this.authentication.created_at)));
      if (duration.asSeconds() < this.authentication.data.expires_in) {
        return false;
      }
      return this.fetchToken({
        params: {
          grant_type: 'refresh_token',
          client_id: process.env.VUE_APP_API_CLIENT_ID,
          client_secret: process.env.VUE_APP_API_CLIENT_SECRET,
          refresh_token: this.authentication.data.refresh_token,
        },
      });
    },
  },
};

export default api;
