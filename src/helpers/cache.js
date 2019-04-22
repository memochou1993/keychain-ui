const cache = {
  set(key, value) {
    localStorage.setItem(key, this.encode(value));
  },
  get(key) {
    return this.decode(localStorage.getItem(key));
  },
  delete(key) {
    localStorage.removeItem(key);
  },
  encode(value) {
    return window.btoa(JSON.stringify({
      data: value,
      created_at: Date.now(),
    }));
  },
  decode(value) {
    if (!value) {
      return null;
    }
    return JSON.parse(window.atob(value));
  },
};

export default cache;
