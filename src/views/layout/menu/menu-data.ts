const common = {
  icon: 'el-icon-s-tools',
  isNavigation: '1',
  isShow: '1',
  permission: null,
  sort: 19,
  type: '1'
};
export default {
  ...common,
  id: '1111',
  level: '1',
  name: '组件示例',
  parentId: '0',
  parentIds: '0',
  target: '',
  childrenMenu: [
    {
      ...common,
      id: '1111-01',
      level: '2',
      name: '表格组件',
      parentId: '1111',
      parentIds: '0,1111',
      target: '/example/pub-table',
      href: '/example/pub-table'
    },

    {
      ...common,
      id: '1111-02',
      level: '2',
      name: '布局组件',
      parentId: '1111',
      parentIds: '0,1111',
      target: '/example/pub-container',
      href: '/example/pub-container'
    },
    {
      ...common,
      id: '1111-04',
      level: '2',
      name: '详情组件',
      parentId: '1111',
      parentIds: '0,1111',
      target: '/example/pub-detail',
      href: '/example/pub-detail'
    },
    {
      ...common,
      id: '1111-05',
      level: '1',
      name: '个性化主题',
      parentId: '1111',
      parentIds: '0,1111',
      target: '/example/personalized-theme',
      href: '/example/personalized-theme'
    },
    {
      ...common,
      id: '1111-06',
      level: '2',
      name: '图表组件',
      parentId: '1111',
      parentIds: '0,1111',
      target: '/example/pub-charts',
      href: '/example/pub-charts'
    },
    {
      ...common,
      id: '1111-07',
      level: '2',
      name: '面包屑组件',
      parentId: '1111',
      parentIds: '0,1111',
      target: '/example/pub-breadcrumb',
      href: '/example/pub-breadcrumb'
    },

    {
      ...common,
      id: '1111-08',
      level: '2',
      name: '自定义首页',
      parentId: '1111',
      parentIds: '0,1111',
      target: '/example/dash-board',
      href: '/example/dash-board'
    },

    {
      ...common,
      id: '1111-09',
      level: '2',
      name: '态势大屏',
      parentId: '1111',
      parentIds: '0,1111',
      target: '/example/sit-screen',
      href: '/example/sit-screen'
    }
  ]
};
