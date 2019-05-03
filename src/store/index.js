import Vue from 'vue';
import Vuex from 'vuex';
import cache from '@/helpers/cache';
import auth from './modules/auth';
import user from './modules/user';
import key from './modules/key';

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  modules: {
    auth,
    user,
    key,
  },
  state: {
    error: null,
    query: '',
    loaded: false,
    refresh: 0,
    settings: cache.get('settings') || {
      data: {
        language: 'en',
        lock: false,
        strict: false,
        keep: false,
        keepDays: 7,
        paging: 'loadMoreButton',
        paginate: 15,
        theme: 'indigo',
      },
    },
  },
  getters: {
    defaultLanguage(state) {
      return state.settings.data.language;
    },
    defaultLock(state) {
      return state.settings.data.lock;
    },
    defaultStrict(state) {
      return state.settings.data.strict;
    },
    defaultKeep(state) {
      return state.settings.data.keep;
    },
    defaultKeepDays(state) {
      return state.settings.data.keepDays;
    },
    defaultPaging(state) {
      return state.settings.data.paging;
    },
    defaultPaginate(state) {
      return state.settings.data.paginate;
    },
    defaultTheme(state) {
      return state.settings.data.theme;
    },
  },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    setQuery(state, query) {
      state.query = query;
    },
    setLoaded(state, loaded) {
      state.loaded = loaded;
    },
    setRefresh(state, refresh) {
      state.refresh = refresh;
    },
    setSettings(state, settings) {
      state.settings = settings;
    },
  },
});
