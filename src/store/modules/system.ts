import { setIsShowBreadcrumb, setIsShowMenu, setIsShowTagsView, setLocalLang, setLocalTheme } from '@/utils/storage';
interface stateInter {
  token: string;
  lang: string;
  theme: string;
  isShowBreadcrumb: string;
  isShowTagsView: string;
  isShowMenu: string;
  userData: Record<string, unknown>;
}

export default {
  state: {
    // token
    token: localStorage.getItem('token') || '',
    lang: 'zh', // 国际化 语言：zh-中文；en：英文
    theme: 'dark-night', // 主题 语言：dark-night-暗黑；white-day：白昼
    isShowBreadcrumb: true, // 是否显示面包屑
    isShowTagsView: true, // 是否显示标签页
    isShowMenu: true, // 进入系统菜单是否展开
    userData: {
      name: 'test',
      account: 'test'
    }
  },

  mutations: {
    setLang(state: stateInter, newVal: string) {
      state.lang = newVal;
      setLocalLang(newVal);
    },
    setTheme(state: stateInter, newVal: string) {
      state.theme = newVal;
      setLocalTheme(newVal);
    },
    setUserData(state: stateInter, newVal: Record<string, unknown>) {
      state.userData = newVal;
      // setLocalLang(JSON.stringify(newVal));
    },
    setIsShowBreadcrumb(state: stateInter, newVal: string) {
      state.isShowBreadcrumb = newVal;
      setIsShowBreadcrumb(newVal);
    },
    setIsShowMenu(state: stateInter, newVal: string) {
      state.isShowTagsView = newVal;
      setIsShowMenu(newVal);
    },
    setIsShowTagsView(state: stateInter, newVal: string) {
      state.isShowMenu = newVal;
      setIsShowTagsView(newVal);
    },

    // 初始化用户数据
    initUserData(state: stateInter, newVal: string) {
      state.token = newVal;
      localStorage.setItem('token', newVal);
    },
    //退出登录，销毁Token
    clearUserData(state: stateInter) {
      state.token = '';
      localStorage.setItem('token', '');
    }
  },
  actions: {
    // 提交用户数据
    commitInitUserData({ commit }: any, token: string) {
      token && commit('initUserData', token);
    },
    //用户退出登录
    clearInitUserData({ commit }: any) {
      commit('clearUserData', '');
    }
  }
};
