import axios from 'axios';
import qs from 'qs';

export default {
  namespaced: true,
  state: {
    //
  },
  mutations: {
    //
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
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    fetchKey({ commit, rootState }, { key, params }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: `/users/me/keys/${key.id}`,
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
  },
};
