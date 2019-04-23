import code from '@/helpers/code';
import VueCookie from 'vue-cookie';

const cookie = {
  set(key, value, date) {
    VueCookie.set(key, code.encode(value), date ? { expires: date } : null);
  },
  get(key) {
    return code.decode(VueCookie.get(key));
  },
  delete(key) {
    VueCookie.delete(key);
  },
};

export default cookie;
