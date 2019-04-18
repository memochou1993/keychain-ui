const api = {
  data() {
    return {
      error: null,
      noData: false,
      loading: false,
    };
  },
  methods: {
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
  },
};

export default api;
