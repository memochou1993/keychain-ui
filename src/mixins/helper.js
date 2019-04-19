const helper = {
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
    linkify(text) {
      const regex = new RegExp(/https?:\/\/[^\s]+[a-z]/g);
      const link = text.match(regex);
      return link ? link[0] : '';
    },
    setCapsLock(capsLock) {
      this.capsLock = capsLock;
    },
    detectCapsLock(event) {
      if (!event.getModifierState) {
        return false;
      }
      const isCapsLock = event.getModifierState('CapsLock');
      if (this.capsLock !== isCapsLock) {
        this.setCapsLock(isCapsLock);
      }
      return false;
    },
  },
};

export default helper;
