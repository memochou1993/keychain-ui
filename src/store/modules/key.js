import axios from 'axios';
import qs from 'qs';

export default {
  namespaced: true,
  state: {
    keys: [],
    key: null,
    pages: 1,
    strict: false,
    approval: false,
    action: '',
    unlockedKeys: [],
    exposedKeys: [],
    deprecatedKeys: [],
    selectedKey: null,
    createDialog: false,
    unlockDialog: false,
    viewDialog: false,
    editDialog: false,
  },
  getters: {
    isUnlocked(state) {
      if (!state.selectedKey) {
        return false;
      }
      if (!state.selectedKey.password) {
        return true;
      }
      if (!state.strict && state.approval) {
        return true;
      }
      return state.unlockedKeys.includes(state.selectedKey.id);
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
    setApproval(state, approval) {
      state.approval = approval;
    },
    setAction(state, action) {
      state.action = action;
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
    setCreateDialog(state, createDialog) {
      state.createDialog = createDialog;
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
            }, 1000 * 0.25);
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
            setTimeout(() => {
              commit('setKey', data.data);
              commit('setApproval', true);
              commit('setUnlockedKeys', state.unlockedKeys.concat(data.data.id));
            }, 1000 * 0.25);
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
    setApproval({ commit }, approval) {
      commit('setApproval', approval);
    },
    setAction({ commit }, action) {
      commit('setAction', action);
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
    setCreateDialog({ commit }, createDialog) {
      commit('setCreateDialog', createDialog);
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
