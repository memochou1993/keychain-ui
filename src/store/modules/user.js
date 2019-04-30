import axios from 'axios';

export default {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    fetchUser({
      commit, rootState, rootGetters,
    }) {
      commit('setLoaded', false, { root: true });
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: `/users/${rootState.auth.user.data.id}`,
          headers: {
            Authorization: rootGetters['auth/authorization'],
          },
        })
          .then(({ data }) => {
            setTimeout(() => {
              commit('setUser', data.data);
            }, 1000 * 0.25);
            resolve(data);
          })
          .catch((error) => {
            commit('setError', error, { root: true });
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoaded', true, { root: true });
            }, 1000 * 0.25);
          });
      });
    },
    updateUser({
      commit, rootState, rootGetters,
    }, { params }) {
      commit('setLoaded', false, { root: true });
      return new Promise((resolve, reject) => {
        axios({
          method: 'PATCH',
          url: `/users/${rootState.auth.user.data.id}`,
          headers: {
            Authorization: rootGetters['auth/authorization'],
          },
          data: params,
        })
          .then(({ data }) => {
            setTimeout(() => {
              commit('setUser', data.data);
            }, 1000 * 0.25);
            resolve(data);
          })
          .catch((error) => {
            commit('setError', error, { root: true });
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoaded', true, { root: true });
            }, 1000 * 0.25);
          });
      });
    },
    updatePassword({
      commit, rootGetters,
    }, { params }) {
      commit('setLoaded', false, { root: true });
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: '/auth/password/reset',
          headers: {
            Authorization: rootGetters['auth/authorization'],
          },
          data: params,
        })
          .then(({ data }) => {
            setTimeout(() => {
              commit('setUser', data.data);
            }, 1000 * 0.25);
            resolve(data);
          })
          .catch((error) => {
            commit('setError', error, { root: true });
            reject(error);
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoaded', true, { root: true });
            }, 1000 * 0.25);
          });
      });
    },
  },
};
