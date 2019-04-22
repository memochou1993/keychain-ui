import code from '@/helpers/code';

const cache = {
  set(key, value) {
    localStorage.setItem(key, code.encode(value));
  },
  get(key) {
    return code.decode(localStorage.getItem(key));
  },
  delete(key) {
    localStorage.removeItem(key);
  },
};

export default cache;
