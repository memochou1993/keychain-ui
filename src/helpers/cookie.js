import code from '@/helpers/code';
import vueCookie from 'vue-cookie';

const cookie = {
  set(key, value, date) {
    vueCookie.set(key, code.encode(value), date ? { expires: date } : null);
  },
  get(key) {
    return code.decode(vueCookie.get(key));
  },
  delete(key) {
    vueCookie.delete(key);
  },
};

export default cookie;
