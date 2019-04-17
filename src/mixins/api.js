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
  },
};

export default api;
