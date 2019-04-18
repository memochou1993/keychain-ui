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
    query: '',
    refresh: 0,
  },
  mutations: {
    setQuery(state, query) {
      state.query = query;
    },
    setRefresh(state, refresh) {
      state.refresh = refresh;
    },
  },
  actions: {
    setQuery(context, query) {
      context.commit('setQuery', query);
    },
    setRefresh(context, refresh) {
      context.commit('setRefresh', refresh);
    },
  },
});
