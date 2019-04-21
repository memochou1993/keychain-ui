const cache = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify({
      created_at: Date.now(),
      data: value,
    }));
  },
  get(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  encode(value) {
    return window.btoa(JSON.stringify({
      created_at: Date.now(),
      data: value,
    }));
  },
  decode(value) {
    return JSON.parse(window.atob(value));
  },
};

export default cache;
