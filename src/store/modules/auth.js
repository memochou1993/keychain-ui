import axios from 'axios';

export default {
  namespaced: true,
  state: {
    user: null,
    loaded: false,
    payload: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setLoaded(state, loaded) {
      state.loaded = loaded;
    },
    setPayload(state, payload) {
      state.payload = payload;
    },
  },
  actions: {
    fetchToken({ commit, dispatch }, { params }) {
      commit('setLoaded', false);
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: '/auth/login',
          data: params,
        })
          .then(({ data }) => {
            commit('setPayload', data);
            dispatch('fetchUser');
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            commit('setLoaded', true);
          });
      });
    },
    fetchUser({ state, commit }) {
      commit('setLoaded', false);
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: '/auth/user',
          headers: {
            Authorization: `${state.payload.token_type} ${state.payload.access_token}`,
          },
        })
          .then(({ data }) => {
            commit('setUser', data.data);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            commit('setLoaded', true);
          });
      });
    },
  },
};
