import axios from 'axios';

export default {
  namespaced: true,
  state: {
    keys: [],
    key: null,
    pages: 1,
    loaded: false,
    approved: false,
    attemption: '',
    scrollable: true,
    unlockedKeys: [],
    exposedKeys: [],
    deprecatedKeys: [],
    selectedKey: null,
    dialog: {
      unlock: false,
      create: false,
      view: false,
      edit: false,
    },
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
    setApproved(state, approved) {
      state.approved = approved;
    },
    setAttemption(state, attemption) {
      state.attemption = attemption;
    },
    setScrollable(state, scrollable) {
      state.scrollable = scrollable;
    },
    setUnlockedKeys(state, unlockedKeys) {
      state.unlockedKeys = unlockedKeys;
    },
    setExposedKeys(state, exposedKeys) {
      state.exposedKeys = exposedKeys;
    },
    setDeprecatedKeys(state, deprecatedKeys) {
      state.deprecatedKeys = deprecatedKeys;
    },
    setSelectedKey(state, selectedKey) {
      state.selectedKey = selectedKey;
    },
    setDialog(state, dialog) {
      state.dialog = { ...state.dialog, ...dialog };
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
              commit('setUnlockedKeys', [...state.unlockedKeys, !getters.isUnlocked
                ? data.data.id
                : 0]);
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
            commit('setUnlockedKeys', [...state.unlockedKeys, !getters.isUnlocked
              ? data.data.id
              : 0]);
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
    destroyKey({ state, commit }) {
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
    setKeys({ commit }, keys) {
      commit('setKeys', keys);
    },
    setKey({ commit }, key) {
      commit('setKey', key);
    },
    setApproved({ commit }, approved) {
      commit('setApproved', approved);
    },
    setAttemption({ commit }, attemption) {
      commit('setAttemption', attemption);
    },
    setScrollable({ commit }, scrollable) {
      commit('setScrollable', scrollable);
    },
    setUnlockedKeys({ commit }, unlockedKeys) {
      commit('setUnlockedKeys', unlockedKeys);
    },
    setExposedKeys({ commit }, exposedKeys) {
      commit('setExposedKeys', exposedKeys);
    },
    setDeprecatedKeys({ commit }, deprecatedKeys) {
      commit('setDeprecatedKeys', deprecatedKeys);
    },
    setSelectedKey({ commit }, selectedKey) {
      commit('setSelectedKey', selectedKey);
    },
    setDialog({ commit }, dialog) {
      commit('setDialog', dialog);
    },
  },
};
