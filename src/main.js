import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from './axios/index';
import store from './store/index';
import i18n from './i18n/index';
import './plugins/vuetify';
import './stylus/main.styl';

Vue.prototype.$app = {
  name: 'keychain',
};

Vue.config.productionTip = false;

Vue.directive('scroll', {
  inserted(el, binding) {
    const f = (evt) => {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f);
      }
    };
    window.addEventListener('scroll', f);
  },
});

router.beforeEach((to, from, next) => {
  const { payload } = store.state.auth;
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!payload) {
      next({
        name: 'auth.login',
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    if (payload) {
      next({
        name: 'user.keys',
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  axios,
  i18n,
  render: h => h(App),
}).$mount('#app');
