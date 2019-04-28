import code from '@/helpers/code';

const cache = {
  prefix: 'keychain',
  set(key, value) {
    localStorage.setItem(`${this.prefix}_${key}`, code.encode(value));
  },
  get(key) {
    return code.decode(localStorage.getItem(`${this.prefix}_${key}`));
  },
  delete(key) {
    localStorage.removeItem(`${this.prefix}_${key}`);
  },
};

export default cache;
