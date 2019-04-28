import axios from 'axios';
import moment from 'moment';
import cookie from '@/helpers/cookie';

export default {
  namespaced: true,
  state: {
    user: null,
    payload: cookie.get('payload'),
  },
  getters: {
    authorization(state) {
      if (!state.payload) {
        return null;
      }
      return `${state.payload.data.token_type} ${state.payload.data.access_token}`;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setPayload(state, payload) {
      state.payload = payload;
    },
  },
  actions: {
    fetchToken({
      commit, dispatch, rootState, rootGetters,
    }, { params }) {
      commit('setLoaded', false, { root: true });
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: '/auth/login',
          data: params,
        })
          .then(({ data }) => {
            const date = rootGetters.defaultKeep
              ? moment(parseInt(rootState.settings.createdAt, 10)).add(rootGetters.defaultKeepDays, 'd').toDate()
              : null;
            cookie.set('payload', data, date);
            commit('setPayload', cookie.get('payload'));
            resolve(data);
          })
          .then(() => {
            dispatch('fetchUser');
          })
          .catch((error) => {
            commit('setError', error, { root: true });
            reject(error);
          })
          .finally(() => {
            commit('setLoaded', true, { root: true });
          });
      });
    },
    destroyToken({
      getters, commit,
    }) {
      commit('setLoaded', false, { root: true });
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: '/auth/logout',
          headers: {
            Authorization: getters.authorization,
          },
        })
          .then(({ data }) => {
            resolve(data);
          })
          .catch((error) => {
            commit('setError', error, { root: true });
            reject(error);
          })
          .finally(() => {
            commit('setLoaded', true, { root: true });
          });
      });
    },
    fetchUser({
      getters, commit, rootState, rootGetters,
    }) {
      commit('setLoaded', false, { root: true });
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: '/auth/user',
          headers: {
            Authorization: getters.authorization,
          },
        })
          .then(({ data }) => {
            const date = rootGetters.defaultKeep
              ? moment(parseInt(rootState.settings.createdAt, 10)).add(rootGetters.defaultKeepDays, 'd').toDate()
              : null;
            cookie.set('user', data, date);
            commit('setUser', cookie.get('user'));
            resolve(data);
          })
          .catch((error) => {
            commit('setError', error, { root: true });
            reject(error);
          })
          .finally(() => {
            commit('setLoaded', true, { root: true });
          });
      });
    },
  },
};
