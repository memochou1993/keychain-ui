import Vue from 'vue';
import Vuex from 'vuex';
import cache from '@/helpers/cache';
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
    loaded: false,
    refresh: 0,
    settings: cache.get('settings') || {
      data: {
        theme: 'indigo',
        auth: {
          keep: false,
          keepDays: 7,
        },
        key: {
          lock: false,
          strict: false,
        },
        pagination: {
          paging: 'loadMoreButton',
          paginate: 15,
        },
      },
    },
  },
  getters: {
    defaultTheme(state) {
      return state.settings.data.theme;
    },
    defaultAuthKeep(state) {
      return state.settings.data.auth.keep;
    },
    defaultAuthKeepDays(state) {
      return state.settings.data.auth.keepDays;
    },
    defaultKeyLock(state) {
      return state.settings.data.key.lock;
    },
    defaultKeyStrict(state) {
      return state.settings.data.key.strict;
    },
    defaultPaging(state) {
      return state.settings.data.pagination.paging;
    },
    defaultPaginate(state) {
      return state.settings.data.pagination.paginate;
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
