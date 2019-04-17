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
    linkify(text) {
      const regex = new RegExp(/https?:\/\/[^\s]+[a-z]/g);
      const link = text.match(regex);
      return link ? link[0] : '';
    },
  },
};

export default helper;
