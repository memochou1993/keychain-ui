import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: {
        name: 'user.keys',
      },
    },
    {
      path: '/login',
      name: 'auth.login',
      component: () => import('@/views/Auth/Login.vue'),
      meta: {
        requiresVisitor: true,
      },
    },
    {
      path: '/register',
      name: 'auth.register',
      component: () => import('@/views/Auth/Register.vue'),
      meta: {
        requiresVisitor: true,
      },
    },
    {
      path: '/logout',
      name: 'auth.logout',
      component: () => import('@/views/Auth/Logout.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/account',
      name: 'user.account',
      component: () => import('@/views/User/Account.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/keys',
      name: 'user.keys',
      component: () => import('@/views/User/Keys.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/settings',
      name: 'user.settings',
      component: () => import('@/views/User/Settings.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});
