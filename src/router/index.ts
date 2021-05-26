import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Layout from '../views/layout/index.vue';

const routeFiles = require.context('./modules', true, /\.ts$/);

const routes = routeFiles.keys().reduce((modules, modulePath) => {
  let value = routeFiles(modulePath);
  return value.default ? modules.concat(value.default) : modules;
}, []);

const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/redirect/:path*', // 刷新路由
    component: () => import(/* webpackChunkName: "login" */ '@/views/redirect/index.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/about.vue')
  },
  {
    path: '/layout',
    name: 'layout',
    component: Layout,
    children: routes
  }
];

console.log('asyncRoutes----', asyncRoutes);

const router = createRouter({
  history: createWebHashHistory(),
  routes: asyncRoutes
});

export default router;
