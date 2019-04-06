import axios from 'axios';

export default {
  namespaced: true,
  state: {
    keys: [],
    pages: 1,
  },
  mutations: {
    setKeys(state, keys) {
      state.keys = keys;
    },
    setPages(state, pages) {
      state.pages = pages;
    },
  },
  actions: {
    fetchKeys(context, { params }) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: '/users/me/keys',
          params,
        })
          .then(({ data }) => {
            context.commit('setKeys', data.data);
            context.commit('setPages', data.meta.last_page);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};
