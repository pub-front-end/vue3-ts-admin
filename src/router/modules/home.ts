import { RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页',
      permission: '/home',
      breadcrumb: [{ name: '用户管理', id: '0901' }]
    },
    component: () => import(/* webpackChunkName: "home" */ '@/views/home.vue')
  }
];
export default routes;
