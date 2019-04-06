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
    unlockedKeys: [],
    visibleKeys: [],
  },
  mutations: {
    setRefresh(state, refresh) {
      state.refresh = refresh;
    },
    setQuery(state, query) {
      state.query = query;
    },
    setUnlockedKeys(state, unlockedKeys) {
      state.unlockedKeys = unlockedKeys;
    },
    setVisibleKeys(state, visibleKeys) {
      state.visibleKeys = visibleKeys;
    },
  },
  actions: {
    setRefresh(context, refresh) {
      context.commit('setRefresh', refresh);
    },
    setQuery(context, query) {
      context.commit('setQuery', query);
    },
    setUnlockedKeys(context, unlockedKeys) {
      context.commit('setUnlockedKeys', unlockedKeys);
    },
    setVisibleKeys(context, visibleKeys) {
      context.commit('setVisibleKeys', visibleKeys);
    },
  },
});
