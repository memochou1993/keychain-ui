const validation = {
  methods: {
    vt(field, rule, number = 0) {
      return this.$tc(`rules.${rule}`, number, { f: this.$t(`fields.${field}`) });
    },
  },
};

export default validation;
