import axios from 'axios';
import qs from 'qs';

export default {
  namespaced: true,
  state: {
    keys: [],
    key: null,
    pages: 1,
    viewKey: false,
    editKey: false,
    unlockedKeys: [],
    exposedKeys: [],
    deprecatedKeys: [],
    selectedKey: null,
    unlockDialog: false,
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
    setViewKey(state, viewKey) {
      state.viewKey = viewKey;
    },
    setEditKey(state, editKey) {
      state.editKey = editKey;
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
    removeKey({ state, commit }) {
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
    setViewKey({ commit }, viewKey) {
      commit('setViewKey', viewKey);
    },
    setEditKey({ commit }, editKey) {
      commit('setEditKey', editKey);
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
    setEditDialog({ commit }, editDialog) {
      commit('setEditDialog', editDialog);
    },
  },
};
