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
    abort: 0,
    query: '',
    refresh: 0,
    settings: {
      key: {
        strict: true,
        paginate: 15,
        pagination: false,
      },
    },
  },
  mutations: {
    setAbort(state, abort) {
      state.abort = abort;
    },
    setQuery(state, query) {
      state.query = query;
    },
    setRefresh(state, refresh) {
      state.refresh = refresh;
    },
  },
  actions: {
    setAbort(context, abort) {
      context.commit('setAbort', abort);
    },
    setQuery(context, query) {
      context.commit('setQuery', query);
    },
    setRefresh(context, refresh) {
      context.commit('setRefresh', refresh);
    },
  },
});
