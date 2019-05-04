const code = {
  encode(value) {
    return window.btoa(encodeURIComponent(JSON.stringify({
      data: value,
      createdAt: Date.now(),
    })));
  },
  decode(value) {
    if (!value) {
      return null;
    }
    return JSON.parse(decodeURIComponent(window.atob(value)));
  },
};

export default code;
