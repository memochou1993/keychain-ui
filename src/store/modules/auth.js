import axios from 'axios';
import moment from 'moment';
import cache from '@/helpers/cache';
import cookie from '@/helpers/cookie';

export default {
  namespaced: true,
  state: {
    user: null,
    loaded: false,
    payload: cookie.get('payload'),
  },
  getters: {
    authentication(state) {
      if (!state.payload) {
        return null;
      }
      return cache.decode(state.payload);
    },
    authorization(state, getters) {
      if (!getters.authentication) {
        return null;
      }
      return `${getters.authentication.data.token_type} ${getters.authentication.data.access_token}`;
    },
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
    fetchToken({
      commit, rootState,
    }, { params }) {
      commit('setLoaded', false);
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: '/auth/login',
          data: params,
        })
          .then(({ data }) => {
            const payload = cache.encode(data);
            const keep = cache.get('keep');
            const date = keep && keep.data
              ? moment(parseInt(keep.created_at, 10)).add(rootState.settings.auth.keepDays, 'd').toDate()
              : null;
            cookie.set('payload', payload, date);
            commit('setPayload', payload);
            resolve(data);
          })
          .catch((error) => {
            commit('setError', error, { root: true });
            reject(error);
          })
          .finally(() => {
            commit('setLoaded', true);
          });
      });
    },
    destroyToken({
      getters, commit,
    }) {
      commit('setLoaded', false);
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
            commit('setLoaded', true);
          });
      });
    },
    fetchUser({
      getters, commit,
    }) {
      commit('setLoaded', false);
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
            commit('setLoaded', true);
          });
      });
    },
  },
};
