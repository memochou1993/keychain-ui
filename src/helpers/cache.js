const cache = {
  set(key, value) {
    localStorage.setItem(key, this.encode(value));
  },
  get(key) {
    return this.decode(localStorage.getItem(key));
  },
  encode(value) {
    return window.btoa(JSON.stringify({
      data: value,
      created_at: Date.now(),
    }));
  },
  decode(value) {
    return JSON.parse(window.atob(value));
  },
};

export default cache;
