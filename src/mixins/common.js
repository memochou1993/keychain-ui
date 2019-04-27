const common = {
  data() {
    return {
      capsLock: false,
    };
  },
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint;
    },
  },
  methods: {
    capitalize(word) {
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    },
    setCapsLock(capsLock) {
      this.capsLock = capsLock;
    },
    detectCapsLock(event) {
      if (!event.getModifierState) {
        return false;
      }
      const isCapsLock = event.getModifierState('CapsLock');
      if (this.capsLock === isCapsLock) {
        return false;
      }
      return this.setCapsLock(isCapsLock);
    },
  },
};

export default common;
