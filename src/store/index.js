import Vue from 'vue';
import Vuex from 'vuex';
import key from './modules/key';

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  modules: {
    key,
  },
  state: {
    refresh: false,
    query: '',
    unlock: false,
  },
  mutations: {
    setRefresh(state, refresh) {
      state.refresh = refresh;
    },
    setQuery(state, query) {
      state.query = query;
    },
    setUnlock(state, unlock) {
      state.unlock = unlock;
    },
  },
  actions: {
    setRefresh(context, refresh) {
      context.commit('setRefresh', refresh);
    },
    setQuery(context, query) {
      context.commit('setQuery', query);
    },
    setUnlock(context, unlock) {
      context.commit('setUnlock', unlock);
    },
  },
});
