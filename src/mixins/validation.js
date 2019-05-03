import { mapGetters } from 'vuex';

const validation = {
  ...mapGetters([
    'defaultLanguage',
  ]),
  methods: {
    vt(field, rule, number = 0) {
      let f = this.$t(`fields.${field}`);
      f = this.defaultLanguage === 'en' ? f.toLowerCase() : f;
      return this.$tc(`rules.${rule}`, number, {
        f,
      });
    },
  },
};

export default validation;
