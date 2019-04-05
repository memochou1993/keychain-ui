import axios from 'axios';

export default {
  namespaced: true,
  state: {
    //
  },
  mutations: {
    //
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
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};
