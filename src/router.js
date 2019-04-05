import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/:user',
      name: 'users.index',
      component: () => import('@/views/User/Index.vue'),
    },
  ],
});
