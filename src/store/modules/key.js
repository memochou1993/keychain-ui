import axios from 'axios';

export default {
  namespaced: true,
  state: {
    keys: [],
    key: null,
    pages: 1,
    paginate: 15,
    loaded: false,
    dialog: '',
    approved: false,
    attemption: '',
    scrollable: true,
    unlockedKeys: [],
    exposedKeys: [],
    deprecatedKeys: [],
    selectedKey: null,
    settings: {
      pagination: false,
      strict: false,
    },
  },
  getters: {
    isApproved(state) {
      return !state.settings.strict && state.approved;
    },
    isLocked(state, getters) {
      return state.selectedKey && state.selectedKey.password && !getters.isApproved;
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
    setLoaded(state, loaded) {
      state.loaded = loaded;
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
    setScrollable(state, scrollable) {
      state.scrollable = scrollable;
    },
    setUnlockedKeys(state, keys) {
      state.unlockedKeys = keys;
    },
    pushUnlockedKeys(state, keys) {
      state.unlockedKeys = [...state.unlockedKeys, ...keys];
    },
    setExposedKeys(state, keys) {
      state.exposedKeys = keys;
    },
    pushExposedKeys(state, keys) {
      state.exposedKeys = [...state.exposedKeys, ...keys];
    },
    filterExposedKeys(state, key) {
      state.exposedKeys = state.exposedKeys.filter(exposedKey => exposedKey !== key);
    },
    pushDeprecatedKeys(state, keys) {
      state.deprecatedKeys = [...state.deprecatedKeys, ...keys];
    },
    shiftDeprecatedKeys(state) {
      state.deprecatedKeys.shift();
    },
    setSelectedKey(state, key) {
      state.selectedKey = key;
    },
  },
  actions: {
    fetchKeys({ state, commit }, { params }) {
      commit('setLoaded', false);
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: '/users/me/keys',
          params,
        })
          .then(({ data }) => {
            setTimeout(() => {
              commit('setKeys', state.settings.pagination
                ? data.data
                : [...state.keys, ...data.data]);
              commit('setPages', data.meta.last_page);
            }, 1000 * 0.25);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoaded', true);
            }, 1000 * 0.25);
          });
      });
    },
    fetchKey({ state, getters, commit }, { params }) {
      commit('setLoaded', false);
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: `/users/me/keys/${state.selectedKey.id}`,
          params,
        })
          .then(({ data }) => {
            setTimeout(() => {
              commit('setKey', data.data);
              commit('setUnlockedKeys', [!getters.isUnlocked ? data.data.id : 0]);
            }, 1000 * 0.25);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoaded', true);
            }, 1000 * 0.25);
          });
      });
    },
    storeKey({ state, getters, commit }, { params }) {
      commit('setLoaded', false);
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: '/users/me/keys',
          data: params,
        })
          .then(({ data }) => {
            const { keys } = state;
            keys.splice(0, 0, data.data);
            commit('setKeys', keys);
            commit('setUnlockedKeys', [!getters.isUnlocked ? data.data.id : 0]);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoaded', true);
            }, 1000 * 0.25);
          });
      });
    },
    updateKey({ state, commit }, { params }) {
      commit('setLoaded', false);
      return new Promise((resolve, reject) => {
        axios({
          method: 'PATCH',
          url: `/users/me/keys/${state.selectedKey.id}`,
          data: params,
        })
          .then(({ data }) => {
            const { keys } = state;
            keys.splice(keys.map(key => key.id).indexOf(state.selectedKey.id), 1, data.data);
            commit('setKeys', keys);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoaded', true);
            }, 1000 * 0.25);
          });
      });
    },
    destroyKey({ state, commit, rootState }) {
      commit('setLoaded', false);
      return new Promise((resolve, reject) => {
        axios({
          method: 'DELETE',
          url: `/users/me/keys/${state.selectedKey.id}`,
        })
          .then(({ data }) => {
            const { keys } = state;
            keys.splice(keys.map(key => key.id).indexOf(state.selectedKey.id), 1);
            commit('setKeys', keys);
            resolve(data);
          })
          .then(() => {
            if (state.pages !== 1 && state.keys.length <= state.paginate * 2 / 3) {
              commit('setRefresh', rootState.refresh + 1, { root: true });
            }
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoaded', true);
            }, 1000 * 0.25);
          });
      });
    },
  },
};
