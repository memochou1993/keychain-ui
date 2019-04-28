import Vue from 'vue';
import code from '@/helpers/code';
import vueCookie from 'vue-cookie';

const cookie = {
  prefix() {
    const app = Vue.prototype.$app;
    return app && app.name;
  },
  set(key, value, date) {
    vueCookie.set(`${this.prefix()}_${key}`, code.encode(value), date ? { expires: date } : null);
  },
  get(key) {
    return code.decode(vueCookie.get(`${this.prefix()}_${key}`));
  },
  delete(key) {
    vueCookie.delete(`${this.prefix()}_${key}`);
  },
};

export default cookie;
