import { RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/example/pub-container',
    name: 'pub-container',
    meta: {
      title: '布局示例' // tab页上面显示的title
    },
    component: () => import(/* webpackChunkName: "example" */ '@/components/examples/pub-container.vue')
  }
];
export default routes;
