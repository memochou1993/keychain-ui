const validation = {
  methods: {
    vt(field, rule, number = 0) {
      return this.$tc(`rules.${rule}`, number, {
        f: this.$t(`fields.${field}`).toLowerCase(),
      });
    },
  },
};

export default validation;
