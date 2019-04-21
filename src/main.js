import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueCookie from 'vue-cookie';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './plugins/vuetify';
import './stylus/main.styl';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

Vue.use(VueCookie);

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
  render: h => h(App),
}).$mount('#app');
