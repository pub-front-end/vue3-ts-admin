const getters = {
  userData: (state: any) => state.system.userData,
  lang: (state: any) => state.system.lang,
  theme: (state: any) => state.system.theme,
  isShowBreadcrumb: (state: any) => state.system.isShowBreadcrumb,
  isShowTagsView: (state: any) => state.system.isShowTagsView,
  isShowMenu: (state: any) => state.system.isShowMenu
};

export default getters;
