const code = {
  encode(value) {
    return window.btoa(JSON.stringify({
      data: value,
      createdAt: Date.now(),
    }));
  },
  decode(value) {
    if (!value) {
      return null;
    }
    return JSON.parse(window.atob(value));
  },
};

export default code;
