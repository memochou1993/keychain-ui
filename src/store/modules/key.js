import axios from 'axios';
import qs from 'qs';

export default {
  namespaced: true,
  state: {
    keys: [],
    key: null,
    pages: 1,
    attempt: '',
    unlockedKeys: [],
    exposedKeys: [],
    deprecatedKeys: [],
    selectedKey: null,
    unlockDialog: false,
    viewDialog: false,
    editDialog: false,
  },
  getters: {
    isUnlocked(state) {
      if (!state.selectedKey) {
        return false;
      }
      return state.unlockedKeys.includes(state.selectedKey.id);
    },
    isDeprecated(state) {
      if (!state.selectedKey) {
        return false;
      }
      return state.deprecatedKeys.includes(state.selectedKey.id);
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
    setAttempt(state, attempt) {
      state.attempt = attempt;
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
    setUnlockDialog(state, unlockDialog) {
      state.unlockDialog = unlockDialog;
    },
    setViewDialog(state, viewDialog) {
      state.viewDialog = viewDialog;
    },
    setEditDialog(state, editDialog) {
      state.editDialog = editDialog;
    },
  },
  actions: {
    fetchKeys({ commit }, { params }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: '/users/me/keys',
          params,
        })
          .then(({ data }) => {
            setTimeout(() => {
              commit('setKeys', data.data);
              commit('setPages', data.meta.last_page);
            }, 250);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    fetchKey({ state, commit }, { params }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: `/users/me/keys/${state.selectedKey.id}`,
          data: qs.stringify(params),
        })
          .then(({ data }) => {
            commit('setKey', data.data);
            commit('setUnlockedKeys', state.unlockedKeys.concat(data.data.id));
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    updateKey({ state, commit }, { params }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'PATCH',
          url: `/users/me/keys/${state.selectedKey.id}`,
          data: qs.stringify(params),
        })
          .then(({ data }) => {
            commit('setKey', data.data);
            commit('setRefresh', true, { root: true });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    destroyKey({ state, commit }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'DELETE',
          url: `/users/me/keys/${state.selectedKey.id}`,
        })
          .then(({ data }) => {
            commit('setKeys', state.keys.filter(key => key.id !== state.selectedKey.id));
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setKeys({ commit }, keys) {
      commit('setKeys', keys);
    },
    setKey({ commit }, key) {
      commit('setKey', key);
    },
    setPages({ commit }, pages) {
      commit('setPages', pages);
    },
    setAttempt({ commit }, attempt) {
      commit('setAttempt', attempt);
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
    setUnlockDialog({ commit }, unlockDialog) {
      commit('setUnlockDialog', unlockDialog);
    },
    setViewDialog({ commit }, viewDialog) {
      commit('setViewDialog', viewDialog);
    },
    setEditDialog({ commit }, editDialog) {
      commit('setEditDialog', editDialog);
    },
  },
};
