import axios from 'axios';
import qs from 'qs';

export default {
  namespaced: true,
  state: {
    keys: [],
    pages: 1,
    unlockedKeys: [],
    visibleKeys: [],
  },
  mutations: {
    setKeys(state, keys) {
      state.keys = keys;
    },
    setPages(state, pages) {
      state.pages = pages;
    },
    setUnlockedKeys(state, unlockedKeys) {
      state.unlockedKeys = unlockedKeys;
    },
    setVisibleKeys(state, visibleKeys) {
      state.visibleKeys = visibleKeys;
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
    fetchKey({ state, commit }, { selectedkey, params }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: `/users/me/keys/${selectedkey.id}`,
          data: qs.stringify(params),
        })
          .then(({ data }) => {
            commit('setUnlockedKeys', state.unlockedKeys.concat(data.data.id));
            commit('setVisibleKeys', state.visibleKeys.concat(data.data.id));
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    destroyKey({ state, commit }, { selectedkey }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'DELETE',
          url: `/users/me/keys/${selectedkey.id}`,
        })
          .then(({ data }) => {
            commit('setKeys', state.keys.filter(key => key.id !== selectedkey.id));
            commit('setUnlockedKeys', state.unlockedKeys.filter(visibleKey => visibleKey !== selectedkey.id));
            commit('setVisibleKeys', state.visibleKeys.filter(unlockedKey => unlockedKey !== selectedkey.id));
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setUnlockedKeys({ commit }, unlockedKeys) {
      commit('setUnlockedKeys', unlockedKeys);
    },
    setVisibleKeys({ commit }, visibleKeys) {
      commit('setVisibleKeys', visibleKeys);
    },
  },
};
