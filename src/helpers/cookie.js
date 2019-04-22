import VueCookie from 'vue-cookie';

const cookie = {
  set(key, value, date) {
    VueCookie.set(key, value, date ? { expires: date } : null);
  },
  get(key) {
    return VueCookie.get(key);
  },
  delete(key) {
    VueCookie.delete(key);
  },
};

export default cookie;
