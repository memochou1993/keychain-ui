const helper = {
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint;
    },
  },
  methods: {
    capitalize(word) {
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    },
  },
};

export default helper;
