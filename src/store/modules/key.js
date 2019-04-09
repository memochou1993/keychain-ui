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
    visibleKeys: [],
    deprecatedKeys: [],
    selectedKey: null,
    unlockDialog: false,
    editDialog: false,
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
    setVisibleKeys(state, visibleKeys) {
      state.visibleKeys = visibleKeys;
    },
    setSelectedKey(state, selectedKey) {
      state.selectedKey = selectedKey;
    },
    setDeprecatedKeys(state, deprecatedKeys) {
      state.deprecatedKeys = deprecatedKeys;
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
            if (state.viewKey) {
              commit('setVisibleKeys', state.visibleKeys.concat(data.data.id));
            }
            if (state.editKey) {
              commit('setEditDialog', true);
            }
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
            commit('setUnlockedKeys', state.unlockedKeys.filter(visibleKey => visibleKey !== state.selectedKey.id));
            commit('setVisibleKeys', state.visibleKeys.filter(unlockedKey => unlockedKey !== state.selectedKey.id));
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setKey({ commit }, key) {
      commit('setKey', key);
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
    setVisibleKeys({ commit }, visibleKeys) {
      commit('setVisibleKeys', visibleKeys);
    },
    setSelectedKey({ commit }, selectedKey) {
      commit('setSelectedKey', selectedKey);
    },
    setDeprecatedKeys({ commit }, deprecatedKeys) {
      commit('setDeprecatedKeys', deprecatedKeys);
    },
    setUnlockDialog({ commit }, unlockDialog) {
      commit('setUnlockDialog', unlockDialog);
    },
    setEditDialog({ commit }, editDialog) {
      commit('setEditDialog', editDialog);
    },
  },
};
