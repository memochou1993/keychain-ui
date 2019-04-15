import axios from 'axios';

export default {
  namespaced: true,
  state: {
    keys: [],
    key: null,
    pages: 1,
    pagination: false,
    loading: false,
    scroll: true,
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
    isApproved(state) {
      return !state.strict && state.approval;
    },
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
    setScroll(state, scroll) {
      state.scroll = scroll;
    },
    setPages(state, pages) {
      state.pages = pages;
    },
    setLoading(state, loading) {
      state.loading = loading;
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
    fetchKeys({ state, commit }, { params }) {
      commit('setLoading', true);
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: '/users/me/keys',
          params,
        })
          .then(({ data }) => {
            setTimeout(() => {
              commit('setPages', data.meta.last_page);
              if (state.pagination) {
                return commit('setKeys', data.data);
              }
              return commit('setKeys', [...state.keys, ...data.data]);
            }, 1000 * 0.25);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoading', false);
            }, 1000 * 0.25);
          });
      });
    },
    fetchKey({ state, getters, commit }, { params }) {
      commit('setLoading', true);
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: `/users/me/keys/${state.selectedKey.id}`,
          params,
        })
          .then(({ data }) => {
            setTimeout(() => {
              commit('setKey', data.data);
              if (!getters.isUnlocked) {
                commit('setUnlockedKeys', [...state.unlockedKeys, data.data.id]);
              }
            }, 1000 * 0.25);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoading', false);
            }, 1000 * 0.25);
          });
      });
    },
    storeKey({ state, getters, commit }, { params }) {
      commit('setLoading', true);
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
            if (!getters.isUnlocked) {
              commit('setUnlockedKeys', [...state.unlockedKeys, data.data.id]);
            }
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoading', false);
            }, 1000 * 0.25);
          });
      });
    },
    updateKey({ state, commit }, { params }) {
      commit('setLoading', true);
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
              commit('setLoading', false);
            }, 1000 * 0.25);
          });
      });
    },
    destroyKey({ state, commit }) {
      commit('setLoading', true);
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
              commit('setLoading', false);
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
    setScroll({ commit }, scroll) {
      commit('setScroll', scroll);
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
