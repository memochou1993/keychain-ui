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
      path: '/login',
      name: 'auth.login',
      component: () => import('@/views/Auth/Login.vue'),
    },
    {
      path: '/keys',
      name: 'user.keys',
      component: () => import('@/views/User/Keys.vue'),
    },
    {
      path: '/profile',
      name: 'user.profile',
      component: () => import('@/views/User/Profile.vue'),
    },
  ],
});
