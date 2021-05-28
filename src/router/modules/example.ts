import { RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/example/pub-container',
    name: 'pub-container',
    meta: {
      title: '布局示例' // tab页上面显示的title
    },
    component: () => import(/* webpackChunkName: "example" */ '@/components/examples/pub-container.vue')
  },
  {
    path: '/example/pub-table',
    name: 'pub-table',
    meta: {
      title: '表格示例', // tab页上面显示的title
      permission: false //不鉴权
    },
    component: () => import(/* webpackChunkName: "example" */ '@/components/examples/pub-table.vue')
  }
];
export default routes;
