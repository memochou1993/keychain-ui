import axios from 'axios';
import qs from 'qs';

export default {
  namespaced: true,
  state: {
    keys: [],
    pages: 1,
  },
  mutations: {
    setKeys(state, keys) {
      state.keys = keys;
    },
    setPages(state, pages) {
      state.pages = pages;
    },
  },
  actions: {
    fetchKeys(context, { params }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: '/users/me/keys',
          params,
        })
          .then(({ data }) => {
            setTimeout(() => {
              context.commit('setKeys', data.data);
              context.commit('setPages', data.meta.last_page);
            }, 250);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    fetchKey({ commit, rootState }, { selectedkey, params }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: `/users/me/keys/${selectedkey.id}`,
          data: qs.stringify(params),
        })
          .then(({ data }) => {
            commit('setUnlockedKeys', rootState.unlockedKeys.concat(data.data.id), { root: true });
            commit('setVisibleKeys', rootState.visibleKeys.concat(data.data.id), { root: true });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    deleteKey({ state, commit, rootState }, { selectedkey }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'DELETE',
          url: `/users/me/keys/${selectedkey.id}`,
        })
          .then(({ data }) => {
            commit('setKeys', state.keys.filter(key => key.id !== selectedkey.id));
            commit('setUnlockedKeys', rootState.unlockedKeys.filter(visibleKey => visibleKey !== selectedkey.id), { root: true });
            commit('setVisibleKeys', rootState.visibleKeys.filter(unlockedKey => unlockedKey !== selectedkey.id), { root: true });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};
