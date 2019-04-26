import axios from 'axios';
import moment from 'moment';
import cache from '@/helpers/cache';
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
      commit, rootGetters,
    }, { params }) {
      commit('setLoaded', false, { root: true });
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: '/auth/login',
          data: params,
        })
          .then(({ data }) => {
            const keeper = cache.get('keeper');
            const date = keeper && keeper.data
              ? moment(parseInt(keeper.createdAt, 10)).add(rootGetters.defaultKeepDays, 'd').toDate()
              : null;
            cookie.set('payload', data, date);
            commit('setPayload', cookie.get('payload'));
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
            cookie.delete('payload');
            commit('setPayload', null);
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
      getters, commit,
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
            commit('setUser', data.data);
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
