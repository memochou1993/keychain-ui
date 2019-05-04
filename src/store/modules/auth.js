import axios from 'axios';
import moment from 'moment';
import cache from '@/helpers/cache';
import cookie from '@/helpers/cookie';

export default {
  namespaced: true,
  state: {
    user: cookie.get('user'),
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
            setTimeout(() => {
              commit('setLoaded', true, { root: true });
            }, 1000 * 0.25);
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
            setTimeout(() => {
              commit('setLoaded', true, { root: true });
            }, 1000 * 0.25);
          });
      });
    },
    resetPassword({
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
    storeUser({
      commit,
    }, { params }) {
      commit('setLoaded', false, { root: true });
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: '/auth/register',
          data: params,
        })
          .then(({ data }) => {
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
            setTimeout(() => {
              const date = rootGetters.defaultKeep
                ? moment(parseInt(rootState.settings.createdAt, 10)).add(rootGetters.defaultKeepDays, 'd').toDate()
                : null;
              delete data.data.updated_at;
              delete data.data.created_at;
              cookie.set('user', data.data, date);
              commit('setUser', cookie.get('user'));
              cache.set('settings', JSON.parse(data.data.settings));
              commit('setSettings', cache.get('settings'), { root: true });
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
