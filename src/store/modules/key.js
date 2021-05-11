import axios from 'axios';

export default {
  namespaced: true,
  state: {
    keys: [],
    key: null,
    pages: 1,
    dialog: '',
    approved: false,
    attemption: '',
    unlockedKeys: [],
    exposedKeys: [],
    deprecatedKeys: [],
    selectedKey: null,
  },
  getters: {
    isApproved(state, getters, rootState, rootGetters) {
      return !rootGetters.defaultStrict && state.approved;
    },
    isLocked(state, getters) {
      return !!state.selectedKey && !!state.selectedKey.lock && !getters.isApproved;
    },
    isUnlocked(state, getters) {
      return !getters.isLocked || state.unlockedKeys.includes(state.selectedKey.id);
    },
  },
  mutations: {
    setKeys(state, keys) {
      state.keys = keys;
    },
    setKey(state, key) {
      state.key = key;
    },
    setPages(state, pages) {
      state.pages = pages;
    },
    setDialog(state, dialog) {
      state.dialog = dialog;
    },
    setApproved(state, approved) {
      state.approved = approved;
    },
    setAttemption(state, attemption) {
      state.attemption = attemption;
    },
    setUnlockedKeys(state, keys) {
      state.unlockedKeys = keys;
    },
    pushUnlockedKeys(state, key) {
      state.unlockedKeys.push(key);
    },
    setExposedKeys(state, keys) {
      state.exposedKeys = keys;
    },
    pushExposedKeys(state, key) {
      state.exposedKeys.push(key);
    },
    filterExposedKeys(state, key) {
      state.exposedKeys = state.exposedKeys.filter(exposedKey => exposedKey !== key);
    },
    pushDeprecatedKeys(state, key) {
      state.deprecatedKeys.push(key);
    },
    shiftDeprecatedKeys(state) {
      state.deprecatedKeys.shift();
    },
    setSelectedKey(state, key) {
      state.selectedKey = key;
    },
  },
  actions: {
    fetchKeys({
      state, commit, rootGetters,
    }, { params, args }) {
      commit('setLoaded', false, { root: true });
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: '/users/me/keys',
          headers: {
            Authorization: rootGetters['auth/authorization'],
          },
          params,
        })
          .then(({ data }) => {
            setTimeout(() => {
              commit('setKeys', args && !args.push
                ? data.data
                : [...state.keys, ...data.data]);
              commit('setPages', data.meta.last_page);
            }, 1000 * 0.25);
            resolve(data);
          })
          .catch((error) => {
            commit('setError', error, { root: true });
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoaded', true, { root: true });
            }, 1000 * 0.25);
          });
      });
    },
    fetchKey({
      state, commit, rootGetters,
    }, { params }) {
      commit('setLoaded', false, { root: true });
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: `/users/me/keys/${state.selectedKey.id}`,
          headers: {
            Authorization: rootGetters['auth/authorization'],
          },
          data: params,
        })
          .then(({ data }) => {
            setTimeout(() => {
              commit('setKey', data.data);
              commit('pushUnlockedKeys', data.data.id);
            }, 1000 * 0.25);
            resolve(data);
          })
          .catch((error) => {
            commit('setError', error, { root: true });
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoaded', true, { root: true });
            }, 1000 * 0.25);
          });
      });
    },
    storeKey({
      state, commit, rootGetters,
    }, { params }) {
      commit('setLoaded', false, { root: true });
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: '/users/me/keys',
          headers: {
            Authorization: rootGetters['auth/authorization'],
          },
          data: params,
        })
          .then(({ data }) => {
            setTimeout(() => {
              const { keys } = state;
              keys.splice(0, 0, data.data);
              commit('setKeys', keys);
              commit('pushUnlockedKeys', data.data.id);
            }, 1000 * 0.25);
            resolve(data);
          })
          .catch((error) => {
            commit('setError', error, { root: true });
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoaded', true, { root: true });
            }, 1000 * 0.25);
          });
      });
    },
    updateKey({
      state, commit, rootGetters,
    }, { params }) {
      commit('setLoaded', false, { root: true });
      return new Promise((resolve, reject) => {
        axios({
          method: 'PATCH',
          url: `/users/me/keys/${state.selectedKey.id}`,
          headers: {
            Authorization: rootGetters['auth/authorization'],
          },
          data: params,
        })
          .then(({ data }) => {
            setTimeout(() => {
              const { keys } = state;
              keys.splice(keys.map(key => key.id).indexOf(state.selectedKey.id), 1, data.data);
              commit('setKeys', keys);
            }, 1000 * 0.25);
            resolve(data);
          })
          .catch((error) => {
            commit('setError', error, { root: true });
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoaded', true, { root: true });
            }, 1000 * 0.25);
          });
      });
    },
    destroyKey({
      state, commit, rootGetters,
    }) {
      commit('setLoaded', false, { root: true });
      return new Promise((resolve, reject) => {
        axios({
          method: 'DELETE',
          url: `/users/me/keys/${state.selectedKey.id}`,
          headers: {
            Authorization: rootGetters['auth/authorization'],
          },
        })
          .then(({ data }) => {
            setTimeout(() => {
              const { keys } = state;
              keys.splice(keys.map(key => key.id).indexOf(state.selectedKey.id), 1);
              commit('setKeys', keys);
            }, 1000 * 0.25);
            resolve(data);
          })
          .catch((error) => {
            commit('setError', error, { root: true });
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoaded', true, { root: true });
            }, 1000 * 0.25);
          });
      });
    },
  },
};
