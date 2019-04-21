import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import key from './modules/key';

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  modules: {
    auth,
    key,
  },
  state: {
    error: null,
    query: '',
    refresh: 0,
    settings: {
      auth: {
        keepDays: 7,
      },
      key: {
        strict: true,
        paginate: 15,
        pagination: false,
      },
    },
  },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    setQuery(state, query) {
      state.query = query;
    },
    setRefresh(state, refresh) {
      state.refresh = refresh;
    },
  },
  actions: {
    setError(context, error) {
      context.commit('setError', error);
    },
    setQuery(context, query) {
      context.commit('setQuery', query);
    },
    setRefresh(context, refresh) {
      context.commit('setRefresh', refresh);
    },
  },
});
